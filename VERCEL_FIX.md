# Fix Vercel — deploy the correct BuyZO project

If the live site is **not** your BuyZO shop (wrong template, blank page, or another app), follow these steps.

## 1. Remove or ignore the wrong Vercel project

- [vercel.com/dashboard](https://vercel.com/dashboard)
- Open the **wrong** project → **Settings** → **Delete Project** (or disconnect Git).

Do **not** reuse a random project named `buyzo` that isn’t linked to **your** GitHub repo.

## 2. Create the correct project

1. [vercel.com/new](https://vercel.com/new)
2. **Import** → GitHub → **`namithakrishna368/BuyZo`**
3. **Project name:** `BuyZo` (display name; URL may be `buy-zo.vercel.app` or similar)
4. **Root Directory:** `.` (repository root — **not** `frontend` alone)
5. **Framework Preset:** **Other** (repo `vercel.json` controls build)
6. Confirm settings match:
   - Build: `npm run build --prefix frontend`
   - Output: `frontend/dist`
7. **Deploy**

## 3. Environment variables

Copy from `vercel.env.example`. Minimum:

| Variable | Value |
|----------|--------|
| `VITE_API_URL` | `/api` |
| `MONGODB_URI` | Your Atlas URI |
| `JWT_SECRET` | Long random string |
| `CLIENT_URL` | `https://YOUR-URL.vercel.app` |
| `GOOGLE_CALLBACK_URL` | `https://YOUR-URL.vercel.app/api/auth/google/callback` |

Then **Redeploy**.

## 4. Verify it’s BuyZO

| URL | Expected |
|-----|----------|
| `/` | “India's favourite place to shop”, categories, ₹ prices |
| `/api/health` | `{"success":true,"message":"BuyZO API is running"}` |
| `/products` | Product grid |

If `/api/health` fails, env vars or MongoDB are missing — not the wrong repo.

## 5. Google OAuth

- Origin: `https://YOUR-URL.vercel.app`
- Redirect: `https://YOUR-URL.vercel.app/api/auth/google/callback`

---

**Repo:** https://github.com/namithakrishna368/BuyZo  
**Do not** use Vercel “Services” / `experimentalServices` for this project — use the standard `vercel.json` + `api/index.js` setup in the repo.
