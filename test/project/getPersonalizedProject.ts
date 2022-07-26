import { getPersonalizedProject } from './endpoint';
import { ResultStatus } from '@src/type';
import { getAgent } from '@test/server';
import { setupTestUser } from '@test/utils';

const agent = getAgent();

beforeAll(async () => {
  await setupTestUser(agent);
});

test('can get all personalized projects', async () => {
  const [res, body] = await getPersonalizedProject(undefined, agent);
  expect(res.status).toBe(200);
  expect(body.status).toBe(ResultStatus.OK);
  if (body.status === ResultStatus.OK) {
    expect(body.result).not.toBeUndefined();
  }
});
