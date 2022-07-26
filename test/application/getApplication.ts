import { getApplication } from './endpoint';
import { ResultStatus } from '@src/type';
import { getAgent } from '@test/server';
import {
  FakeApplication,
  FakeFile,
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
let fakeApplication: FakeApplication;
let fakeResume: FakeFile;

beforeAll(async () => {
  await setupTestUser(agent);
  fakeProject = await setupTestProject(agent, { public: true });
  fakePosition = await setupTestPosition(agent, fakeProject.id, {
    public: true,
  });
  fakeResume = await setupTestResume(agent);
  fakeApplication = await setupTestApplication(
    agent,
    fakeProject.id,
    fakePosition.id,
    fakeResume.id
  );
});

test('can get application', async () => {
  const [res, body] = await getApplication({ id: fakeApplication.id }, agent);
  expect(res.status).toBe(200);
  expect(body.status).toBe(ResultStatus.OK);

  if (body.status === ResultStatus.OK) {
    expect(body.result?.id).toBe(fakeApplication.id);
  }
});

test("can't get application that not exists", async () => {
  const [res] = await getApplication({ id: -1 }, agent);
  expect(res.status).toBe(404);
});

test("can't get other user's application", async () => {
  const otherAgent = await getAgent();
  await setupTestUser(otherAgent);
  const [res] = await getApplication({ id: fakeApplication.id }, otherAgent);
  expect(res.status).toBe(403);
});
