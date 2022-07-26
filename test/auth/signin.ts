import cookie from 'cookie';
import { signin } from './endpoint';
import { ResultStatus } from '@src/type';
import { FakeUser, setupTestUser } from '@test/utils';

let fakeUser: FakeUser;

beforeAll(async () => {
  fakeUser = await setupTestUser();
});

test('can sign in user', async () => {
  const [res, body] = await signin({
    id: fakeUser.id,
    password: fakeUser.password,
  });
  const cookies: Record<string, string>[] = res.header['set-cookie'].map(
    (i: string) => cookie.parse(i)
  );

  expect(res.status).toBe(200);

  expect(cookies.length).toBe(1);
  expect(cookies[0].sid).not.toBe(undefined);
  expect(body.status).toBe(ResultStatus.OK);
});

test('reject empty id', async () => {
  const [res, body] = await signin({
    password: fakeUser.password,
  });
  expect(res.status).toBe(400);
  expect(body.status).toBe(ResultStatus.ERRORS);
});

test('reject empty password', async () => {
  const [res, body] = await signin({
    id: fakeUser.id,
    password: '',
  });
  expect(res.status).toBe(400);
  expect(body.status).toBe(ResultStatus.ERRORS);
});

test('reject wrong password', async () => {
  const [res, body] = await signin({
    id: fakeUser.id,
    password: 'wrong-password',
  });
  expect(res.status).toBe(200);
  expect(body.status).toBe(ResultStatus.ERROR);
});
