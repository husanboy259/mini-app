# Zakaz adminga kelmasa — tekshiruv ro‘yxati

Agar mini appda **Yuborish** bosilganda siz (admin) Telegram da xabar olmasangiz yoki "yana kemayabdi" bo‘lsa, quyidagilarni tekshiring.

---

## 0. Birinchi marta — 3 ta narsa majburiy

| # | Qayerda | Nima qilish |
|---|---------|-------------|
| A | **Loyiha ildizida** `.env` yarating (server/ emas) | Ichiga yozing: `VITE_API_URL=https://BACKEND_NGROK_URL` — backend uchun **ikkinchi** ngrok (port 3002). Birinchi ngrok frontend (5173), ikkinchisi server (3002). |
| B | **server/.env** | `SUPABASE_URL=https://xxxxx.supabase.co` va `SUPABASE_SERVICE_ROLE_KEY=eyJ...` (Supabase Dashboard → Project Settings → API: Project URL va **service_role** kalit). |
| C | **Ishga tushirish** | Terminal 1: `npm run dev:tunnel`. Terminal 2: `npm run tunnel` (frontend URL — BotFather ga). Terminal 3: `npm run tunnel:server` — chiqqan URL ni **loyiha ildizidagi .env** ga `VITE_API_URL=...` qilib qo‘ying. Terminal 4: `cd server && npm run start`. Keyin frontend ni qayta ishga tushiring (Terminal 1). |

**Muhim:** Telegram Mini App telefonda ochiladi — u faqat **internetdagi** URL ga so‘rov yuboradi. `localhost:3002` telefonda ishlamaydi. Shuning uchun backend ni ham ngrok bilan ochishingiz kerak (ikkinchi tunnel, port 3002).

---

## 1. VITE_API_URL (eng tez-tez sabab)

**Loyiha ildizidagi `.env`** (server papkasi emas) da:

```
VITE_API_URL=https://your-backend-url
```

- **Local:** server faqat kompyuteringizda ishlasa, Mini App **Telegram** dan ochilganda telefon `localhost` ga so‘rov yubora olmaydi — **VITE_API_URL** har doim **internetdan ochiq** backend bo‘lishi kerak (ikkinchi ngrok yoki deploy).
- **Ngrok:** backend uchun `ngrok http 3002` qilib, chiqqan `https://....ngrok-free.app` ni `.env` da `VITE_API_URL=...` qiling.
- So‘ng **frontend ni qayta ishga tushiring** (`npm run dev` yoki `npm run dev:tunnel`), chunki `VITE_*` o‘zgaruvchilar build vaqtida o‘rnatiladi.

Agar `VITE_API_URL` bo‘sh bo‘lsa, server umuman chaqirilmaydi va admin xabar olmaydi. Brauzer konsolida: *"VITE_API_URL sozlanmagan"* chiqadi.

---

## 2. Server ishlayaptimi?

Terminalda:

```bash
cd server
npm run start
```

`Server running on http://localhost:3002` ko‘rinishi kerak. Bu terminalni yopmang.

---

## 3. server/.env — BOT_TOKEN, ADMIN_TELEGRAM_ID va Supabase

**server/.env** da:

- **BOT_TOKEN** — BotFather dan olingan token (faqat bitta bot, bo‘sh joy yo‘q).
- **ADMIN_TELEGRAM_ID** — sizning Telegram foydalanuvchi ID ingiz (raqam). [@userinfobot](https://t.me/userinfobot) ga yozib ID ni oling.
- **SUPABASE_URL** va **SUPABASE_SERVICE_ROLE_KEY** — **majburiy**. Server buyurtmani Supabase dan o‘qib admin ga yuboradi. Agar ular bo‘lmasa, `400 orderId yoki Supabase yo'q` yoki xabar ketmaydi. Supabase Dashboard → **Project Settings → API**: *Project URL* ni `SUPABASE_URL` ga, *service_role* (secret) kalitni `SUPABASE_SERVICE_ROLE_KEY` ga qo‘ying (anon key emas).

Agar ADMIN_TELEGRAM_ID boshqa odamniki bo‘lsa, xabar unga boradi, sizga emas.

---

## 4. Server loglari

Zakaz yuborilganda **server** terminalida quyidagilar chiqadi:

- `[order-notify] Admin ga yuborilmoqda, orderId: ...` — so‘rov keldi, admin ga yuborilmoqda.
- `[order-notify] Admin ga yuborildi.` — Telegram ga yuborildi.
- `401 Invalid init data` — BOT_TOKEN yoki initData noto‘g‘ri (Mini App to‘g‘ri bot orqali ochilganini tekshiring).
- `400 orderId yoki Supabase yo'q` — **server/.env** da `SUPABASE_URL` va `SUPABASE_SERVICE_ROLE_KEY` qo‘yilmagan. Ularni Supabase Dashboard → API dan oling.
- `404 Order not found` — Supabase da buyurtma topilmadi (RLS yoki boshqa loyiha).
- `Telegram xato: ...` — BOT_TOKEN yoki ADMIN_TELEGRAM_ID xato, yoki bot bloklangan.

---

## 5. Bot bilan chat

Admin (siz) botda kamida bir marta **Start** (/start) bosgan bo‘lishingiz kerak. Keyin bot sizga xabar yubora oladi.

**Ilgari ishlardi, hozir yubormayapti:** Server terminalida `[order-notify] Telegram xato:` va `[Telegram sendMessage]` qatorini qidiring. Agar *"Forbidden: bot was blocked by the user"* bo‘lsa — admin (siz) botni bloklagansiz, blokni olib tashlang va botga /start yozing. *"Bad Request: chat not found"* — `ADMIN_TELEGRAM_ID` noto‘g‘ri ([@userinfobot](https://t.me/userinfobot) dan ID ni qayta oling).

---

## 6. Qisqacha

| Narsa | Qayerda | Nima qilish |
|-------|---------|-------------|
| Backend manzil | Loyiha ildizidagi `.env` | `VITE_API_URL=https://...` (ngrok yoki deploy URL), keyin frontend ni qayta ishga tushirish |
| Server | Terminal | `cd server; npm run start` |
| Admin ID | server/.env | `ADMIN_TELEGRAM_ID=your_telegram_id` (@userinfobot) |
| Bot token | server/.env | `BOT_TOKEN=...` (BotFather) |
| Supabase | server/.env | `SUPABASE_URL=...` va `SUPABASE_SERVICE_ROLE_KEY=...` (Dashboard → API) |
