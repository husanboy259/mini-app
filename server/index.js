const path = require('path');
const fs = require('fs');

require('dotenv').config({ path: path.join(__dirname, '.env') });

// Fallback: read .env manually (handles BOM / encoding)
if (!process.env.BOT_TOKEN || process.env.BOT_TOKEN.trim() === '') {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8').replace(/^\uFEFF/, '');
    const match = content.match(/BOT_TOKEN\s*=\s*["']?([^"\r\n]+)["']?/);
    if (match) process.env.BOT_TOKEN = match[1].trim();
  }
}

const BOT_TOKEN = (process.env.BOT_TOKEN || '').trim();
const SUPABASE_URL = (process.env.SUPABASE_URL || '').trim();
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
// Zakaz bosilganda buyurtma ro'yxati shu Telegram ID ga yuboriladi
const ADMIN_TELEGRAM_ID = process.env.ADMIN_TELEGRAM_ID || '5803735374';
const TWILIO_ACCOUNT_SID = (process.env.TWILIO_ACCOUNT_SID || '').trim();
const TWILIO_AUTH_TOKEN = (process.env.TWILIO_AUTH_TOKEN || '').trim();
const TWILIO_FROM_NUMBER = (process.env.TWILIO_FROM_NUMBER || '').trim();
const SMS_ADMIN_PHONE = (process.env.SMS_ADMIN_PHONE || '').trim();

// .env dan qo‘lda o‘qish (Supabase)
if ((!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) && fs.existsSync(path.join(__dirname, '.env'))) {
  const content = fs.readFileSync(path.join(__dirname, '.env'), 'utf8').replace(/^\uFEFF/, '');
  if (!SUPABASE_URL) {
    const m = content.match(/SUPABASE_URL\s*=\s*["']?([^\s#"'\r\n]+)["']?/);
    if (m) process.env.SUPABASE_URL = m[1].trim();
  }
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    const m = content.match(/SUPABASE_SERVICE_ROLE_KEY\s*=\s*["']?([^\s#"'\r\n]+)["']?/);
    if (m) process.env.SUPABASE_SERVICE_ROLE_KEY = m[1].trim();
  }
}

let supabase = null;
{
  const url = process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (url && key) supabase = require('@supabase/supabase-js').createClient(url, key);
}

let twilioClient = null;
if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
  try {
    twilioClient = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  } catch (e) {
    console.warn('Twilio init failed:', e.message);
  }
}

const express = require('express');
const cors = require('cors');
const https = require('https');
const { validateInitData, parseUserFromInitData } = require('./validateInitData.js');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.type('text/plain').send('Mini App API (backend). Zakaz yuborish uchun frontend URL ni BotFather da Mini App URL ga qo\'ying.');
});

function escapeHtml(s) {
  if (s == null || typeof s !== 'string') return '';
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Telefon raqamni E.164 ko‘rinishiga keltiradi (masalan +998901234567) */
function normalizePhoneForSms(phone) {
  if (!phone || typeof phone !== 'string') return null;
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 9) return null;
  if (digits.startsWith('998') && digits.length >= 12) return '+' + digits.slice(0, 12);
  if (digits.startsWith('998') && digits.length >= 9) return '+998' + digits.slice(3);
  if (digits.length >= 9) return '+998' + digits.slice(-9);
  return '+' + digits;
}

/** Admin raqamiga yangi buyurtma haqida SMS yuboradi (foydalanuvchi Yuborsin bosganda) */
async function sendOrderSmsToAdmin(order) {
  if (!twilioClient || !TWILIO_FROM_NUMBER || !SMS_ADMIN_PHONE) return;
  const to = normalizePhoneForSms(SMS_ADMIN_PHONE);
  if (!to) return;
  const name = order.first_name || '—';
  const username = order.telegram_username || 'nouser';
  const lines = [
    'Yangi buyurtma',
    `Mijoz: ${name} (@${username})`,
    `ID: ${order.telegram_user_id}`,
    '',
  ];
  (order.items || []).forEach((it) => {
    const n = String(it.name || '').trim() || '—';
    const qty = Number(it.quantity) || 0;
    const price = Number(it.price) || 0;
    lines.push(`${n} x${qty} — $${(price * qty).toFixed(2)}`);
  });
  lines.push('');
  lines.push(`Jami: $${Number(order.total_price).toFixed(2)}`);
  const body = lines.join('\n');
  try {
    await twilioClient.messages.create({ body, from: TWILIO_FROM_NUMBER, to });
  } catch (err) {
    console.error('SMS send error:', err.message);
  }
}

