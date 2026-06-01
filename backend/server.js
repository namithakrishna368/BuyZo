import { createApp } from './app.js';
import { isGoogleOAuthConfigured, isSmtpConfigured, isDevSkipEmailVerification } from './utils/appConfig.js';

const PORT = process.env.PORT || 5000;

const start = async () => {
  const app = await createApp();
  app.listen(PORT, () => {
    console.log(`BuyZO server running on port ${PORT}`);
    console.log(`  Google OAuth: ${isGoogleOAuthConfigured() ? 'enabled' : 'disabled (set GOOGLE_CLIENT_ID/SECRET)'}`);
    console.log(`  SMTP email:   ${isSmtpConfigured() ? 'enabled' : 'disabled (verification links logged in dev)'}`);
    console.log(`  Skip verify:  ${isDevSkipEmailVerification() ? 'ON (dev only)' : 'off'}`);
  });
};

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
