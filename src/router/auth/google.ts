import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { login } from './utils';
import config from '@src/config';
import User from '@src/database/User';

const googleAuthHandler = [
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      'google',
      {
        state: typeof req.query.next === 'string' ? req.query.next : undefined,
      },
      async (error: Error | null, user?: User) => {
        if (error) {
          const link = new URL(config.express.OAUTH_FAIL_URL);
          link.searchParams.set('error', error.message);
          res.redirect(link.toString());
        } else {
          await login(req, user!);
          next();
        }
      }
    )(req, res, next);
  },
  (req: Request, res: Response) => {
    if (typeof req.query.state === 'string') {
      res.redirect(req.query.state);
    } else {
      res.redirect(config.express.OAUTH_SUCCESS_URL);
    }
  },
];

export default googleAuthHandler;
