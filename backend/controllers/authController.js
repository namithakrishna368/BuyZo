import crypto from 'crypto';
import User from '../models/User.js';
import { sendVerificationEmail } from '../utils/sendEmail.js';
import { generateToken, sendTokenCookie } from '../utils/generateToken.js';
import { isGoogleOAuthConfigured, isSmtpConfigured, isDevSkipEmailVerification } from '../utils/appConfig.js';
import { assignAndSendOtp, verifyUserOtp, clearUserOtp } from '../utils/otpService.js';
import { getClientUrl } from '../utils/clientUrl.js';

const formatUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  phone: user.phone,
  address: user.address,
  isEmailVerified: user.isEmailVerified,
  profileComplete: user.profileComplete,
  isBlocked: user.isBlocked,
});

export const getAuthConfig = (req, res) => {
  res.json({
    success: true,
    googleOAuth: isGoogleOAuthConfigured(),
    emailConfigured: isSmtpConfigured(),
    skipEmailVerification: isDevSkipEmailVerification(),
  });
};

const normalizeEmail = (email) => email?.toLowerCase().trim();

export const register = async (req, res) => {
  try {
    const { name, password } = req.body;
    const email = normalizeEmail(req.body.email);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    const skipVerification = isDevSkipEmailVerification();

    const user = await User.create({
      name,
      email,
      password,
      isEmailVerified: skipVerification,
    });

    if (skipVerification) {
      return res.status(201).json({
        success: true,
        message: 'Account created! You can log in now.',
        requiresVerification: false,
      });
    }

    const otpResult = await assignAndSendOtp(user, 'verify');

    res.status(201).json({
      success: true,
      message: 'Account created! Enter the 6-digit code sent to your email.',
      requiresVerification: true,
      requiresOtp: true,
      email,
      devOtp: otpResult.devOtp,
    });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Verification token is required.' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification token.' });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({ success: true, message: 'Email verified successfully! You can now log in.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const otp = req.body.otp?.trim();

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }

    const check = verifyUserOtp(user, otp, 'verify');
    if (!check.valid) {
      return res.status(400).json({ success: false, message: check.message });
    }

    user.isEmailVerified = true;
    clearUserOtp(user);
    await user.save();

    res.json({ success: true, message: 'Email verified! You can now sign in.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const purpose = req.body.purpose || 'verify';

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: true, message: 'If that email exists, a new code has been sent.' });
    }

    if (purpose === 'verify' && user.isEmailVerified) {
      return res.status(400).json({ success: false, message: 'Email is already verified.' });
    }

    const otpResult = await assignAndSendOtp(user, purpose);

    res.json({
      success: true,
      message: 'A new verification code has been sent to your email.',
      devOtp: otpResult.devOtp,
    });
  } catch (error) {
    console.error('Resend OTP error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resendVerification = resendOtp;

export const forgotPassword = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: true,
        message: 'If that email is registered, you will receive a reset code.',
        requiresOtp: true,
        email,
      });
    }

    const otpResult = await assignAndSendOtp(user, 'reset');

    res.json({
      success: true,
      message: 'A 6-digit reset code has been sent to your email.',
      requiresOtp: true,
      email,
      devOtp: otpResult.devOtp,
    });
  } catch (error) {
    console.error('Forgot password error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPasswordOtp = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const otp = req.body.otp?.trim();
    const password = req.body.password?.trim();

    if (!email || !otp || !password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Email, OTP, and password (min 6 characters) are required.',
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }

    const check = verifyUserOtp(user, otp, 'reset');
    if (!check.valid) {
      return res.status(400).json({ success: false, message: check.message });
    }

    user.password = password;
    user.isEmailVerified = true;
    clearUserOtp(user);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ success: true, message: 'Password updated! You can now sign in.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Valid token and password (min 6 characters) are required.',
      });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select('+password');

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset link.' });
    }

    user.password = password.trim();
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.isEmailVerified = true;
    await user.save();

    res.json({ success: true, message: 'Password updated! You can now sign in.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = req.body.password?.trim();

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'No account found with this email.' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: 'Your account has been blocked.' });
    }

    if (!user.password) {
      user.password = password;
      if (!user.isEmailVerified) {
        user.isEmailVerified = true;
      }
      await user.save();
    } else {
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Incorrect password. Use "Forgot password?" to set a new one.',
          wrongPassword: true,
        });
      }
    }

    if (!user.isEmailVerified && user.role !== 'admin') {
      if (isDevSkipEmailVerification()) {
        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();
      } else {
        return res.status(403).json({
          success: false,
          message: 'Please verify your email with the OTP code before logging in.',
          requiresVerification: true,
          requiresOtp: true,
        });
      }
    }

    const token = generateToken(user._id);
    sendTokenCookie(res, token);

    const userData = await User.findById(user._id);
    res.json({
      success: true,
      message: 'Login successful.',
      user: formatUser(userData),
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  res.json({ success: true, message: 'Logged out successfully.' });
};

export const getMe = async (req, res) => {
  res.json({ success: true, user: formatUser(req.user) });
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;
    if (address) {
      user.address = { ...user.address.toObject?.() || user.address, ...address };
    }

    const hasRequiredFields =
      user.name && user.phone && user.address?.street && user.address?.city && user.address?.country;
    user.profileComplete = Boolean(hasRequiredFields);

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: formatUser(user),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const googleCallback = async (req, res) => {
  try {
    const token = generateToken(req.user._id);
    sendTokenCookie(res, token);

    const redirectPath = req.user.profileComplete ? '/' : '/profile/setup';
    res.redirect(`${getClientUrl()}/auth/google/success?token=${token}&redirect=${encodeURIComponent(redirectPath)}`);
  } catch (error) {
    res.redirect(`${getClientUrl()}/login?error=google_auth_failed`);
  }
};
