# Mini App — Ilovani qanday ishlatish

Telegram Mini App (Burger King menyu, buyurtma, bot va SMS). Quyidagi qadamlarni bajaring.

---

## 1. Telegram bot yaratish

1. Telegram da [@BotFather](https://t.me/BotFather) ga yozing.
2. `/newbot` yuboring, bot nomi va username tanlang (masalan: `@MyBurgerBot`).
3. BotFather sizga **token** beradi (masalan: `7123456789:AAH...`). Uni saqlang.

---

## 2. Supabase sozlash

1. [supabase.com](https://supabase.com) da hisob oching va yangi loyiha yarating.
2. **SQL Editor** da quyidagi fayllarni navbat bilan ishlating:
   - `supabase/menu_items.sql` — menyu jadvali va mahsulotlar (Burger, Cola, Pepsi va h.k.)
   - `supabase/orders.sql` — buyurtmalar jadvali
3. **Settings → API** dan oling:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → frontend uchun
   - **service_role** key → faqat server uchun (hech kimga bermang!)

---

## 3. Loyiha o‘rnatish

**Loyiha papkasida** (PowerShell yoki CMD):

```bash
npm install
```

**Server uchun** — yangi terminalda yoki keyin:

```bash
cd server
npm install
cd ..
```

PowerShell da bitta qatorda: `cd server; npm install; cd ..`

---

## 4. Environment fayllari

### Loyiha ildizida `.env` (frontend)

Loyiha ildizida (server emas) `.env` yarating va quyidagilarni yozing:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=anon_key_bu_yerga
VITE_API_URL=http://localhost:3002
```

### `server/.env` (backend)

`server` papkasida `.env` yarating:

```env
BOT_TOKEN=7123456789:AAH...your_bot_token
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=service_role_key_bu_yerga
ADMIN_TELEGRAM_ID=5803735374
```

`ADMIN_TELEGRAM_ID` — sizning Telegram foydalanuvchi ID ingiz (buyurtmalar shu raqamga keladi). ID ni [@userinfobot](https://t.me/userinfobot) dan olishingiz mumkin.

---

## 5. Ilovani ishga tushirish

**Terminal 1 — frontend (Vite):**

```bash
npm run dev
```

Brauzerda `https://localhost:5173` (yoki ko‘rsatilgan port) ochiladi.

**Terminal 2 — backend (server):**

```bash
npm run server
```

Server `http://localhost:3002` da ishlaydi.

---

## 6. Telegram Mini App ga ulash

Mini App faqat Telegram ichida to‘g‘ri ishlaydi. Ikkita yo‘l:

### A) Ngrok tunnel (tezkor test)

1. [ngrok.com](https://ngrok.com) da ro‘yxatdan o‘ting, auth token oling.
2. Loyiha ildizidagi `.env` ga: `NGROK_AUTHTOKEN=your_token`
3. Ikki terminalda:
   - `npm run dev` (frontend)
   - `npm run tunnel` (tunnel skripti bor bo‘lsa) yoki ngrok ni qo‘lda ishlating:
     - Frontend: `ngrok http 5173`
     - Backend: `ngrok http 3002`
4. Ngrok bergan **https** URL ni Telegram BotFather da Mini App manzili sifatida qo‘ying:
   - BotFather → `/mybots` → botingiz → **Bot Settings** → **Menu Button** yoki **Web App** → URL = `https://xxxx.ngrok.io`

### B) Deploy (asl ishlatish uchun)

- Frontend: Vercel, Netlify va h.k. ga deploy qiling.
- Backend: Render, Railway, Fly.io va h.k. ga deploy qiling.
- `VITE_API_URL` ni backend ning public URL ga o‘zgartiring.
- Bot da **Menu Button / Web App** URL ni frontend manziliga qo‘ying.

---

## 7. Finish tugmasi (admin)

Admin buyurtma xabari ostidagi **Finish** tugmasi ishlashi uchun Telegram **webhook** kerak:

Serverni deploy qilgach (yoki ngrok da backend ochiq bo‘lganda), brauzerda oching:

```
https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=https://YOUR_BACKEND_URL/api/telegram-webhook
```

Masalan: `https://api.telegram.org/bot7123456789:AAH.../setWebhook?url=https://your-app.onrender.com/api/telegram-webhook`

---

## 8. SMS (ixtiyoriy)

Foydalanuvchi buyurtma yuborganida admin raqamiga SMS kelishi uchun [Twilio](https://www.twilio.com) da hisob oching va `server/.env` ga qo‘shing:

```env
TWILIO_ACCOUNT_SID=ACxxxx
TWILIO_AUTH_TOKEN=...
TWILIO_FROM_NUMBER=+1234567890
SMS_ADMIN_PHONE=+998901234567
```

---

## Qisqacha ishlash tartibi

| Qadam | Nima qilasiz |
|-------|-------------------------------|
| 1 | BotFather dan bot + token olasiz |
| 2 | Supabase loyiha, `menu_items.sql` va `orders.sql` ishlatasiz |
| 3 | Loyiha ildizida va `server` da `.env` yozasiz |
| 4 | `npm run dev` va `npm run server` ishga tushirasiz |
| 5 | Ngrok yoki deploy orqali HTTPS URL olib, bot da Mini App URL qo‘yasiz |
| 6 | Telegram da botni ochib, menyuni ochasiz — ilova yuklanadi |
| 7 | Mahsulot tanlab **NEW ORDER** bosasiz → admin ga (va ixtiyoriy SMS) keladi, xabar ostida **Finish** tugmasi |
| 8 | Admin **Finish** bosadi → xabar «Tugallandi» bo‘ladi, tugma o‘chadi |

Savol bo‘lsa, loyihadagi `.env.example` va `server/.env` dagi izohlarni ham ko‘ring.
