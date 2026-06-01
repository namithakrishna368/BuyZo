import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import connectDB from './config/db.js';
import configurePassport from './config/passport.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import productRoutes from './routes/productRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { isGoogleOAuthConfigured, isSmtpConfigured, isDevSkipEmailVerification } from './utils/appConfig.js';

connectDB();
configurePassport();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'BuyZO API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`BuyZO server running on port ${PORT}`);
  console.log(`  Google OAuth: ${isGoogleOAuthConfigured() ? 'enabled' : 'disabled (set GOOGLE_CLIENT_ID/SECRET)'}`);
  console.log(`  SMTP email:   ${isSmtpConfigured() ? 'enabled' : 'disabled (verification links logged in dev)'}`);
  console.log(`  Skip verify:  ${isDevSkipEmailVerification() ? 'ON (dev only)' : 'off'}`);
});
