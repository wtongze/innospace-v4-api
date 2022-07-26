import express, { Request } from 'express';
import User from '@src/database/User';
import { ResponseWithStatus, ResultStatus } from '@src/type';

const UserRouter = express.Router();

type BasicUser = Pick<User, 'id' | 'name' | 'email'>;
UserRouter.get('/basic', (req: Request, res: ResponseWithStatus<BasicUser>) => {
  if (req.user) {
    const { user } = req;
    res.json({
      status: ResultStatus.OK,
      result: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } else {
    res.json({ status: ResultStatus.ERROR });
  }
});

export default UserRouter;
