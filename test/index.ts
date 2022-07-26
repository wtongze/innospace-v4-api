import { server } from './server';

test("return 'hello world'", async () => {
  const res = await server.get('/');
  expect(res.text).toBe('Hello World');
});
