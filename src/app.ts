import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import queryString from 'query-string';
import config, { PROD } from './config';
import 'dotenv/config';
import './passport/local';
import ApplicationRouter from './router/application';
import AuthRouter from './router/auth';
import FileRouter from './router/file';
import PositionRouter from './router/position';
import ProjectRouter from './router/project';
import UserRouter from './router/user';

const app = express();
const BaseRouter = express.Router();

app.set('query parser', (query: string) =>
  queryString.parse(query, { parseBooleans: true, parseNumbers: true })
);
app.use(
  cors({
    origin: PROD ? 'https://www.innospace.io' : 'http://localhost:3000',
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    name: 'sid',
    secret: config.express.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: 'lax',
    },
  })
);
app.use(passport.initialize());
app.use(passport.authenticate('session'));

app.use('/v4', BaseRouter);

BaseRouter.use('/auth', AuthRouter);
BaseRouter.use('/project', ProjectRouter);
BaseRouter.use('/position', PositionRouter);
BaseRouter.use('/application', ApplicationRouter);
BaseRouter.use('/file', FileRouter);
BaseRouter.use('/user', UserRouter);

app.get('/', (req, res) => {
  res.send('Hello World');
});

export default app;
