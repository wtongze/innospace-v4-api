import { getProject } from './endpoint';
import { ResultStatus } from '@src/type';
import { getAgent } from '@test/server';
import {
  FakeProject,
  setupTestPosition,
  setupTestProject,
  setupTestUser,
} from '@test/utils';

const agent = getAgent();
let fakeProject: FakeProject;

beforeAll(async () => {
  await setupTestUser(agent);
  fakeProject = await setupTestProject(agent, { public: true });
  await setupTestPosition(agent, fakeProject.id, { public: true });
});

test('can get project', async () => {
  const [res, body] = await getProject({ id: fakeProject.id }, agent);
  expect(res.status).toBe(200);
  expect(body.status).toBe(ResultStatus.OK);

  if (body.status === ResultStatus.OK) {
    expect(body.result?.id).toBe(fakeProject.id);
  }
});

test("can't get project that not exists", async () => {
  const [res] = await getProject({ id: -1 }, agent);
  expect(res.status).toBe(404);
});

test("can't get non-public project", async () => {
  const otherProject = await setupTestProject(agent, { public: false });
  const otherAgent = await getAgent();
  await setupTestUser(otherAgent);
  const [res] = await getProject({ id: otherProject.id }, otherAgent);
  expect(res.status).toBe(403);
});

test('project view is increasing', async () => {
  const [res, body] = await getProject({ id: fakeProject.id }, agent);
  expect(res.status).toBe(200);
  expect(body.status).toBe(ResultStatus.OK);

  if (body.status === ResultStatus.OK) {
    expect(body.result?.views).toBeGreaterThan(1);
  }
});
