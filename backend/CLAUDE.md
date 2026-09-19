# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in
`backend/`.

> **This is an independent project.** `backend/` is a NestJS + Prisma API living as a
> sibling folder inside the `caltrack` repo, with its own `package.json`, `node_modules`,
> and lockfile — it is not an npm workspace member of the root Expo app, and the root
> `CLAUDE.md`'s conventions (Expo/React Native, `--legacy-peer-deps`, `src/features/...`)
> do not apply here. See `README.md` for local setup.

## Commands

```bash
# Install dependencies (no --legacy-peer-deps needed here)
npm install

# Start local Postgres (Docker Compose)
docker compose up -d
docker compose down

# Apply pending Prisma migrations (creates/updates tables, regenerates the client)
npx prisma migrate dev --name <description>

# Run the app
npm run start:dev     # watch mode
npm run start          # no watch
npm run start:prod     # run the compiled dist/ build

# Tests
npm test               # unit (Jest)
npm run test:e2e       # e2e/integration — requires local Postgres running
npm run test:cov       # unit tests with coverage

# Lint / format / build
npm run lint           # ESLint with --fix (rewrites files)
npm run lint:check     # ESLint, read-only — what CI runs
npm run format
npm run build
```

> Node 22 is required and pinned via `.nvmrc` + `package.json#engines.node`. Run
> `nvm use` before any of the above if you have multiple Node versions installed.

## Architecture

**NestJS 11** · **Prisma 6** (PostgreSQL) · Jest (unit) + Jest/Supertest (e2e) ·
`@nestjs/config` for env loading and fail-fast validation.

### Module layout

```
src/
├── main.ts                    # Bootstrap: creates the Nest app, sets the global
│                               # `/api/v1` prefix, starts listening
├── app.module.ts               # Root module — wires ConfigModule, PrismaModule,
│                               # HealthModule, and every feature module together
│
├── config/
│   └── env.validation.ts       # Joi schema run by ConfigModule.forRoot({ validate })
│                               # — throws synchronously at boot if DATABASE_URL is
│                               # missing/malformed. Extend this schema, not ad-hoc
│                               # process.env reads, when a new required var shows up.
│
├── prisma/
│   ├── prisma.module.ts        # @Global() — import once in AppModule, PrismaService
│   │                           # is then injectable anywhere with no per-feature import
│   └── prisma.service.ts       # extends PrismaClient; connects in onModuleInit,
│                               # disconnects in onModuleDestroy
│
├── health/                     # Liveness endpoint — GET /api/v1/health → {status:'ok'}
│   ├── health.module.ts
│   ├── health.controller.ts
│   └── health.controller.spec.ts
│
└── {auth,users,food-entries,macro-goals}/
    └── *.module.ts              # Feature module boundaries reserved by the backend
                                 # bootstrap ticket — currently empty, filled in by
                                 # later phases. Keep one module per bounded concern;
                                 # don't merge them.
```

### Data flow

`PrismaService` (`src/prisma/prisma.service.ts`) is the **only** place any module talks
to Postgres — per the TDD's "nenhum módulo acessa o banco diretamente fora do Prisma."
Because `PrismaModule` is `@Global()`, any provider can `constructor(private prisma:
PrismaService)` without importing `PrismaModule` again — import it once in
`AppModule`, nowhere else.

Config is loaded once via `ConfigModule.forRoot({ isGlobal: true, validate })` in
`app.module.ts`, so `ConfigService` is also injectable anywhere without a per-module
import. Prefer `ConfigService.get(...)` over raw `process.env` reads in application
code — `process.env` is only read directly inside `config/env.validation.ts` itself
and `main.ts`'s `PORT` fallback.

### Routing / prefix

The global `/api/v1` prefix is set once in `main.ts` via `app.setGlobalPrefix('api/v1')`
— a static prefix, not Nest's URI-versioning system. Every controller's `@Controller(...)`
path is relative to that prefix (e.g. `@Controller('health')` → `GET /api/v1/health`).

## Prisma workflow

- **Schema**: `prisma/schema.prisma` — camelCase models/fields, mapped to the TDD's
  exact snake_case DB columns/tables via `@map`/`@@map`. Treat
  `docs/TDD-SCRUM-6-Backend-Implementacao.md` (repo root) as the source of truth for any
  new field or table — don't invent column names/types independently.
- **Changing the schema**: edit `schema.prisma`, then run
  `npx prisma migrate dev --name <short-description>`. This generates a new file under
  `prisma/migrations/`, applies it to your local DB, and regenerates `@prisma/client`.
  Commit the generated migration folder — never hand-edit a migration that's already
  been applied/committed; add a new migration instead.
- **Inspecting data**: `npx prisma studio` opens a local DB browser.
- **`PrismaService`**: extends `PrismaClient` directly (`src/prisma/prisma.service.ts`)
  — don't instantiate a second `PrismaClient` anywhere else in the app or in tests that
  exercise real Nest wiring; inject `PrismaService` instead so connection lifecycle
  stays centralized.

## Style / conventions

- One module per bounded concern under `src/<feature>/` (`*.module.ts`, plus
  `*.controller.ts`/`*.service.ts` as the feature grows) — mirrors the module
  boundaries already named in the TDD's architecture diagram
  (`auth`, `users`, `food-entries`, `macro-goals`).
- Co-locate unit tests as `*.spec.ts` next to the file under test (see
  `health/health.controller.spec.ts`, `config/env.validation.spec.ts`).
- Co-locate e2e/integration tests under `test/*.e2e-spec.ts`, run via
  `npm run test:e2e` — reserved for behavior that needs a real dependency (e.g. the
  real local Postgres for `PrismaService`), not a substitute for unit tests.
- Env vars: document every one in `.env.example` with an inline comment, and add
  required ones to `config/env.validation.ts`'s Joi schema so a missing/malformed value
  fails fast at boot instead of surfacing later as a runtime error.

## Adding a new feature

1. Fill in the relevant empty module under `src/{auth,users,food-entries,macro-goals}/`
   (or add a new one under `src/<name>/` if it doesn't map to an existing placeholder).
2. Inject `PrismaService` for any DB access — never talk to Postgres from anywhere else.
3. Add controllers/services inside the module; register them in that module's
   `@Module({...})`, and the module itself is already registered in `AppModule`.
4. Add `*.spec.ts` next to new files (unit) and, if the feature needs a real DB or
   other real dependency to be meaningfully tested, a `test/*.e2e-spec.ts`.
