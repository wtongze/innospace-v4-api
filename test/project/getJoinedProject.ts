import { getJoinedProject } from './endpoint';
import { ApplicationStatus, ResultStatus } from '@src/type';
import { getApplication, patchApplication } from '@test/application/endpoint';
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

test('can get joined projects', async () => {
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

  await patchApplication(
    {
      id: fakeApplication.id,
      status: ApplicationStatus.ACCEPTED,
    },
    agent
  );

  const [res, body] = await getJoinedProject(anotherAgent);
  expect(res.status).toBe(200);
  expect(body.status).toBe(ResultStatus.OK);
  if (body.status === ResultStatus.OK) {
    expect(body.result?.map((i) => i.id)).toContain(fakeProject.id);
  }
});
