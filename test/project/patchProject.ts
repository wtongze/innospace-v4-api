import { faker } from '@faker-js/faker';
import { patchProject } from './endpoint';
import { ResultStatus } from '@src/type';
import { getAgent } from '@test/server';
import {
  FakeProject,
  setupTestAvatar,
  setupTestProject,
  setupTestUser,
} from '@test/utils';

const agent = getAgent();
let fakeProject: FakeProject;

beforeAll(async () => {
  await setupTestUser(agent);
  fakeProject = await setupTestProject(agent);
});

test('can patch project name', async () => {
  const fakeAvatar = await setupTestAvatar(agent);
  const [res, body] = await patchProject(
    {
      id: fakeProject.id,
      name: faker.datatype.string(),
      summary: faker.datatype.string(),
      description: faker.datatype.string(),
      fields: [faker.datatype.string(), faker.datatype.string()],
      contactName: faker.name.findName(),
      contactEmail: faker.internet.email(),
      public: faker.datatype.boolean(),
      website: faker.internet.url(),
      avatar: fakeAvatar.id,
    },
    agent
  );
  expect(res.status).toBe(200);
  expect(body.status).toBe(ResultStatus.OK);
});

test("can't patch project that not exist", async () => {
  const newName = 'whatever';
  const [res] = await patchProject({ id: -1, name: newName }, agent);
  expect(res.status).toBe(404);
});

test("can't patch project that user not own", async () => {
  const newAgent = getAgent();
  await setupTestUser(newAgent);
  const newName = 'whatever';
  const [res] = await patchProject(
    { id: fakeProject.id, name: newName },
    newAgent
  );
  expect(res.status).toBe(403);
});
