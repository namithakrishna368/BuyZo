import { isGoogleOAuthConfigured } from '../utils/appConfig.js';

export const requireGoogleOAuth = (req, res, next) => {
  if (!isGoogleOAuthConfigured()) {
    return res.status(503).json({
      success: false,
      message:
        'Google sign-in is not configured. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to backend/.env',
      code: 'GOOGLE_OAUTH_NOT_CONFIGURED',
    });
  }
  next();
};
