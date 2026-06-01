# BuyZO — E-Commerce Platform (Phase 1)

MERN stack e-commerce platform with user authentication, email verification, Google OAuth, profile setup, and admin user management.

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Auth:** JWT, Passport (Google OAuth), bcrypt, Nodemailer

## Features

### Phase 1 — Auth & Admin
- Register / login (email + Google OAuth)
- Profile setup
- Admin dashboard & user management

### Phase 2 — Shop & Security
- **Product listing** — search, filter, sort, pagination (`/products`)
- **Product detail page** — single product view (`/products/:slug`)
- **Email OTP verification** — 6-digit code on register (`/verify-otp`)
- **Password reset (OTP)** — forgot password → email code → new password (`/reset-password-otp`)

## Design

Navy blue (`#1e3a5f`) and off-white/cream (`#f8f6f3`) theme via Tailwind custom colors.

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB running locally or Atlas URI

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB, JWT, SMTP, and Google OAuth credentials
npm install
npm run seed:admin
npm run seed:products
npm run dev
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

- **App:** http://localhost:5173
- **API:** http://localhost:5000

### Default Admin (after seed)

| Field    | Value              |
|----------|--------------------|
| Email    | admin@buyzo.com    |
| Password | Admin@123456       |

Change these in `backend/.env` before running `npm run seed:admin`.

## Environment Variables

See `backend/.env.example` and `frontend/.env.example`.

### Google OAuth Setup

1. Create a project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google+ API / OAuth consent screen
3. Create OAuth 2.0 credentials (Web application)
4. Authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
5. Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to `backend/.env`

### Email (Gmail example)

Use an [App Password](https://support.google.com/accounts/answer/185833) for `SMTP_PASS`.

## API Routes

| Method | Route                              | Description           |
|--------|------------------------------------|-----------------------|
| POST   | /api/auth/register                 | Register user         |
| GET    | /api/auth/verify-email?token=      | Verify email          |
| POST   | /api/auth/resend-verification      | Resend verification   |
| POST   | /api/auth/login                    | Login                 |
| POST   | /api/auth/logout                   | Logout                |
| GET    | /api/auth/me                       | Current user          |
| PUT    | /api/auth/profile                  | Update profile        |
| GET    | /api/auth/google                   | Google OAuth          |
| POST   | /api/auth/verify-otp               | Verify email OTP      |
| POST   | /api/auth/resend-otp               | Resend OTP            |
| POST   | /api/auth/reset-password-otp       | Reset password (OTP)  |
| GET    | /api/products                      | List products         |
| GET    | /api/products/slug/:slug           | Product detail        |
| GET    | /api/admin/stats                   | Admin dashboard stats |
| GET    | /api/admin/users                   | List users            |
| PATCH  | /api/admin/users/:id/toggle-block  | Block/unblock user    |

## Project Structure

```
BuyZo/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   └── utils/
└── frontend/
    └── src/
        ├── components/
        ├── context/
        ├── layouts/
        └── pages/
```

## Deploy to Vercel

See **[DEPLOYMENT.md](./DEPLOYMENT.md)**. If the wrong site was deployed, use **[VERCEL_FIX.md](./VERCEL_FIX.md)**.

## Next Phases

- Cart checkout & payments
- Orders
- Reviews & wishlist
