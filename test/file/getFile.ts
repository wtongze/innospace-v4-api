import { getFile } from './endpoint';
import { ApplicationStatus } from '@src/type';
import { patchApplication } from '@test/application/endpoint';
import { getAgent } from '@test/server';
import {
  setupTestApplication,
  setupTestAvatar,
  setupTestPosition,
  setupTestProject,
  setupTestResume,
  setupTestUser,
} from '@test/utils';

const agent = getAgent();

beforeAll(async () => {
  await setupTestUser(agent);
});

test('can get file that not associated with any project or application for limited time', async () => {
  const fakeAvatar = await setupTestAvatar(agent);
  const [res] = await getFile({ id: fakeAvatar.id }, agent);
  expect(res.status).toBe(200);
});

test('can get avatar from public project', async () => {
  const fakeAvatar = await setupTestAvatar(agent);
  await setupTestProject(agent, { avatar: fakeAvatar.id });
  const [res] = await getFile({ id: fakeAvatar.id }, agent);
  expect(res.status).toBe(200);
});

test("can't get avatar from private project", async () => {
  const anotherAgent = getAgent();
  await setupTestUser(anotherAgent);
  const fakeAvatar = await setupTestAvatar(agent);
  await setupTestProject(agent, { avatar: fakeAvatar.id, public: false });
  const [res] = await getFile({ id: fakeAvatar.id }, anotherAgent);
  expect(res.status).toBe(403);
});

test('can get resume from application from its owner', async () => {
  const anotherAgent = getAgent();
  await setupTestUser(anotherAgent);
  const fakeResume = await setupTestResume(anotherAgent);
  const fakeAvatar = await setupTestAvatar(agent);
  const fakeProject = await setupTestProject(agent, {
    avatar: fakeAvatar.id,
    public: true,
  });
  const fakePostion = await setupTestPosition(agent, fakeProject.id, {
    public: true,
  });
  await setupTestApplication(
    anotherAgent,
    fakeProject.id,
    fakePostion.id,
    fakeResume.id
  );
  const [res] = await getFile({ id: fakeResume.id }, anotherAgent);
  expect(res.status).toBe(200);
});

test('can get resume from application from project owner if application is not withdrawn', async () => {
  const anotherAgent = getAgent();
  await setupTestUser(anotherAgent);
  const fakeResume = await setupTestResume(anotherAgent);
  const fakeAvatar = await setupTestAvatar(agent);
  const fakeProject = await setupTestProject(agent, {
    avatar: fakeAvatar.id,
    public: true,
  });
  const fakePostion = await setupTestPosition(agent, fakeProject.id, {
    public: true,
  });
  const fakeApplication = await setupTestApplication(
    anotherAgent,
    fakeProject.id,
    fakePostion.id,
    fakeResume.id
  );
  await patchApplication({
    id: fakeApplication.id,
    status: ApplicationStatus.ACCEPTED,
  });
  const [res] = await getFile({ id: fakeResume.id }, agent);
  expect(res.status).toBe(200);
});

test("project owner can't get resume from withdrawn application", async () => {
  const anotherAgent = getAgent();
  await setupTestUser(anotherAgent);
  const fakeResume = await setupTestResume(anotherAgent);
  const fakeAvatar = await setupTestAvatar(agent);
  const fakeProject = await setupTestProject(agent, {
    avatar: fakeAvatar.id,
    public: true,
  });
  const fakePostion = await setupTestPosition(agent, fakeProject.id, {
    public: true,
  });
  const fakeApplication = await setupTestApplication(
    anotherAgent,
    fakeProject.id,
    fakePostion.id,
    fakeResume.id
  );
  await patchApplication(
    {
      id: fakeApplication.id,
      status: ApplicationStatus.WITHDRAWN,
    },
    anotherAgent
  );
  const [res] = await getFile({ id: fakeResume.id }, agent);
  expect(res.status).toBe(403);
});
