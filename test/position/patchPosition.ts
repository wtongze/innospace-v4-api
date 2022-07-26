import { faker } from '@faker-js/faker';
import { patchPosition } from './endpoint';
import { ResultStatus } from '@src/type';
import { getAgent } from '@test/server';
import {
  FakePosition,
  FakeProject,
  setupTestPosition,
  setupTestProject,
  setupTestUser,
} from '@test/utils';

const agent = getAgent();
let fakeProject: FakeProject;
let fakePosition: FakePosition;

beforeAll(async () => {
  await setupTestUser(agent);
  fakeProject = await setupTestProject(agent);
  fakePosition = await setupTestPosition(agent, fakeProject.id, {
    public: true,
  });
});

test('can patch position', async () => {
  const [res, body] = await patchPosition(
    {
      id: fakePosition.id,
      title: faker.datatype.string(),
      description: faker.datatype.string(50),
      requirement: faker.datatype.string(50),
      preference: faker.datatype.string(50),
      skills: [faker.datatype.string(), faker.datatype.string()],
      public: faker.datatype.boolean(),
    },
    agent
  );
  expect(res.status).toBe(200);
  expect(body.status).toBe(ResultStatus.OK);
});

test("can't patch position which not exist", async () => {
  const newTitle = 'whatever';
  const [res] = await patchPosition({ id: -1, title: newTitle }, agent);
  expect(res.status).toBe(404);
});

test("can't patch project that user not own", async () => {
  const newAgent = getAgent();
  await setupTestUser(newAgent);
  const newTitle = 'whatever';
  const [res] = await patchPosition(
    { id: fakePosition.id, title: newTitle },
    newAgent
  );
  expect(res.status).toBe(403);
});
