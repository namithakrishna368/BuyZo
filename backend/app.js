import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import connectDB from './config/db.js';
import configurePassport from './config/passport.js';
import { getClientUrl } from './utils/clientUrl.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import productRoutes from './routes/productRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const getAllowedOrigins = () => {
  const list = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    getClientUrl(),
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL,
  ];
  if (process.env.VERCEL_URL) {
    list.push(`https://${process.env.VERCEL_URL}`);
  }
  return [...new Set(list.filter(Boolean))];
};

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  const allowed = getAllowedOrigins();
  if (allowed.includes(origin)) return true;
  try {
    const host = new URL(origin).hostname;
    if (host.endsWith('.vercel.app')) return true;
  } catch {
    /* ignore */
  }
  return false;
};

let appInstance = null;

export const createApp = async () => {
  if (appInstance) return appInstance;

  configurePassport();

  const app = express();

  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    app.set('trust proxy', 1);
  }

  app.use(
    cors({
      origin(origin, callback) {
        if (isAllowedOrigin(origin)) callback(null, true);
        else callback(null, false);
      },
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(passport.initialize());

  app.use(async (req, res, next) => {
    try {
      await connectDB();
      next();
    } catch (err) {
      next(err);
    }
  });

  app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'BuyZO API is running' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/products', productRoutes);

  app.use(errorHandler);

  appInstance = app;
  return app;
};

export default createApp;
