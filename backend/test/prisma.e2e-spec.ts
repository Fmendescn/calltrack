import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../src/prisma/prisma.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('PrismaService (e2e)', () => {
  let prismaService: PrismaService;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [PrismaModule],
    }).compile();

    // Resolve the instance before init() so a spy can observe onModuleInit's
    // own $connect() call below, rather than assuming it happened.
    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    // Safety net in case the test below didn't reach its own close() call
    // (e.g. an earlier failure). $disconnect() is idempotent, so a second
    // close is harmless.
    await moduleRef.close().catch(() => undefined);
  });

  it('connects via onModuleInit and disconnects via onModuleDestroy, both against the real local DB', async () => {
    // A wrong implementation that never calls $connect() would still let a
    // later query succeed, because Prisma's engine lazily reconnects on
    // first use — so proving "connects on module init" requires observing
    // that onModuleInit itself invokes $connect(), not just that some later
    // query happens to work.
    const connectSpy = jest.spyOn(prismaService, '$connect');

    // Triggers Nest's lifecycle hooks — PrismaService#onModuleInit runs here.
    await moduleRef.init();

    expect(connectSpy).toHaveBeenCalledTimes(1);
    await expect(connectSpy.mock.results[0].value).resolves.toBeUndefined();

    // Prove the connection onModuleInit opened is actually live against the
    // real Postgres database started via `docker compose up -d`.
    const result = await prismaService.$queryRaw<
      Array<{ result: number }>
    >`SELECT 1 as result`;
    expect(result[0].result).toBe(1);

    // Symmetrically, tearing down the Nest module must invoke the service's
    // own $disconnect() against that live connection, and it must complete
    // cleanly.
    const disconnectSpy = jest.spyOn(prismaService, '$disconnect');

    await expect(moduleRef.close()).resolves.toBeUndefined();

    expect(disconnectSpy).toHaveBeenCalledTimes(1);
    await expect(disconnectSpy.mock.results[0].value).resolves.toBeUndefined();
  });
});
