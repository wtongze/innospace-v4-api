import { faker } from '@faker-js/faker';
import { postPosition } from './endpoint';
import { ResultStatus } from '@src/type';
import { getAgent } from '@test/server';
import { FakeProject, setupTestProject, setupTestUser } from '@test/utils';

const agent = getAgent();
let fakeProject: FakeProject;

beforeAll(async () => {
  await setupTestUser(agent);
  fakeProject = await setupTestProject(agent, { public: true });
});

test('can create position', async () => {
  const [res, body] = await postPosition(
    {
      title: faker.datatype.string(),
      description: faker.datatype.string(50),
      requirement: faker.datatype.string(50),
      preference: faker.datatype.string(50),
      skills: [faker.datatype.string(), faker.datatype.string()],
      project: fakeProject.id,
      public: faker.datatype.boolean(),
    },
    agent
  );
  expect(res.status).toBe(200);
  expect(body.status).toBe(ResultStatus.OK);
});

test("can't create position for project that user not own", async () => {
  const otherAgent = getAgent();
  await setupTestUser(otherAgent);
  const [res] = await postPosition(
    {
      title: faker.datatype.string(),
      description: faker.datatype.string(50),
      requirement: faker.datatype.string(50),
      preference: faker.datatype.string(50),
      skills: [faker.datatype.string(), faker.datatype.string()],
      project: fakeProject.id,
      public: faker.datatype.boolean(),
    },
    otherAgent
  );
  expect(res.status).toBe(403);
});

test("can't create position for project that not exist", async () => {
  const [res] = await postPosition(
    {
      title: faker.datatype.string(),
      description: faker.datatype.string(50),
      requirement: faker.datatype.string(50),
      preference: faker.datatype.string(50),
      skills: [faker.datatype.string(), faker.datatype.string()],
      project: -1,
      public: faker.datatype.boolean(),
    },
    agent
  );
  expect(res.status).toBe(400);
});
