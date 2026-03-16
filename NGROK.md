# Tunnel bilan Mini App URL olish (BotFather uchun)

Ngrok loyihada — **npm run tunnel**. Parol so‘ralmaydi.

---

## ERR_NGROK_3200 — "The endpoint is offline" / "page isn't working"

Bu xato **tunnel hozir ishlamayotganini** bildiradi (tunnel to‘xtatilgan yoki kompyuter qayta ishga tushgan). **Eski** ngrok URL (masalan `furrowy-young-undeputed.ngrok-free.dev`) endi ishlamaydi — tunnel qayta yoqilganda **yangi** URL chiqadi.

- **Faqat brauzerda tekshirish:** `http://localhost:5173` oching (ngrok emas).
- **Telegram da Mini App:** tunnel ni qayta ishga tushiring, chiqqan **yangi** URL ni BotFather ga qo‘ying.

**Qilish kerak (2 ta terminal, ikkalasini ham yopmang):**

| Qadam | Buyruq | Vazifa |
|-------|--------|--------|
| 1 | `npm run dev:tunnel` | Vite (5173) — birinchi terminalda |
| 2 | `npm run tunnel` | Ngrok — ikkinchi terminalda; chiqqan **yangi** URL ni nusxalang |
| 3 | BotFather → Configure Mini App URL | Yangi URL ni yuboring (eski `furrowy-young-undeputed...` o‘rniga) |

Ngrok bepul rejimda har safar **boshqa URL** beradi. Tunnel terminalini yopsangiz, URL yana offline bo‘ladi.

---

## "Your connection is not private" / ERR_CERT_AUTHORITY_INVALID

- **Telegram Mini App** uchun **localhost** ishlatmaslik kerak — brauzer va Telegram self-signed sertifikatga ishonmaydi. Har doim **ngrok** dan chiqqan `https://....ngrok-free.dev` URL dan foydalaning (BotFather da shu URL ni qo‘ying).
- Agar **brauzerda** localhost ni ochayotgan bo‘lsangiz (https://localhost:5173): "Advanced" → "Proceed to localhost (unsafe)" bosing — bu faqat o‘zingizning kompyuteringizda, ruxsat bilan.
- Mini App ni **Telegram** da ochsangiz, faqat ngrok URL ishlatilganda xato ketadi.

---

## 1. Ngrok token (bir marta)

1. **https://dashboard.ngrok.com/signup** — bepul ro‘yxatdan o‘ting.
2. **https://dashboard.ngrok.com/get-started/your-authtoken** — **authtoken** ni nusxalang.
3. Loyiha ildizida (mini app papkasida) **.env** fayl yarating (yoki mavjud .env ga qo‘shing):
   ```
   NGROK_AUTHTOKEN=your_authtoken_bu_yerga
   ```

---

## 2. Botda ishlatish — 2 ta terminal

**Tartib muhim.** Avval 5173 portni ishlatayotgan boshqa dasturni yoping.

### Terminal 1 — Vite (yopmang)

```bash
cd "c:\Users\Lenovo\OneDrive\Desktop\my-web-sites\mini app"
npm run dev:tunnel
```

`Local: http://localhost:5173/` ko‘rinishi kerak. Agar "Port 5173 is in use" chiqsa, o‘sha portni band qilgan dasturni yoping.

### Terminal 2 — Ngrok tunnel (yopmang)

```bash
cd "c:\Users\Lenovo\OneDrive\Desktop\my-web-sites\mini app"
npm run tunnel
```

Chiqqan **https://....ngrok-free.dev** (yoki .ngrok-free.app) manzilni nusxalang. **Bu terminalni ochiq qoldiring** — yopsangiz bot ishlamaydi (ERR_NGROK_3200).

---

## 3. BotFather’ga URL yuborish

1. Telegram → **@BotFather**
2. **Configure Mini App** → **Configure Mini App URL**
3. Nusxalagan URL ni yuboring (oxirida `/` bo‘lmasin).

Botda **Menu** → **Open App** — Mini App ochiladi.

---

## 4. Zakaz ishlashi uchun (NEW ORDER → bot → admin)

Mini appda mahsulot tanlab **NEW ORDER** bosilganda, buyurtma **Supabase** ga yoziladi va **server** orqali **bot** adminga xabar yuboradi. Buning uchun:

1. **Server** ishlashi kerak: `npm run server` (port 3002).
2. **Backend** Mini App dan yetiladigan bo‘lishi kerak. Telegram da ilova **ngrok** URL dan yuklangan bo‘lsa, telefon yoki brauzer `localhost:3002` ga so‘rov yubora olmaydi — backend ham **internetda** ochiq bo‘lishi kerak.

**Variant A — Backend uchun ikkinchi tunnel (ngrok):**

- Yangi terminalda: `ngrok http 3002` (yoki [ngrok](https://ngrok.com) o‘rnatilgan bo‘lsa).
- Chiqqan `https://....ngrok-free.app` ni **loyiha ildizidagi .env** ga yozing:
  ```
  VITE_API_URL=https://....ngrok-free.app
  ```
- Frontend ni qayta ishga tushiring (`npm run dev:tunnel`) va BotFather da Mini App URL ni frontend tunnel manziliga qo‘ying.

**Variant B — Backend ni deploy qilish (Render, Railway va h.k.):**

- Backend ni deploy qiling, public URL oling (masalan `https://your-app.onrender.com`).
- Loyiha ildizidagi `.env` da: `VITE_API_URL=https://your-app.onrender.com`
- Frontend ni tunnel yoki deploy orqali oching; BotFather da Mini App URL = frontend manzili.

**Qisqacha:** Mini app (ngrok) + server (localhost) bo‘lsa, NEW ORDER bosilganda so‘rov `localhost:3002` ga ketadi va **telefonda** ishlamaydi. `VITE_API_URL` ni backend ning **public** manziliga qo‘ying (ikkinchi ngrok yoki deploy).
