# Mini App’ni Telegram’da ochish — qadamlari

---

## 1. Ngrok tokenni loyiha ildiziga qo‘ying

**mini app** papkasida (package.json bor joyda) **.env** fayl yarating. Ichiga:

```
NGROK_AUTHTOKEN=bu_yerga_ngrok_token_yozing
```

Token: https://dashboard.ngrok.com/get-started/your-authtoken dan nusxalang.

**Eslatma:** `server/.env` emas — **mini app** papkasidagi `.env` (tunnel shu faylni o‘qiydi).

---

## 2. Birinchi terminal: Mini App’ni ishga tushiring

```bash
cd "c:\Users\Lenovo\OneDrive\Desktop\my-web-sites\mini app"
npm run dev
```

“Local: https://localhost:5173” ko‘rinadi. **Terminalni yopmang.**

---

## 3. Ikkinchi terminal: Tunnel oching

Yangi terminal oching:

```bash
cd "c:\Users\Lenovo\OneDrive\Desktop\my-web-sites\mini app"
npm run tunnel
```

Chiqqan **https://....ngrok-free.app** (yoki ngrok.io) manzilni **to‘liq nusxalang** (Ctrl+C bilan to‘xtatmasdan).

---

## 4. BotFather’da Mini App URL’ni sozlang

1. Telegram’da **@BotFather** oching.
2. **/mybots** yozing → o‘z botingizni tanlang.
3. **Bot Settings** → **Configure Mini App** → **Configure Mini App URL**.
4. Nusxalagan **https://....ngrok-free.app** manzilni yuboring (oxirida `/` bo‘lmasin).
5. “Done” chiqadi.

---

## 5. Telegram’da tekshirish

1. O‘z botingizga kiring (bot nomini qidiring).
2. **Menu** yoki **Open App** tugmasini bosing.
3. Game Hub (Snake, Tic-Tac-Toe, Memory, Quiz) ochiladi.

---

## Qisqacha

| Qadam | Nima qilish |
|-------|-------------|
| 1 | mini app/.env da `NGROK_AUTHTOKEN=...` |
| 2 | Terminal 1: `npm run dev` |
| 3 | Terminal 2: `npm run tunnel` → URL nusxalash |
| 4 | BotFather → Configure Mini App URL → URL yuborish |
| 5 | Botda Menu → Open App |

---

**Muammo bo‘lsa:** Tunnel ishlamasa — .env **mini app** (loyiha ildizi) da ekanini tekshiring, server/.env emas.
