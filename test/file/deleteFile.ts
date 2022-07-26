import { deleteFile } from './endpoint';
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

test('can delete file that not associated with any project or application for limited time', async () => {
  const fakeAvatar = await setupTestAvatar(agent);
  const [res] = await deleteFile({ id: fakeAvatar.id }, agent);
  expect(res.status).toBe(200);
});

test('can delete avatar if user is project owner', async () => {
  const fakeAvatar = await setupTestAvatar(agent);
  await setupTestProject(agent, { avatar: fakeAvatar.id });
  const [res] = await deleteFile({ id: fakeAvatar.id }, agent);
  expect(res.status).toBe(200);
});

test("can't delete avatar if user is not project owner", async () => {
  const anotherAgent = getAgent();
  await setupTestUser(anotherAgent);
  const fakeAvatar = await setupTestAvatar(agent);
  await setupTestProject(agent, { avatar: fakeAvatar.id });
  const [res] = await deleteFile({ id: fakeAvatar.id }, anotherAgent);
  expect(res.status).toBe(403);
});

test('application owner can delete file from withdrawn application', async () => {
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
  const [res] = await deleteFile({ id: fakeResume.id }, anotherAgent);
  expect(res.status).toBe(200);
});

test("application owner can't delete file from application that is not withdrawn", async () => {
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
  const [res] = await deleteFile({ id: fakeResume.id }, anotherAgent);
  expect(res.status).toBe(400);
});

test('only application owner can delete file from withdrawn application', async () => {
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
  const [res] = await deleteFile({ id: fakeResume.id }, agent);
  expect(res.status).toBe(403);
});
