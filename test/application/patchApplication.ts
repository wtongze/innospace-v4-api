import { getApplication, patchApplication } from './endpoint';
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

test('can withdraw application', async () => {
  const anotherAgent = getAgent();
  await setupTestUser(anotherAgent);
  const fakeResume = await setupTestResume(anotherAgent);
  const fakeApplication = await setupTestApplication(
    anotherAgent,
    fakeProject.id,
    fakePosition.id,
    fakeResume.id
  );
  const [res, body] = await patchApplication(
    { id: fakeApplication.id, status: ApplicationStatus.WITHDRAWN },
    anotherAgent
  );
  expect(res.status).toBe(200);
  expect(body.status).toBe(ResultStatus.OK);
});

test('can accept application', async () => {
  const anotherAgent = getAgent();
  await setupTestUser(anotherAgent);
  const fakeResume = await setupTestResume(anotherAgent);
  const fakeApplication = await setupTestApplication(
    anotherAgent,
    fakeProject.id,
    fakePosition.id,
    fakeResume.id
  );
  await getApplication({ id: fakeApplication.id }, agent);
  const [res, body] = await patchApplication(
    { id: fakeApplication.id, status: ApplicationStatus.ACCEPTED },
    agent
  );
  expect(res.status).toBe(200);
  expect(body.status).toBe(ResultStatus.OK);
});

test('can reject application', async () => {
  const anotherAgent = getAgent();
  await setupTestUser(anotherAgent);
  const fakeResume = await setupTestResume(anotherAgent);
  const fakeApplication = await setupTestApplication(
    anotherAgent,
    fakeProject.id,
    fakePosition.id,
    fakeResume.id
  );
  await getApplication({ id: fakeApplication.id }, agent);
  const [res, body] = await patchApplication(
    { id: fakeApplication.id, status: ApplicationStatus.REJECTED },
    agent
  );
  expect(res.status).toBe(200);
  expect(body.status).toBe(ResultStatus.OK);
});

test("project owner can't change decision after accept application", async () => {
  const anotherAgent = getAgent();
  await setupTestUser(anotherAgent);
  const fakeResume = await setupTestResume(anotherAgent);
  const fakeApplication = await setupTestApplication(
    anotherAgent,
    fakeProject.id,
    fakePosition.id,
    fakeResume.id
  );
  await getApplication({ id: fakeApplication.id }, agent);
  const [res, body] = await patchApplication(
    { id: fakeApplication.id, status: ApplicationStatus.ACCEPTED },
    agent
  );
  expect(res.status).toBe(200);
  expect(body.status).toBe(ResultStatus.OK);
  const [result] = await patchApplication(
    { id: fakeApplication.id, status: ApplicationStatus.REJECTED },
    agent
  );
  expect(result.status).toBe(403);
});

test("application owner can't restore application after withdraw application", async () => {
  const anotherAgent = getAgent();
  await setupTestUser(anotherAgent);
  const fakeResume = await setupTestResume(anotherAgent);
  const fakeApplication = await setupTestApplication(
    anotherAgent,
    fakeProject.id,
    fakePosition.id,
    fakeResume.id
  );
  const [res, body] = await patchApplication(
    { id: fakeApplication.id, status: ApplicationStatus.WITHDRAWN },
    anotherAgent
  );
  expect(res.status).toBe(200);
  expect(body.status).toBe(ResultStatus.OK);
  const [result] = await patchApplication(
    { id: fakeApplication.id, status: ApplicationStatus.SUBMITTED },
    anotherAgent
  );
  expect(result.status).toBe(403);
});

test('only application owner and project owner can change application status', async () => {
  const anotherAgent = getAgent();
  await setupTestUser(anotherAgent);
  const randomAgent = getAgent();
  await setupTestUser(randomAgent);
  const fakeResume = await setupTestResume(anotherAgent);
  const fakeApplication = await setupTestApplication(
    anotherAgent,
    fakeProject.id,
    fakePosition.id,
    fakeResume.id
  );
  const [res] = await patchApplication(
    { id: fakeApplication.id, status: ApplicationStatus.WITHDRAWN },
    randomAgent
  );
  expect(res.status).toBe(403);
});

test("can't patch application that not exists", async () => {
  const anotherAgent = getAgent();
  await setupTestUser(anotherAgent);
  const [res] = await patchApplication(
    { id: -1, status: ApplicationStatus.WITHDRAWN },
    anotherAgent
  );
  expect(res.status).toBe(404);
});