function sendTelegramMessage(chatId, text) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ chat_id: String(chatId), text, parse_mode: 'HTML' });
    const url = new URL(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`);
    const req = https.request(
      url,
      { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } },
      (res) => {
        let data = '';
        res.on('data', (ch) => (data += ch));
        res.on('end', () => {
          try {
            const j = JSON.parse(data);
            if (j.ok) resolve(j);
            else reject(new Error(j.description || 'Telegram API error'));
          } catch (e) {
            reject(e);
          }
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

/** Xabar + bitta inline tugma (masalan Finish). Xato bo‘lsa to‘liq Telegram javobini log qiladi. */
function sendTelegramMessageWithButton(chatId, text, buttonText, callbackData) {
  return new Promise((resolve, reject) => {
    const payload = {
      chat_id: String(chatId),
      text,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[{ text: buttonText, callback_data: callbackData }]],
      },
    };
    const body = JSON.stringify(payload);
    const url = new URL(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`);
    const req = https.request(
      url,
      { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } },
      (res) => {
        let data = '';
        res.on('data', (ch) => (data += ch));
        res.on('end', () => {
          try {
            const j = JSON.parse(data);
            if (j.ok) resolve(j);
            else {
              const msg = j.description || 'Telegram API error';
              console.error('[Telegram sendMessage]', msg, '| response:', data.slice(0, 200));
              reject(new Error(msg));
            }
          } catch (e) {
            reject(e);
          }
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function telegramApi(method, body) {
  return new Promise((resolve, reject) => {
    const b = JSON.stringify(body);
    const url = new URL(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`);
    const req = https.request(
      url,
      { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(b) } },
      (res) => {
        let data = '';
        res.on('data', (ch) => (data += ch));
        res.on('end', () => {
          try {
            const j = JSON.parse(data);
            if (j.ok) resolve(j);
            else reject(new Error(j.description || 'API error'));
          } catch (e) {
            reject(e);
          }
        });
      }
    );
    req.on('error', reject);
    req.write(b);
    req.end();
  });
}

// In-memory store for demo (use a DB in production)
const scores = [];

app.post('/api/score', (req, res) => {
  const initData = req.headers['x-telegram-init-data'] || req.body?.initData;
  if (!validateInitData(initData, BOT_TOKEN)) {
    return res.status(401).json({ error: 'Invalid init data' });
  }
  const user = parseUserFromInitData(initData);
  const { game, score: scoreValue } = req.body || {};
  if (typeof game !== 'string' || typeof scoreValue !== 'number') {
    return res.status(400).json({ error: 'game and score required' });
  }
  const entry = {
    userId: user?.id ?? 0,
    username: user?.username ?? 'anonymous',
    game,
    score: scoreValue,
    at: new Date().toISOString(),
  };
  scores.push(entry);
  res.json({ ok: true, entry });
});

app.get('/api/leaderboard', (req, res) => {
  const game = req.query.game;
  let list = scores;
  if (game) {
    list = scores.filter((s) => s.game === game);
  }
  const byGame = {};
  list.forEach((entry) => {
    const key = entry.game;
    if (!byGame[key]) byGame[key] = [];
    byGame[key].push(entry);
  });
  Object.keys(byGame).forEach((game) => {
    byGame[game].sort((a, b) => b.score - a.score);
    byGame[game] = byGame[game].slice(0, 50);
  });
  res.json(byGame);
});

/** Telegram webhook: Finish tugmasi bosilganda xabarni tugallandi qiladi, tugma o‘chadi */
app.post('/api/telegram-webhook', (req, res) => {
  res.sendStatus(200);
  const update = req.body;
  const cq = update?.callback_query;
  if (!cq || String(cq.from?.id) !== String(ADMIN_TELEGRAM_ID)) return;
  const orderId = cq.data;
  const chatId = cq.message?.chat?.id;
  const messageId = cq.message?.message_id;
  const oldText = cq.message?.text || '';
  if (!orderId || !chatId || messageId == null) return;
  const newText = oldText.replace(/^🍔\s*Yangi buyurtma/, '✅ Tugallandi').trim() || '✅ Tugallandi';
  Promise.all([
    telegramApi('answerCallbackQuery', { callback_query_id: cq.id }),
    telegramApi('editMessageText', {
      chat_id: chatId,
      message_id: messageId,
      text: newText,
      parse_mode: 'HTML',
    }),
    telegramApi('editMessageReplyMarkup', {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: { inline_keyboard: [] },
    }),
  ]).catch((err) => console.warn('Telegram webhook finish:', err.message));
});

app.post('/api/order-notify', async (req, res) => {
  const initData = req.headers['x-telegram-init-data'] || req.body?.initData;
  if (!validateInitData(initData, BOT_TOKEN)) {
    console.warn('[order-notify] 401 Invalid init data (BOT_TOKEN yoki initData tekshiring)');
    return res.status(401).json({ error: 'Invalid init data' });
  }
  const orderId = req.body?.orderId;
  if (!orderId || !supabase) {
    console.warn('[order-notify] 400 orderId yoki Supabase yo\'q');
    return res.status(400).json({ error: 'orderId required and Supabase must be configured' });
  }
  const { data: order, error } = await supabase.from('orders').select('*').eq('id', orderId).single();
  if (error || !order) {
    console.warn('[order-notify] 404 Order not found:', orderId, error?.message);
    return res.status(404).json({ error: 'Order not found' });
  }
  console.log('[order-notify] Admin ga yuborilmoqda, orderId:', orderId, 'admin:', ADMIN_TELEGRAM_ID);
  const firstName = escapeHtml(order.first_name || '—');
  const username = escapeHtml(order.telegram_username || 'nouser');
  const lines = [
    '<b>🍔 Yangi buyurtma</b>',
    '',
    `👤 <b>Foydalanuvchi:</b> ${firstName} (@${username})`,
    `🆔 ID: <code>${order.telegram_user_id}</code>`,
    '',
    '<b>Buyurtma:</b>',
  ];
  (order.items || []).forEach((it) => {
    const name = escapeHtml(String(it.name || ''));
    const emoji = it.emoji || '•';
    const qty = Number(it.quantity) || 0;
    const price = Number(it.price) || 0;
    lines.push(`${emoji} ${name} × ${qty} — $${(price * qty).toFixed(2)}`);
  });
  lines.push('');
  lines.push(`<b>Jami: $${Number(order.total_price).toFixed(2)}</b>`);
  const text = lines.join('\n');
  try {
    await sendTelegramMessageWithButton(ADMIN_TELEGRAM_ID, text, 'Finish', orderId);
    await sendOrderSmsToAdmin(order);
    const userLines = ['✅ <b>Buyurtmangiz qabul qilindi</b>\n'];
    (order.items || []).forEach((it) => {
      const name = escapeHtml(String(it.name || ''));
      const emoji = it.emoji || '•';
      const qty = Number(it.quantity) || 0;
      const price = Number(it.price) || 0;
      userLines.push(`${emoji} ${name} × ${qty} — $${(price * qty).toFixed(2)}`);
    });
    userLines.push('');
    userLines.push(`<b>Jami: $${Number(order.total_price).toFixed(2)}</b>\nRahmat!`);
    const userText = userLines.join('\n');
    try {
      await sendTelegramMessage(String(order.telegram_user_id), userText);
    } catch (userErr) {
      console.warn('Telegram to user (order confirmation):', userErr.message);
    }
    res.json({ ok: true });
    console.log('[order-notify] Admin ga yuborildi.');
  } catch (err) {
    console.error('[order-notify] Telegram xato:', err.message, '(yuqoridagi [Telegram sendMessage] qatorini ko\'ring; BOT_TOKEN, ADMIN_TELEGRAM_ID, bot bloklanmaganligini tekshiring)');
    res.status(500).json({ error: 'Failed to send to bot', details: err.message });
  }
});

function requireAdmin(req, res) {
  const initData = req.headers['x-telegram-init-data'] || req.body?.initData;
  if (!validateInitData(initData, BOT_TOKEN)) {
    res.status(401).json({ error: 'Invalid init data' });
    return null;
  }
  const user = parseUserFromInitData(initData);
  if (!user || String(user.id) !== String(ADMIN_TELEGRAM_ID)) {
    res.status(403).json({ error: 'Admin only' });
    return null;
  }
  return initData;
}

app.post('/api/admin/menu/items', async (req, res) => {
  if (requireAdmin(req, res) == null) return;
  if (!supabase) return res.status(503).json({ error: 'Supabase not configured' });
  const { name, price, emoji } = req.body || {};
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'name required' });
  }
  const numPrice = Number(price);
  if (Number.isNaN(numPrice) || numPrice < 0) {
    return res.status(400).json({ error: 'price must be a non-negative number' });
  }
  const { data, error } = await supabase
    .from('menu_items')
    .insert({ name: name.trim(), price: numPrice, emoji: (emoji && String(emoji).trim()) || '🍽️' })
    .select('id, name, price, emoji')
    .single();
  if (error) {
    console.error('Supabase insert error:', error);
    return res.status(500).json({ error: error.message });
  }
  res.json({ ok: true, item: data });
});

app.delete('/api/admin/menu/items/:id', async (req, res) => {
  if (requireAdmin(req, res) == null) return;
  if (!supabase) return res.status(503).json({ error: 'Supabase not configured' });
  const id = req.params.id;
  if (!id) return res.status(400).json({ error: 'id required' });
  const { error } = await supabase.from('menu_items').delete().eq('id', id);
  if (error) {
    console.error('Supabase delete error:', error);
    return res.status(500).json({ error: error.message });
  }
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3002;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    if (!BOT_TOKEN) console.warn('BOT_TOKEN not set: initData validation will fail');
    if (!supabase) console.warn('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set: order-notify will fail');
    if (!twilioClient || !TWILIO_FROM_NUMBER || !SMS_ADMIN_PHONE) console.warn('TWILIO_* or SMS_ADMIN_PHONE not set: SMS will not be sent');
  });
}
module.exports = app;
