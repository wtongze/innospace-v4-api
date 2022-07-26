import type request from 'superagent';
import { getAgent, server } from '@test/server';

export type Agent = typeof server | ReturnType<typeof getAgent>;

export async function uploadFileEndpoint<T>(
  endpoint: string,
  filePath?: string,
  agent: Agent = server
): Promise<[request.Response, T]> {
  const req = agent.post(endpoint);
  if (filePath) {
    req.attach('file', filePath);
  }
  const res = await req;
  const body = res.body as T;
  return [res, body];
}

export async function getEndpoint<T>(
  endpoint: string,
  query: string | object = {},
  agent: Agent = server
): Promise<[request.Response, T]> {
  const res = await agent.get(endpoint).query(query);
  const body = res.body as T;
  return [res, body];
}

export async function postEndpoint<T>(
  endpoint: string,
  data: string | object = {},
  agent: Agent = server
): Promise<[request.Response, T]> {
  const res = await agent.post(endpoint).send(data);
  const body = res.body as T;
  return [res, body];
}

export async function patchEndpoint<T>(
  endpoint: string,
  data: string | object = {},
  agent: Agent = server
): Promise<[request.Response, T]> {
  const res = await agent.patch(endpoint).send(data);
  const body = res.body as T;
  return [res, body];
}

export async function deleteEndpoint<T>(
  endpoint: string,
  data: string | object = {},
  agent: Agent = server
): Promise<[request.Response, T]> {
  const res = await agent.delete(endpoint).send(data);
  const body = res.body as T;
  return [res, body];
}
