import { deletePosition } from './endpoint';
import { ResultStatus } from '@src/type';
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
  fakeProject = await setupTestProject(agent);
  fakePosition = await setupTestPosition(agent, fakeProject.id, {
    public: true,
  });
  const fakeResume = await setupTestResume(agent);
  await setupTestApplication(
    agent,
    fakeProject.id,
    fakePosition.id,
    fakeResume.id
  );
});

test('can delete position', async () => {
  const [res, body] = await deletePosition({ id: fakePosition.id }, agent);
  expect(res.status).toBe(200);
  expect(body.status).toBe(ResultStatus.OK);
});

test("can't delete position that not exist", async () => {
  const [res] = await deletePosition({ id: -1 }, agent);
  expect(res.status).toBe(404);
});

test("can't delete position that user not own", async () => {
  const anotherPosition = await setupTestPosition(agent, fakeProject.id, {
    public: true,
  });
  const newAgent = getAgent();
  await setupTestUser(newAgent);
  const [res] = await deletePosition({ id: anotherPosition.id }, newAgent);
  expect(res.status).toBe(403);
});
