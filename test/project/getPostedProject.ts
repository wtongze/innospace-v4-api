import { getPostedProject } from './endpoint';
import { ResultStatus } from '@src/type';
import { getAgent } from '@test/server';
import { FakeProject, setupTestProject, setupTestUser } from '@test/utils';

const agent = getAgent();
let fakeProject: FakeProject;

beforeAll(async () => {
  await setupTestUser(agent);
  fakeProject = await setupTestProject(agent);
});

test('can get posted project', async () => {
  const [res, body] = await getPostedProject(agent);
  expect(res.status).toBe(200);
  expect(body.status).toBe(ResultStatus.OK);
  if (body.status === ResultStatus.OK) {
    expect(body.result).not.toBeUndefined();
    expect(body.result?.map((i) => i.id)).toContain(fakeProject.id);
  }
});
