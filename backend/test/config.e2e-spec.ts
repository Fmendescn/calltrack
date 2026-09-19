describe('AppModule config fail-fast (e2e)', () => {
  const originalDatabaseUrl = process.env.DATABASE_URL;

  afterEach(() => {
    if (originalDatabaseUrl === undefined) {
      delete process.env.DATABASE_URL;
    } else {
      process.env.DATABASE_URL = originalDatabaseUrl;
    }
    jest.resetModules();
  });

  // ConfigModule.forRoot({ validate }) runs while app.module.ts is evaluated,
  // and its failure surfaces as a rejection when Nest builds the module graph
  // (compile() here, NestFactory.create() in main.ts). A process.env value
  // takes precedence over one loaded from .env.
  it('building AppModule with a malformed DATABASE_URL rejects with a DATABASE_URL error', async () => {
    process.env.DATABASE_URL = 'not-a-valid-url';
    jest.resetModules();

    // Load both from the fresh registry so AppModule is evaluated under the
    // malformed DATABASE_URL set above.
    const { Test } =
      jest.requireActual<typeof import('@nestjs/testing')>('@nestjs/testing');
    const { AppModule } = jest.requireActual<
      typeof import('./../src/app.module')
    >('./../src/app.module');

    await expect(
      Test.createTestingModule({ imports: [AppModule] }).compile(),
    ).rejects.toThrow(/DATABASE_URL/);
  });
});
