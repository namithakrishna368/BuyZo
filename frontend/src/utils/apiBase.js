/**
 * API base URL — local :5000, Vercel production /api
 */
export const getApiBase = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, '');
  }
  if (import.meta.env.DEV) {
    return 'http://localhost:5000/api';
  }
  return '/api';
};
