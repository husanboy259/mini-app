# Tunnel bilan Mini App URL olish (BotFather uchun)

Ngrok loyihada — **npm run tunnel**. Parol so‘ralmaydi.

---

## 1. Ngrok token (bir marta)

1. **https://dashboard.ngrok.com/signup** — bepul ro‘yxatdan o‘ting.
2. **https://dashboard.ngrok.com/get-started/your-authtoken** — **authtoken** ni nusxalang.
3. Loyiha ildizida (mini app papkasida) **.env** fayl yarating (yoki mavjud .env ga qo‘shing):
   ```
   NGROK_AUTHTOKEN=your_authtoken_bu_yerga
   ```

---

## 2. Mini App ni ishga tushirish (HTTP — tunnel uchun)

**Tunnel ishlashi uchun** birinchi terminalda **dev:tunnel** ishlating (oddiy `dev` emas):

```bash
cd "c:\Users\Lenovo\OneDrive\Desktop\my-web-sites\mini app"
npm run dev:tunnel
```

**Bu terminalni yopmang.** Agar `npm run dev` ishlatsangiz, ngrok **ERR_NGROK_3004** beradi (HTTPS backend bilan mos emas).

---

## 3. Tunnel ochish (loyihadan)

Yangi terminalda:
```bash
cd "c:\Users\Lenovo\OneDrive\Desktop\my-web-sites\mini app"
npm install
npm run tunnel
```

Chiqqan **https://....ngrok-free.app** (yoki ngrok.io) manzilni nusxalang.

---

## 4. BotFather’ga yuborish

1. Telegram → **@BotFather**
2. **Configure Mini App** → **Configure Mini App URL**
3. Nusxalagan URL ni yuboring (oxirida `/` bo‘lmasin).

Botda **Menu** → **Open App** — Mini App ochiladi.
