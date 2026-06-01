# Deploy BuyZO to Vercel

One Vercel project from **https://github.com/namithakrishna368/BuyZo**:

| Part | How |
|------|-----|
| Shop (React) | `frontend/dist` static files |
| API (Express) | `api/index.js` → `/api/*` |

**Wrong site deployed?** See **[VERCEL_FIX.md](./VERCEL_FIX.md)**.

---

## Quick deploy

1. [vercel.com/new](https://vercel.com/new) → Import **`namithakrishna368/BuyZo`**
2. **Project name:** `BuyZo`
3. **Root directory:** `.` (repo root)
4. **Framework:** Other (uses repo `vercel.json`)
5. Add env vars from `vercel.env.example`
6. Deploy → **Redeploy** after env vars

**Test**

- `https://YOUR-URL.vercel.app` — BuyZO shop home
- `https://YOUR-URL.vercel.app/api/health` — API JSON

---

## Environment variables

### Frontend (build)

```
VITE_API_URL=/api
```

### Backend (runtime)

```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
NODE_ENV=production
CLIENT_URL=https://YOUR-URL.vercel.app
GOOGLE_CALLBACK_URL=https://YOUR-URL.vercel.app/api/auth/google/callback
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
```

Seed Atlas from your PC:

```bash
cd backend
npm run seed:admin
npm run seed:products
```

---

## Local development

```bash
cd backend && npm run dev
cd frontend && npm run dev
```

`frontend/.env`: `VITE_API_URL=http://localhost:5000/api`
