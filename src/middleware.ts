import type { Request, NextFunction } from 'express';
import type * as core from 'express-serve-static-core';
import { validationResult } from 'express-validator';
import { ResponseWithStatus, ResultStatus } from './type';

export function validator(
  req: Request<core.ParamsDictionary, any, any, any, Record<string, any>>,
  res: ResponseWithStatus,
  next: NextFunction
) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      status: ResultStatus.ERRORS,
      errors: errors.array(),
    });
  } else {
    next();
  }
}

export function checkSignedIn(
  req: Request<core.ParamsDictionary, any, any, any, Record<string, any>>,
  res: ResponseWithStatus,
  next: NextFunction
) {
  if (req.user) {
    next();
  } else {
    res.status(401).json({
      status: ResultStatus.ERROR,
      error: 'User is not signed in',
    });
  }
}
