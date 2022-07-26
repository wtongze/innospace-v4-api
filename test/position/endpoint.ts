import { PositionInfo } from '@src/router/position/type';
import { ResponseWithStatusBase } from '@src/type';
import {
  getEndpoint,
  Agent,
  postEndpoint,
  patchEndpoint,
  deleteEndpoint,
} from '@test/endpoint';
import { server } from '@test/server';

/**
 * Get position through `GET /v4/position`
 */
export const getPosition = (data: { id: number }, agent: Agent = server) =>
  getEndpoint<ResponseWithStatusBase<PositionInfo>>(
    '/v4/position',
    data,
    agent
  );

export interface PostPositionData {
  title: string;
  description: string;
  requirement: string;
  preference: string;
  skills: string[];
  project: number;
  public: boolean;
}

/**
 * Create a position through `POST /v4/position`
 */
export const postPosition = (data: PostPositionData, agent: Agent = server) =>
  postEndpoint<ResponseWithStatusBase<{ id: number }>>(
    '/v4/position',
    data,
    agent
  );

export interface PatchPositionData {
  id: number;
  title?: string;
  description?: string;
  requirement?: string;
  preference?: string;
  skills?: string[];
  public?: boolean;
}

/**
 * Patch a position through `PATCH /v4/position`
 */
export const patchPosition = (data: PatchPositionData, agent: Agent = server) =>
  patchEndpoint<ResponseWithStatusBase<{ id: number }>>(
    '/v4/position',
    data,
    agent
  );

/**
 * Delete position through `DELETE /v4/position`
 */
export const deletePosition = (data: { id: number }, agent: Agent = server) =>
  deleteEndpoint<ResponseWithStatusBase<PositionInfo>>(
    '/v4/position',
    data,
    agent
  );
