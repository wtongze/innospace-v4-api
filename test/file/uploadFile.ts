import path from 'path';
import { uploadFile } from './endpoint';
import { ResultStatus } from '@src/type';
import { getAgent } from '@test/server';
import { setupTestUser } from '@test/utils';

const filePath = path.join(__dirname, 'logo.png');
const agent = getAgent();

beforeAll(async () => {
  await setupTestUser(agent);
});

test('can upload file', async () => {
  const [res, body] = await uploadFile(filePath, agent);
  expect(res.status).toBe(200);
  expect(body.status).toBe(ResultStatus.OK);
  expect(body.result?.id).not.toBeUndefined();
});

test('reject request without file attached', async () => {
  const [res] = await uploadFile(undefined, agent);
  expect(res.status).toBe(400);
});

test('reject user that not signed in', async () => {
  const [res] = await uploadFile(filePath);
  expect(res.status).toBe(401);
});
