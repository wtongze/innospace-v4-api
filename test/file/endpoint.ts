import { Response } from 'express';
import { OkResponse } from '@src/type';
import {
  uploadFileEndpoint,
  Agent,
  getEndpoint,
  deleteEndpoint,
} from '@test/endpoint';
import { server } from '@test/server';

/**
 * Upload file through `POST /v4/file`
 */
export const uploadFile = (filePath?: string, agent: Agent = server) =>
  uploadFileEndpoint<OkResponse<{ id: string }>>('/v4/file', filePath, agent);

/**
 * Get file through `GET /v4/file`
 */
export const getFile = (data: { id: string }, agent: Agent = server) =>
  getEndpoint<Response>('/v4/file', data, agent);

/**
 * Delete file through `DELETE /v4/file`
 */
export const deleteFile = (data: { id: string }, agent: Agent = server) =>
  deleteEndpoint<Response>('/v4/file', data, agent);
