import { faker } from '@faker-js/faker';
import { signup } from './endpoint';
import { ResultStatus } from '@src/type';

test('can sign up user', async () => {
  const [res, body] = await signup({
    id: faker.datatype.string(),
    name: faker.name.findName(),
    password: '!Inno8space',
    email: faker.internet.email(),
  });
  expect(res.status).toBe(200);
  expect(body.status).toBe(ResultStatus.OK);
});

test('reject weak password', async () => {
  const [res, body] = await signup({
    id: faker.datatype.string(),
    name: faker.name.findName(),
    password: 'weakpassword',
    email: faker.internet.email(),
  });
  expect(res.status).toBe(400);
  expect(body.status).toBe(ResultStatus.ERRORS);
});

test('reject short name', async () => {
  const [res, body] = await signup({
    id: faker.datatype.string(),
    name: faker.datatype.string(faker.datatype.number({ min: 1, max: 4 })),
    password: '!Inno8space',
    email: faker.internet.email(),
  });
  expect(res.status).toBe(400);
  expect(body.status).toBe(ResultStatus.ERRORS);
});

test('reject false email', async () => {
  const [res, body] = await signup({
    id: faker.datatype.string(),
    name: faker.name.findName(),
    password: '!Inno8space',
    email: faker.datatype.string(),
  });
  expect(res.status).toBe(400);
  expect(body.status).toBe(ResultStatus.ERRORS);
});
