import express, { Request } from 'express';
import { body } from 'express-validator';
import passport from 'passport';
import googleAuthHandler from './google';
import { getPasswordSalt, getPasswordHash, login, logout } from './utils';
import User from '@src/database/User';
import { checkSignedIn, validator } from '@src/middleware';
import { ResponseWithStatus, ResultStatus } from '@src/type';

const AuthRouter = express.Router();

AuthRouter.post(
  '/signup',
  body('name').isLength({ min: 5 }),
  body('password').isStrongPassword(),
  body('email').isEmail().normalizeEmail(),
  validator,
  async (
    req: Request<
      {},
      {},
      {
        name: string;
        password: string;
        email: string;
      },
      {}
    >,
    res: ResponseWithStatus<{ id: number }>
  ) => {
    const { name, password: rawPassword, email } = req.body;
    const salt = await getPasswordSalt();
    const password = await getPasswordHash(rawPassword, salt);
    const newUser = await User.create({
      name,
      password,
      salt,
      email,
    });
    await login(req, newUser);
    res.json({ status: ResultStatus.OK, result: { id: newUser.id } });
  }
);

AuthRouter.post(
  '/signin',
  body('id').isInt(),
  body('password').notEmpty(),
  validator,
  (req: Request, res: ResponseWithStatus, next) => {
    passport.authenticate('local', async (error: Error | null, user?: User) => {
      if (error) {
        res.json({ status: ResultStatus.ERROR, error: error.message });
      } else {
        await login(req, user!);
        next();
      }
    })(req, res, next);
  },
  (req, res) => {
    res.json({ status: ResultStatus.OK });
  }
);

AuthRouter.get('/google', googleAuthHandler);

AuthRouter.get(
  '/signout',
  checkSignedIn,
  async (req: Request, res: ResponseWithStatus) => {
    await logout(req);
    res.json({ status: ResultStatus.OK });
  }
);

export default AuthRouter;
