import {
  BasicProject,
  Pagination,
  ProjectInfo,
} from '@src/router/project/type';
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
 * Get trending projects through `GET /v4/project/trending`
 */
export const getTrendingProject = (
  data: Pagination = {},
  agent: Agent = server
) =>
  getEndpoint<ResponseWithStatusBase<BasicProject[]>>(
    '/v4/project/trending',
    data,
    agent
  );

/**
 * Get personalized projects through `GET /v4/project/personalized`
 */
export const getPersonalizedProject = (
  data: Pagination = {},
  agent: Agent = server
) =>
  getEndpoint<ResponseWithStatusBase<BasicProject[]>>(
    '/v4/project/personalized',
    data,
    agent
  );

interface SearchProject {
  keyword: string;
}

/**
 * Search projects through `GET /v4/project/search`
 */
export const searchProject = (data: SearchProject, agent: Agent = server) =>
  getEndpoint<ResponseWithStatusBase<BasicProject[]>>(
    '/v4/project/search',
    data,
    agent
  );

/**
 * Get posted projects through `GET /v4/project/posted`
 */
export const getPostedProject = (agent: Agent = server) =>
  getEndpoint<ResponseWithStatusBase<BasicProject[]>>(
    '/v4/project/posted',
    undefined,
    agent
  );

/**
 * Get joined projects through `GET /v4/project/joined`
 */
export const getJoinedProject = (agent: Agent = server) =>
  getEndpoint<ResponseWithStatusBase<BasicProject[]>>(
    '/v4/project/joined',
    undefined,
    agent
  );

export interface PostProjectData {
  name: string;
  avatar?: string;
  summary: string;
  description: string;
  fields: string[];
  contactName: string;
  contactEmail: string;
  website?: string;
  public: boolean;
}

/**
 * Create a project through `POST /v4/project`
 */
export const postProject = (data: PostProjectData, agent: Agent = server) =>
  postEndpoint<ResponseWithStatusBase<{ id: number }>>(
    '/v4/project',
    data,
    agent
  );

export interface GetProjectData {
  id: number;
}

/**
 * Get a project through `GET /v4/project`
 */
export const getProject = (data: GetProjectData, agent: Agent = server) =>
  getEndpoint<ResponseWithStatusBase<ProjectInfo>>('/v4/project', data, agent);

export interface PatchProjectData {
  id: number;
  name?: string;
  avatar?: string;
  summary?: string;
  description?: string;
  fields?: string[];
  contactName?: string;
  contactEmail?: string;
  website?: string;
  public?: boolean;
}

/**
 * Patch a project through `PATCH /v4/project`
 */
export const patchProject = (data: PatchProjectData, agent: Agent = server) =>
  patchEndpoint<ResponseWithStatusBase>('/v4/project', data, agent);

/**
 * Delete a project through `DELETE /v4/project`
 */
export const deleteProject = (data: GetProjectData, agent: Agent = server) =>
  deleteEndpoint<ResponseWithStatusBase>('/v4/project', data, agent);
