import { faker } from '@faker-js/faker';
import { postProject } from './endpoint';
import { ResultStatus } from '@src/type';
import { getAgent } from '@test/server';
import { setupTestUser } from '@test/utils';

const agent = getAgent();

beforeAll(async () => {
  await setupTestUser(agent);
});

test('can create project without logo and website', async () => {
  const [res, body] = await postProject(
    {
      name: faker.datatype.string(),
      summary: faker.datatype.string(),
      description: faker.datatype.string(),
      fields: [faker.datatype.string(), faker.datatype.string()],
      contactName: faker.name.findName(),
      contactEmail: faker.internet.email(),
      public: faker.datatype.boolean(),
    },
    agent
  );
  expect(res.status).toBe(200);
  expect(body.status).toBe(ResultStatus.OK);
});

test('can create project with website but no logo', async () => {
  const [res, body] = await postProject(
    {
      name: faker.datatype.string(),
      summary: faker.datatype.string(),
      description: faker.datatype.string(),
      fields: [faker.datatype.string(), faker.datatype.string()],
      contactName: faker.name.findName(),
      contactEmail: faker.internet.email(),
      public: faker.datatype.boolean(),
      website: faker.internet.url(),
    },
    agent
  );
  expect(res.status).toBe(200);
  expect(body.status).toBe(ResultStatus.OK);
});

test('reject fake fileId on avatar', async () => {
  const [res] = await postProject(
    {
      name: faker.datatype.string(),
      summary: faker.datatype.string(),
      description: faker.datatype.string(),
      fields: [faker.datatype.string(), faker.datatype.string()],
      contactName: faker.name.findName(),
      contactEmail: faker.internet.email(),
      public: faker.datatype.boolean(),
      avatar: faker.datatype.string(),
    },
    agent
  );
  expect(res.status).toBe(400);
});

test('reject user that not signed in', async () => {
  const [res] = await postProject({
    name: faker.datatype.string(),
    summary: faker.datatype.string(),
    description: faker.datatype.string(),
    fields: [faker.datatype.string(), faker.datatype.string()],
    contactName: faker.name.findName(),
    contactEmail: faker.internet.email(),
    public: faker.datatype.boolean(),
  });
  expect(res.status).toBe(401);
});
