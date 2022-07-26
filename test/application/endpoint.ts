import { ApplicationInfo } from '@src/router/application/type';
import { ApplicationStatus, ResponseWithStatusBase } from '@src/type';
import {
  getEndpoint,
  postEndpoint,
  Agent,
  patchEndpoint,
  deleteEndpoint,
} from '@test/endpoint';
import { server } from '@test/server';

/**
 * Get application through `GET /v4/application`
 */
export const getApplication = (data: { id: number }, agent: Agent = server) =>
  getEndpoint<ResponseWithStatusBase<ApplicationInfo>>(
    '/v4/application',
    data,
    agent
  );

export interface PostApplicationData {
  project: number;
  position: number;
  name: string;
  email: string;
  resume: string;
}

/**
 * Create an application through `POST /v4/application`
 */
export const postApplication = (
  data: PostApplicationData,
  agent: Agent = server
) =>
  postEndpoint<ResponseWithStatusBase<{ id: number }>>(
    '/v4/application',
    data,
    agent
  );

export interface PatchApplicationData {
  id: number;
  status: ApplicationStatus;
}

/**
 * Patch an application through `PATCH /v4/application`
 */
export const patchApplication = (
  data: PatchApplicationData,
  agent: Agent = server
) => patchEndpoint<ResponseWithStatusBase>('/v4/application', data, agent);

/**
 * Delete an application through `DELETE /v4/application`
 */
export const deleteApplication = (
  data: { id: number },
  agent: Agent = server
) => deleteEndpoint<ResponseWithStatusBase>('/v4/application', data, agent);
