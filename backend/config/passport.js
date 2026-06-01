import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

const configurePassport = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email = profile.emails?.[0]?.value;

            let user = await User.findOne({
              $or: [{ googleId: profile.id }, { email }],
            });

            if (user) {
              if (!user.googleId) {
                user.googleId = profile.id;
                user.isEmailVerified = true;
                if (!user.avatar && profile.photos?.[0]?.value) {
                  user.avatar = profile.photos[0].value;
                }
                await user.save();
              }
            } else {
              user = await User.create({
                googleId: profile.id,
                name: profile.displayName,
                email,
                avatar: profile.photos?.[0]?.value || '',
                isEmailVerified: true,
              });
            }

            if (user.isBlocked) {
              return done(new Error('Account blocked'), null);
            }

            done(null, user);
          } catch (error) {
            done(error, null);
          }
        }
      )
    );
  }
};

export default configurePassport;
