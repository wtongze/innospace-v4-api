import { deleteApplication, patchApplication } from './endpoint';
import { ApplicationStatus, ResultStatus } from '@src/type';
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

beforeAll(async () => {
  await setupTestUser(agent);
  fakeProject = await setupTestProject(agent, { public: true });
  fakePosition = await setupTestPosition(agent, fakeProject.id, {
    public: true,
  });
});

test('can delete application', async () => {
  const otherAgent = getAgent();
  await setupTestUser(otherAgent);
  const fakeResume = await setupTestResume(otherAgent);
  const fakeApplication = await setupTestApplication(
    otherAgent,
    fakeProject.id,
    fakePosition.id,
    fakeResume.id
  );
  await patchApplication(
    {
      id: fakeApplication.id,
      status: ApplicationStatus.WITHDRAWN,
    },
    otherAgent
  );
  const [res, body] = await deleteApplication(
    { id: fakeApplication.id },
    otherAgent
  );
  expect(res.status).toBe(200);
  expect(body.status).toBe(ResultStatus.OK);
});

test('can\'t delete application if its status is not "WITHDRAWN"', async () => {
  const otherAgent = getAgent();
  await setupTestUser(otherAgent);
  const fakeResume = await setupTestResume(otherAgent);
  const fakeApplication = await setupTestApplication(
    otherAgent,
    fakeProject.id,
    fakePosition.id,
    fakeResume.id
  );
  const [res] = await deleteApplication({ id: fakeApplication.id }, otherAgent);
  expect(res.status).toBe(400);
});

test("can't delete application if user is not its owner", async () => {
  const otherAgent = getAgent();
  await setupTestUser(otherAgent);
  const fakeResume = await setupTestResume(otherAgent);
  const fakeApplication = await setupTestApplication(
    otherAgent,
    fakeProject.id,
    fakePosition.id,
    fakeResume.id
  );
  await patchApplication(
    {
      id: fakeApplication.id,
      status: ApplicationStatus.WITHDRAWN,
    },
    otherAgent
  );
  const [res] = await deleteApplication({ id: fakeApplication.id }, agent);
  expect(res.status).toBe(403);
});

test("can't delete application if it not exists", async () => {
  const [res] = await deleteApplication({ id: -1 }, agent);
  expect(res.status).toBe(404);
});
