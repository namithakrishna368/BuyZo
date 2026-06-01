/** Frontend origin for redirects, CORS, and email links. */
export const getClientUrl = () => {
  const fromEnv = process.env.CLIENT_URL || process.env.FRONTEND_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:5173';
};

/** Google OAuth callback — set GOOGLE_CALLBACK_URL in Vercel for production. */
export const getGoogleCallbackUrl = () => {
  if (process.env.GOOGLE_CALLBACK_URL) {
    return process.env.GOOGLE_CALLBACK_URL;
  }
  if (process.env.BACKEND_URL) {
    return `${process.env.BACKEND_URL.replace(/\/$/, '')}/api/auth/google/callback`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/_/backend/api/auth/google/callback`;
  }
  return 'http://localhost:5000/api/auth/google/callback';
};
