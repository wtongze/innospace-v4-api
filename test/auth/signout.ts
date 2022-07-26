import { signin, signout } from './endpoint';
import { ResultStatus } from '@src/type';
import { getAgent } from '@test/server';
import { FakeUser, setupTestUser } from '@test/utils';

let fakeUser: FakeUser;

beforeAll(async () => {
  fakeUser = await setupTestUser();
});

test('can sign out user', async () => {
  const agent = getAgent();
  const [signInRes, signInbody] = await signin(
    {
      id: fakeUser.id,
      password: fakeUser.password,
    },
    agent
  );
  expect(signInRes.status).toBe(200);
  expect(signInbody.status).toBe(ResultStatus.OK);

  const [signOutRes, signOutbody] = await signout(agent);
  expect(signOutRes.status).toBe(200);
  expect(signOutbody.status).toBe(ResultStatus.OK);
});

test('prevent users that are not signed in to access the signout page', async () => {
  const [signOutRes] = await signout();
  expect(signOutRes.status).toBe(401);
});
