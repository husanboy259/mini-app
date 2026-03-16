# Mini App ni qanday run qilish

Loyiha papkasiga o‘ting, keyin **4 ta terminal** oching va har birida quyidagilarni ketma-ket ishga tushiring. Barcha terminallarni **ochiq qoldiring**.

---

## 1-terminal: Frontend (Vite)

```bash
cd "c:\Users\Lenovo\OneDrive\Desktop\my-web-sites\mini app"
npm run dev:tunnel
```

`Local: http://localhost:5173/` ko‘rinsa — to‘g‘ri. Terminalni yopmang.

---

## 2-terminal: Frontend tunnel (Mini App URL)

```bash
cd "c:\Users\Lenovo\OneDrive\Desktop\my-web-sites\mini app"
npm run tunnel
```

Chiqqan **https://....ngrok-free.dev** ni nusxalang. **BotFather** da: Configure Mini App → **Configure Mini App URL** → shu URL ni yuboring. Terminalni yopmang.

---

## 3-terminal: Backend (server)

```bash
cd "c:\Users\Lenovo\OneDrive\Desktop\my-web-sites\mini app\server"
npm run start
```

`Server running on http://localhost:3002` ko‘rinsa — to‘g‘ri. Terminalni yopmang.

---

## 4-terminal: Backend tunnel (zakaz adminga ketishi uchun)

```bash
cd "c:\Users\Lenovo\OneDrive\Desktop\my-web-sites\mini app"
npm run tunnel:server
```

Chiqqan **https://....ngrok-free.dev** ni nusxalang. Loyiha **ildizida** (server papkasi emas) **.env** fayl yarating yoki oching va yozing:

```
VITE_API_URL=https://bu-yerga-nusxalagan-url
```

Keyin **1-terminal** da frontend ni qayta ishga tushiring (Ctrl+C, keyin yana `npm run dev:tunnel`). Terminalni yopmang.

---

## Tekshirish

- **Telegram** da botni oching → **Menu** → **Open App** — Mini App ochiladi (2-terminal dagi URL ishlashi kerak).
- Katalogdan taom tanlab **Savat** ga o‘ting, **Yuborish** bosing — admin (siz) Telegram da xabar olishingiz kerak (buning uchun 3 va 4-terminal, hamda **server/.env** da Supabase va **.env** da VITE_API_URL bo‘lishi kerak).

---

## Qisqacha tartib

| Terminal | Buyruq | Vazifa |
|----------|--------|--------|
| 1 | `npm run dev:tunnel` | Frontend (5173) |
| 2 | `npm run tunnel` | Mini App URL — BotFather ga |
| 3 | `cd server && npm run start` | Backend (3002) |
| 4 | `npm run tunnel:server` | Chiqqan URL ni .env da `VITE_API_URL=...` qiling |

Barcha 4 ta terminal ochiq bo‘lishi kerak. Biror birini yopsangiz, tegishli qismi ishlamay qoladi.

---

## Muhim eslatmalar

- **`npm run tunnel`** va **`npm run tunnel:server`** ni faqat **loyiha ildizida** ishlating (`mini app` papkada). `cd server` qilib server papkasida ishlasangiz — "Missing script: tunnel" chiqadi.
- **Ngrok bepul** rejimda bir vaqtda **bitta** tunnel qo‘llab-quvvatlanadi. Agar `npm run tunnel` (frontend) allaqachon ishlab turgan bo‘lsa, `npm run tunnel:server` **ERR_NGROK_334** beradi ("endpoint is already online"). Ikkinchi tunnel ochilmaydi.

---

## Agar ERR_NGROK_334 chiqsa (ikkinchi tunnel ochilmasa)

**Variant A — Backend ni deploy qilish (tavsiya)**  
Backend ni **Render** (yoki boshqa servis) ga deploy qiling. **DEPLOY-RENDER.md** da qadamlar bor. Deploy qilgach, doimiy URL olasiz (masalan `https://mini-app-api.onrender.com`). Loyiha ildizidagi **.env** da:

```
VITE_API_URL=https://mini-app-api.onrender.com
```

qiling. Keyin faqat **bitta** ngrok tunnel kerak — frontend uchun (`npm run tunnel`). Backend internetda doim ochiq bo‘ladi.

**Port 5173 is already in use**  
Eski Vite yoki boshqa dastur 5173 ni band qilgan. PowerShell da (Administrator bo‘lmasa ham ishlashi mumkin):

```powershell
$p = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | Select-Object -First 1; if ($p) { Stop-Process -Id $p.OwningProcess -Force }
```

Yoki: boshqa terminallarni tekshiring — qaysidirida `npm run dev:tunnel` hali ishlayapti. O‘sha terminalda **Ctrl+C** bosing.

**ERR_NGROK_334 (endpoint already online)**  
Boshqa terminalda tunnel allaqachon ishlayapti. Barcha Cursor terminallarini tekshiring, `npm run tunnel` yoki `npm run tunnel:server` ishlayotganini **Ctrl+C** bilan to‘xtating. Keyin qayta ishga tushiring.

---

**Variant B — Faqat kompyuterdan tekshirish**  
Telegram dan emas, **brauzerda** `http://localhost:5173` ochib, zakaz yuborishni tekshiring. Loyiha ildizidagi **.env** da:

```
VITE_API_URL=http://localhost:3002
```

qiling va frontend ni qayta ishga tushiring. Admin ga xabar faqat shu kompyuterdan test qilganda ketadi; Telegram (telefon) dan ochsangiz, telefon `localhost` ga ulana olmaydi.
