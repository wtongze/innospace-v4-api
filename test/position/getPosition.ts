import { getPosition } from './endpoint';
import { ResultStatus } from '@src/type';
import { getAgent } from '@test/server';
import {
  FakePosition,
  FakeProject,
  setupTestPosition,
  setupTestProject,
  setupTestUser,
} from '@test/utils';

const agent = getAgent();
let fakeProject: FakeProject;
let fakePosition: FakePosition;

beforeAll(async () => {
  await setupTestUser(agent);
  fakeProject = await setupTestProject(agent, { public: true });
  fakePosition = await setupTestPosition(agent, fakeProject.id, {
    public: true,
  });
});

test('can get position', async () => {
  const [res, body] = await getPosition({ id: fakePosition.id }, agent);
  expect(res.status).toBe(200);
  expect(body.status).toBe(ResultStatus.OK);

  if (body.status === ResultStatus.OK) {
    expect(body.result?.id).toBe(fakePosition.id);
  }
});

test("can't get position that not exists", async () => {
  const [res] = await getPosition({ id: -1 }, agent);
  expect(res.status).toBe(404);
});

test("can't get non-public position", async () => {
  const otherPosition = await setupTestPosition(agent, fakeProject.id, {
    public: false,
  });
  const otherAgent = await getAgent();
  await setupTestUser(otherAgent);
  const [res] = await getPosition({ id: otherPosition.id }, otherAgent);
  expect(res.status).toBe(403);
});

test('position view is increasing', async () => {
  const [res, body] = await getPosition({ id: fakePosition.id }, agent);
  expect(res.status).toBe(200);
  expect(body.status).toBe(ResultStatus.OK);

  if (body.status === ResultStatus.OK) {
    expect(body.result?.views).toBeGreaterThan(1);
  }
});
