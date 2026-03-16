# Vercel’da deploy qilish (frontend + backend, adminga xabar keladi)

Bitta loyiha: frontend (Mini App) va backend (API) **Vercel** da, bitta URL. Zakaz yuborilganda admin Telegram’da xabar oladi.

---

## 1. Tayyorgarlik

- Loyiha **GitHub** da bo‘lishi kerak (git init, commit, GitHub’ga push qiling).
- **server/.env** dagi maxfiy ma’lumotlarni Vercel’da **Environment Variables** ga qo‘yasiz (repo’da .env commit qilinmasin).

---

## 2. Vercel’ga ulash

1. [vercel.com](https://vercel.com) → **Sign up** / **Log in** (GitHub bilan).
2. **Add New** → **Project** → GitHub’dagi **mini-app** (yoki loyiha nomingiz) reponi tanlang.
3. **Import** bosing.

---

## 3. Build sozlamalari

Vercel loyihani avtomatik aniqlaydi (Vite). Qo‘lda o‘zgartirsangiz:

| Sozlamalar      | Qiymat           |
|-----------------|------------------|
| **Framework Preset** | Vite        |
| **Build Command**    | `npm run build` |
| **Output Directory** | `dist`      |
| **Install Command**  | `npm install && cd server && npm install` (server dependencies uchun) |

*(Agar **vercel.json** loyihada bo‘lsa, bu qismlar u yerdan olinadi.)*

---

## 4. Environment Variables (muhim)

**Settings** → **Environment Variables** da qo‘shing (barcha muhitlar: Production, Preview, Development):

| Key | Value | Izoh |
|-----|--------|------|
| `VITE_API_URL` | `https://YOUR-PROJECT.vercel.app` | **Birinchi deploy** dan keyin chiqqan URL ni qo‘ying (masalan `https://mini-app-xxx.vercel.app`). Keyin **Redeploy** qiling. |
| `BOT_TOKEN` | Telegram bot token | server/.env dagi |
| `SUPABASE_URL` | `https://xxxxx.supabase.co` | server/.env dagi |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role kalit | server/.env dagi |
| `ADMIN_TELEGRAM_ID` | `5803735374` | Admin Telegram ID |

**VITE_API_URL** bo‘yicha: birinchi marta deploy qilgach, loyiha URL’i chiqadi (masalan `https://mini-app-abc123.vercel.app`). Shu URL ni **VITE_API_URL** ga qo‘ying va **Redeploy** bosing (Settings → Environment Variables → Save → Deployments → … → Redeploy).

---

## 5. Deploy

**Deploy** bosing. Birinchi build 2–5 daqiqa davom etadi. Tayyor bo‘lgach, loyiha URL’i ko‘rinadi.

---

## 6. Telegram: Mini App URL va Webhook

1. **BotFather** → **Configure Mini App** → **Configure Mini App URL** → Vercel URL ni yuboring (masalan `https://mini-app-xxx.vercel.app`, oxirida `/` bo‘lmasin).
2. **Finish** tugmasi** ishlashi uchun Telegram webhook: brauzerda oching (BOT_TOKEN o‘rniga o‘zingizning token):
   ```text
   https://api.telegram.org/botBOT_TOKEN/setWebhook?url=https://YOUR-PROJECT.vercel.app/api/telegram-webhook
   ```
   So‘rov muvaffaqiyatli bo‘lsa, `{"ok":true}` qaytadi.

---

## 7. Tekshirish

- Telegram’da botni oching → **Menu** → **Open App** — Mini App ochiladi.
- Katalogdan taom tanlab **Savat** → **Yuborish** — zakaz saqlanadi va **admin** (ADMIN_TELEGRAM_ID) Telegram’da xabar oladi.

---

## Qisqacha

| Narsa | Qayerda |
|-------|---------|
| Frontend | Vercel (dist), bitta domain |
| Backend (API) | `/api/*` — Vercel serverless (server/index.js) |
| VITE_API_URL | Vercel env = `https://YOUR-PROJECT.vercel.app` (birinci deploy’dan keyin qo‘yib, Redeploy) |
| BotFather Mini App URL | `https://YOUR-PROJECT.vercel.app` |
| Webhook | `https://YOUR-PROJECT.vercel.app/api/telegram-webhook` |
