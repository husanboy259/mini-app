# Render’da deploy qilish (qisqa qo‘llanma)

Loyihangizda **ikki qism** bor: **frontend** (Vite + React) va **backend** (Express). Render’da ularni ikki xizmat sifatida deploy qilish eng oson.

---

## Backend’ni public URL qilish (qisqa)

**Maqsad:** Backend internetda doimiy ochiq bo‘lsin, `.env` da `VITE_API_URL=...` qo‘yib, admin ga xabar ketsin.

1. **render.com** → Sign up / Login (GitHub bilan).
2. **New** → **Web Service** → reponi tanlang (mini-app).
3. **Root Directory:** `server` | **Build:** `npm install` | **Start:** `npm start`.
4. **Environment** da qo‘shing (qiymatlarni **server/.env** dan nusxalang):
   - `BOT_TOKEN`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_TELEGRAM_ID`
5. **Create Web Service** → 2–3 daqiqa kuting.
6. Chiqqan URL ni nusxalang (masalan `https://mini-app-api.onrender.com`).
7. Loyiha ildizidagi **.env** da: `VITE_API_URL=https://mini-app-api.onrender.com` (o‘zingizning URL).
8. Frontend ni qayta ishga tushiring (`npm run dev:tunnel`). Endi zakaz yuborilganda admin xabar oladi.

---

## 1. Render nima?

- **Render** — bulutda veb-sayt va backend’larni bepul/ pullik host qilish xizmati.
- **Static Site** — faqat HTML/CSS/JS (sening frontend’ing).
- **Web Service** — Node.js server (sening Express backend’ing).

---

## 2. Render hisob ochish

1. [render.com](https://render.com) ga kiring.
2. **Get started** → GitHub bilan **Sign up** / **Log in**.
3. GitHub’dagi `husanboy259/mini-app` reponi Render’ga **ulang** (Dashboard → **New** → **Connect account** yoki repo’ni tanlash).

---

## 3. Backend’ni (server) deploy qilish

Backend birinchi deploy qilinadi, chunki frontend uning URL’ini ishlatadi.

1. **Dashboard** → **New** → **Web Service**.
2. Repo: **mini-app** (yoki GitHub’dagi nomingiz).
3. Sozlamalar:

   | Sozlamalar       | Qiymat                    |
   |------------------|---------------------------|
   | **Name**         | `mini-app-api` (yoki xohlagan nom) |
   | **Region**       | Singapore (yoki yaqin)     |
   | **Root Directory** | `server`                |
   | **Runtime**      | Node                      |
   | **Build Command** | `npm install`           |
   | **Start Command**  | `npm start`             |

4. **Environment** (Environment Variables) — **Add** bilan barchasini qo‘shing:

   | Key        | Value                    |
   |-----------|---------------------------|
   | `BOT_TOKEN` | Telegram bot token (BotFather’dan) |
   | `SUPABASE_URL` | `https://xxxxx.supabase.co` (server/.env dagi) |
   | `SUPABASE_SERVICE_ROLE_KEY` | service_role kalit (server/.env dagi) |
   | `ADMIN_TELEGRAM_ID` | `5803735374` (yoki o‘zingizning Telegram ID) |

   **Add** → **Save**.

5. **Create Web Service** bosing. Birinchi deploy 2–3 daqiqa davom etadi.
6. Tayyor bo‘lgach, servisning URL’i chiqadi, masalan:
   ```text
   https://mini-app-api.onrender.com
   ```
   Bu URL’ni **yozib qoling** — frontend’da `VITE_API_URL` sifatida ishlatasiz.

---

## 4. Frontend’ni (ilova) deploy qilish

1. **Dashboard** → **New** → **Static Site**.
2. Repo: **mini-app** (o‘sha reponingiz).
3. Sozlamalar:

   | Sozlamalar         | Qiymat                          |
   |--------------------|----------------------------------|
   | **Name**           | `mini-app` (yoki xohlagan nom)   |
   | **Root Directory** | (bo‘sh qoldiring — loyiha ildizi) |
   | **Build Command**  | `npm install && npm run build`    |
   | **Publish Directory** | `dist`                        |

4. **Environment** (Environment Variables):

   | Key             | Value                                  |
   |-----------------|----------------------------------------|
   | `VITE_API_URL`  | `https://mini-app-api.onrender.com`     |

   (Backend’ning haqiqiy URL’ini yozing; `/` oxirida bo‘lmasin.)

5. **Create Static Site** bosing. Build 2–5 daqiqa davom etadi.
6. Tayyor bo‘lgach, frontend URL’i chiqadi, masalan:
   ```text
   https://mini-app.onrender.com
   ```

---

## 5. Telegram bot’da Mini App URL’ini o‘zgartirish

1. [@BotFather](https://t.me/BotFather) da botingizni oching.
2. **Bot Settings** → **Menu Button** yoki **Web App** sozlamasiga o‘ting.
3. **Web App URL** ni Render’dagi frontend manziliga qo‘ying:
   ```text
   https://mini-app.onrender.com
   ```
4. Saqlang. Endi bot orqali Mini App Render’da ishlaydi.

---

## 6. Tezkor xulosalar

- **Backend (Web Service):**  
  Root = `server`, Build = `npm install`, Start = `npm start`, env = `BOT_TOKEN`.

- **Frontend (Static Site):**  
  Build = `npm install && npm run build`, Publish = `dist`, env = `VITE_API_URL` = backend URL.

- **Free plan:**  
  Web Service ~15 daqiqadan keyin uxlaydi; birinchi so‘rovda 30–60 soniya “cold start” bo‘lishi mumkin. Static Site doim tez.

---

## 7. Muammolar bo‘lsa

| Muammo | Yechim |
|--------|--------|
| Build xato | Render log’da **Build logs** ni ko‘ring; odatda `npm install` yoki `npm run build` xato yozadi. |
| Frontend API’ga so‘rov yubormaydi | Frontend’da `VITE_API_URL` to‘g‘ri backend URL’ga o‘rnatilganini tekshiring (https://, oxirida / yo‘q). |
| Backend 401 (Invalid init data) | `BOT_TOKEN` Render’dagi backend env’da to‘g‘ri ekanini va BotFather’dagi token bilan bir xil ekanini tekshiring. |
| CORS xato | Server’da `cors()` ishlatilgan; agar boshqa domen ishlatsangiz, `cors({ origin: 'https://mini-app.onrender.com' })` qo‘shishingiz mumkin. |

Agar xohlasangiz, keyingi qadamda CORS ni aniq domen uchun yozib chiqamiz yoki `render.yaml` (Blueprint) orqali bitta repodan ikkala xizmatni avtomat deploy qilishni ko‘rsataman.
