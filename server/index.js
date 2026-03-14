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

const express = require('express');
const cors = require('cors');
const { validateInitData, parseUserFromInitData } = require('./validateInitData.js');

const app = express();
app.use(cors());
app.use(express.json());

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

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  if (!BOT_TOKEN) console.warn('BOT_TOKEN not set: initData validation will fail');
});
