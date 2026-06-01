# Deploy BuyZO to Vercel (Services)

Vercel **Services** runs two apps from one repo:

| Service | Folder | URL |
|---------|--------|-----|
| **frontend** | `frontend` | `https://YOUR-APP.vercel.app/` |
| **backend** | `backend` | `https://YOUR-APP.vercel.app/_/backend` |

API routes: `https://YOUR-APP.vercel.app/_/backend/api/...`

---

## Step 1 — MongoDB Atlas

1. Create free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. **Network Access** → allow `0.0.0.0/0`.
3. Copy connection string → `MONGODB_URI`.

Seed from your PC:

```bash
cd backend
# MONGODB_URI=your Atlas URI in .env
npm run seed:admin
npm run seed:products
```

---

## Step 2 — `vercel.json` (already in repo)

```json
{
  "experimentalServices": {
    "frontend": {
      "entrypoint": "frontend",
      "routePrefix": "/",
      "framework": "vite"
    },
    "backend": {
      "entrypoint": "backend",
      "routePrefix": "/_/backend",
      "framework": "express"
    }
  }
}
```

> If Vercel UI shows `"root"` instead of `"entrypoint"`, use **`entrypoint`** (official field name).

---

## Step 3 — Vercel project settings

1. [vercel.com/new](https://vercel.com/new) → Import **`namithakrishna368/BuyZo`**.
2. **Framework Preset:** choose **Services** (not Vite alone).
3. Root directory: **`.`** (repository root).
4. Deploy once, note your URL: e.g. `https://buy-zo.vercel.app`.

---

## Step 4 — Environment variables

Set in **Vercel → Project → Settings → Environment Variables**.

Use **`vercel.env.example`** in the repo root as a copy-paste checklist (replace `YOUR-APP`).

### Frontend service (build + client)

| Name | Value |
|------|--------|
| `VITE_API_URL` | `/_/backend/api` |

### Backend service (runtime)

| Name | Value |
|------|--------|
| `MONGODB_URI` | `mongodb+srv://...` |
| `JWT_SECRET` | long random string |
| `JWT_EXPIRE` | `7d` |
| `NODE_ENV` | `production` |
| `CLIENT_URL` | `https://YOUR-APP.vercel.app` |
| `GOOGLE_CALLBACK_URL` | `https://YOUR-APP.vercel.app/_/backend/api/auth/google/callback` |
| `GOOGLE_CLIENT_ID` | (Google Cloud) |
| `GOOGLE_CLIENT_SECRET` | (Google Cloud) |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | your email |
| `SMTP_PASS` | app password |
| `EMAIL_FROM` | `BuyZO <noreply@buyzo.com>` |

Vercel may also auto-inject `BACKEND_URL` / `VITE_BACKEND_URL` — `VITE_API_URL` is the one that matters for the shop.

---

## Step 5 — Google OAuth

In [Google Cloud Console](https://console.cloud.google.com/):

- **JavaScript origins:** `https://YOUR-APP.vercel.app`
- **Redirect URI:** `https://YOUR-APP.vercel.app/_/backend/api/auth/google/callback`

---

## Step 6 — Redeploy

After env vars → **Deployments** → **Redeploy** latest.

### Test

| URL | Expected |
|-----|----------|
| `https://YOUR-APP.vercel.app` | Shop home |
| `https://YOUR-APP.vercel.app/_/backend/api/health` | `{"success":true,...}` |

---

## Local development (unchanged)

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

`frontend/.env`: `VITE_API_URL=http://localhost:5000/api`

Optional — all services locally:

```bash
vercel dev -L
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Shop loads, no products | Seed Atlas; check `MONGODB_URI` on **backend** service |
| API 404 | Confirm `VITE_API_URL=/_/backend/api` and redeploy frontend |
| Google login fails | Update callback URL with `/_/backend/api/auth/...` |
| Build fails | Project preset must be **Services**, not plain Vite |
