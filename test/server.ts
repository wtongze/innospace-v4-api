import request from 'supertest';
import app from '@src/app';

export const server = request(app);
export const getAgent = () => request.agent(app);
