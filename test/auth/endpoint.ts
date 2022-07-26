import { ResponseWithStatusBase } from '@src/type';
import { postEndpoint, getEndpoint, Agent } from '@test/endpoint';
import { server } from '@test/server';

interface SignupData {
  id?: string;
  name?: string;
  password?: string;
  email?: string;
}

/**
 * Signup user through `POST /v4/auth/signup`
 */
export const signup = (data: SignupData, agent: Agent = server) =>
  postEndpoint<ResponseWithStatusBase<{ id: number }>>(
    '/v4/auth/signup',
    data,
    agent
  );

interface SigninData {
  id?: number;
  password?: string;
}

/**
 * Signin user through `POST /v4/auth/signin`
 */
export const signin = (data: SigninData, agent: Agent = server) =>
  postEndpoint<ResponseWithStatusBase>('/v4/auth/signin', data, agent);

/**
 * Signout user through `GET /v4/auth/signout`
 */
export const signout = (agent: Agent = server) =>
  getEndpoint<ResponseWithStatusBase>('/v4/auth/signout', undefined, agent);
