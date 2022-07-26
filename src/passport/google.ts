import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import config from '../config';
import User from '../database/User';

passport.use(
  new GoogleStrategy(
    {
      clientID: config.express.GOOGLE_CLIENT_ID,
      clientSecret: config.express.GOOGLE_CLIENT_SECRET,
      callbackURL: config.express.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      const { emails } = profile;
      if (emails) {
        if (emails.length > 0) {
          const emailRecord = emails[0];
          if (emailRecord.verified) {
            const { value: email } = emailRecord;
            const { id: googleId, displayName: name } = profile;
            const existingUser = await User.findOne({
              where: {
                googleId,
              },
            });
            if (existingUser) {
              done(null, existingUser);
            } else {
              const newUser = await User.create({
                name,
                email,
                googleId,
              });
              done(null, newUser);
            }
            return;
          }
        }
      }
      done(new Error("User profile don't have a verified email address"));
    }
  )
);
