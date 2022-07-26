import { deleteProject } from './endpoint';
import { ResultStatus } from '@src/type';
import { getAgent } from '@test/server';
import {
  FakePosition,
  FakeProject,
  setupTestApplication,
  setupTestPosition,
  setupTestProject,
  setupTestResume,
  setupTestUser,
} from '@test/utils';

const agent = getAgent();
let fakeProject: FakeProject;
let fakePosition: FakePosition;

beforeEach(async () => {
  await setupTestUser(agent);
  fakeProject = await setupTestProject(agent);
  fakePosition = await setupTestPosition(agent, fakeProject.id, {
    public: true,
  });
});

test('can delete project', async () => {
  const anotherAgent = getAgent();
  await setupTestUser(anotherAgent);

  const fakeResume = await setupTestResume(anotherAgent);
  await setupTestApplication(
    anotherAgent,
    fakeProject.id,
    fakePosition.id,
    fakeResume.id
  );

  const [res, body] = await deleteProject({ id: fakeProject.id }, agent);
  expect(res.status).toBe(200);
  expect(body.status).toBe(ResultStatus.OK);
});

test("can't delete project that not exist", async () => {
  const [res] = await deleteProject({ id: -1 }, agent);
  expect(res.status).toBe(404);
});

test("can't delete project that user not own", async () => {
  const newAgent = getAgent();
  await setupTestUser(newAgent);
  const [res] = await deleteProject({ id: fakeProject.id }, newAgent);
  expect(res.status).toBe(403);
});
