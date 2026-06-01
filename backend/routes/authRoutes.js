import express from 'express';
import { body } from 'express-validator';
import passport from 'passport';
import {
  register,
  verifyEmail,
  resendVerification,
  login,
  logout,
  getMe,
  updateProfile,
  googleCallback,
  getAuthConfig,
  forgotPassword,
  resetPassword,
  verifyOtp,
  resendOtp,
  resetPasswordOtp,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { requireGoogleOAuth } from '../middleware/requireGoogleOAuth.js';

const router = express.Router();

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const validate = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((v) => v.run(req)));
  const { validationResult } = await import('express-validator');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }
  next();
};

router.get('/config', getAuthConfig);
router.post('/register', validate(registerValidation), register);
router.get('/verify-email', verifyEmail);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/resend-verification', resendVerification);
router.post('/login', validate(loginValidation), login);
router.post('/forgot-password', validate([body('email').isEmail().withMessage('Valid email is required')]), forgotPassword);
router.post(
  '/reset-password-otp',
  validate([
    body('email').isEmail().withMessage('Valid email is required'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ]),
  resetPasswordOtp
);
router.post(
  '/reset-password',
  validate([
    body('token').notEmpty().withMessage('Reset token is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ]),
  resetPassword
);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

router.get(
  '/google',
  requireGoogleOAuth,
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get(
  '/google/callback',
  requireGoogleOAuth,
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google_auth_failed`,
  }),
  googleCallback
);

export default router;
