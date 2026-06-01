# Deploy BuyZO to Vercel

One Vercel project serves **React (frontend)** and **Express API** (`/api/*`). MongoDB must be **MongoDB Atlas** (cloud).

## 1. MongoDB Atlas

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Database Access → create user + password.
3. Network Access → **Allow access from anywhere** (`0.0.0.0/0`) for Vercel.
4. Connect → copy connection string, e.g.  
   `mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/buyzo?retryWrites=true&w=majority`

## 2. Seed database (from your PC)

```bash
cd backend
# Put Atlas URI in .env as MONGODB_URI
npm run seed:admin
npm run seed:products
npm run images:ensure
```

## 3. Import project on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New** → **Project**.
2. Import GitHub repo: `namithakrishna368/BuyZo`.
3. **Root Directory:** leave as `.` (repo root).
4. Vercel reads `vercel.json` automatically.

## 4. Environment variables (Vercel → Settings → Environment Variables)

### Frontend (build time)

| Name | Value |
|------|--------|
| `VITE_API_URL` | `/api` |

### Backend (runtime)

| Name | Example |
|------|---------|
| `MONGODB_URI` | `mongodb+srv://...` |
| `JWT_SECRET` | long random string |
| `JWT_EXPIRE` | `7d` |
| `NODE_ENV` | `production` |
| `CLIENT_URL` | `https://YOUR-APP.vercel.app` |
| `GOOGLE_CLIENT_ID` | from Google Cloud |
| `GOOGLE_CLIENT_SECRET` | from Google Cloud |
| `GOOGLE_CALLBACK_URL` | `https://YOUR-APP.vercel.app/api/auth/google/callback` |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | your email |
| `SMTP_PASS` | app password |
| `EMAIL_FROM` | `BuyZO <noreply@buyzo.com>` |

Replace `YOUR-APP` with your real Vercel URL after first deploy.

## 5. Google OAuth (production)

In [Google Cloud Console](https://console.cloud.google.com/) → OAuth client:

- **Authorized JavaScript origins:** `https://YOUR-APP.vercel.app`
- **Authorized redirect URIs:** `https://YOUR-APP.vercel.app/api/auth/google/callback`

## 6. Deploy

Click **Deploy**. After deploy:

- Shop: `https://YOUR-APP.vercel.app`
- API health: `https://YOUR-APP.vercel.app/api/health`

## 7. Local vs production

| | Local | Vercel |
|---|--------|--------|
| Frontend | `npm run dev` in `frontend` | static build |
| API | `npm run dev` in `backend` | `/api` serverless |
| `VITE_API_URL` | `http://localhost:5000/api` | `/api` |

## Troubleshooting

- **API 500 / MongoDB:** check `MONGODB_URI` and Atlas IP allowlist.
- **CORS:** set `CLIENT_URL` to exact Vercel URL (no trailing slash).
- **Google login:** update callback URL after you know the Vercel domain.
- **Empty shop:** run `seed:products` against Atlas from your machine.
