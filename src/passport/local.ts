import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../database/User';
import type UserType from '../database/User';
import { getPasswordHash } from '../router/auth/utils';
import './google';

declare global {
  namespace Express {
    interface User extends UserType {}
  }
}

passport.use(
  new LocalStrategy({ usernameField: 'id' }, async (id, password, done) => {
    const currentUser = await User.findByPk(id);
    if (currentUser && currentUser.password && currentUser.salt) {
      const hashedPassword = await getPasswordHash(password, currentUser.salt);
      if (currentUser.password === hashedPassword) {
        done(null, currentUser);
        return;
      }
    }
    done(new Error('Username or Password is incorrect'));
  })
);

passport.serializeUser<string>((user, done) => {
  done(null, user.id.toString());
});

passport.deserializeUser<string>(async (id: string, done) => {
  const user = await User.findByPk(id);
  if (user) {
    done(null, user);
  } else {
    done(new Error('User not found'));
  }
});
