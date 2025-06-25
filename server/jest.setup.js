beforeAll(() => {
  jest.setTimeout?.(10000); // optional chaining in case it's not available
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

afterAll(async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));
});
