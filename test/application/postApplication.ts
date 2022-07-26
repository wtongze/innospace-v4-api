import { faker } from '@faker-js/faker';
import { postApplication } from './endpoint';
import { ResultStatus } from '@src/type';
import { getAgent } from '@test/server';
import {
  FakeFile,
  FakePosition,
  FakeProject,
  setupTestPosition,
  setupTestProject,
  setupTestResume,
  setupTestUser,
} from '@test/utils';

const agent = getAgent();
let fakeProject: FakeProject;
let fakePosition: FakePosition;
let fakeResume: FakeFile;

beforeAll(async () => {
  await setupTestUser(agent);
  fakeProject = await setupTestProject(agent, { public: true });
  fakePosition = await setupTestPosition(agent, fakeProject.id, {
    public: true,
  });
  fakeResume = await setupTestResume(agent);
});

test('can create application', async () => {
  const [res, body] = await postApplication(
    {
      project: fakeProject.id,
      position: fakePosition.id,
      name: faker.name.findName(),
      email: faker.internet.email(),
      resume: fakeResume.id,
    },
    agent
  );
  expect(res.status).toBe(200);
  expect(body.status).toBe(ResultStatus.OK);
});
