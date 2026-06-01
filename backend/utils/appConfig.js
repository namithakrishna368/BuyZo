export const isGoogleOAuthConfigured = () =>
  Boolean(process.env.GOOGLE_CLIENT_ID?.trim() && process.env.GOOGLE_CLIENT_SECRET?.trim());

export const isSmtpConfigured = () =>
  Boolean(process.env.SMTP_USER?.trim() && process.env.SMTP_PASS?.trim());

export const isDevSkipEmailVerification = () =>
  process.env.NODE_ENV === 'development' && process.env.SKIP_EMAIL_VERIFICATION === 'true';
