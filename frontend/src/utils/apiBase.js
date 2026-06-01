/**
 * API base URL for axios and OAuth links.
 * Vercel Services: backend at /_/backend → /_/backend/api
 */
export const getApiBase = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, '');
  }
  const backend = import.meta.env.VITE_BACKEND_URL;
  if (backend) {
    return `${String(backend).replace(/\/$/, '')}/api`;
  }
  if (import.meta.env.DEV) {
    return 'http://localhost:5000/api';
  }
  return '/_/backend/api';
};
