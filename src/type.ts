import { Response } from 'express';
import { ValidationError } from 'express-validator';

export enum ResultStatus {
  OK = 'OK',
  ERROR = 'ERROR',
  ERRORS = 'ERRORS',
}

export enum ApplicationStatus {
  SUBMITTED = 'SUBMITTED',
  REVIEWED = 'REVIEWED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

export interface ErrorResponse {
  status: ResultStatus.ERROR;
  error?: string;
}

interface ValidationErrorsResponse {
  status: ResultStatus.ERRORS;
  errors: ValidationError[];
}

export interface OkResponse<T = undefined> {
  status: ResultStatus.OK;
  result?: T;
}

export type ResponseWithStatusBase<T = undefined> =
  | ErrorResponse
  | ValidationErrorsResponse
  | OkResponse<T>;

export type ResponseWithStatus<T = undefined> = Response<
  ResponseWithStatusBase<T>
>;
