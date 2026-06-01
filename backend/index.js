/**
 * Vercel Express service entry (experimentalServices, routePrefix /_/backend).
 */
import { createApp } from './app.js';

const app = await createApp();
export default app;
