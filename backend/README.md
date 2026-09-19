# CalTrack Backend

NestJS + Prisma API for CalTrack. This is an **independent project** living inside the
`caltrack` repo as a sibling folder to the Expo app — it has its own `package.json`,
`node_modules`, and lockfile, and is not part of any npm workspace. Nothing here is
installed or run by the root `caltrack` project, and vice versa.

## Prerequisites

- **Node.js 22** — pinned via `.nvmrc` and `package.json#engines.node` (`>=22 <23`). If you
  use `nvm`:

  ```bash
  nvm install
  nvm use
  ```

- **npm** (not pnpm/yarn) — this project's package manager.
- **Docker Desktop** — for the local Postgres database (`docker compose`).

## Clone

If you haven't already, clone the `caltrack` repo and `cd` into `backend/`:

```bash
git clone <repo-url>
cd caltrack/backend
```

## Install dependencies

```bash
npm install
```

> Unlike the root Expo app, this project does **not** need `--legacy-peer-deps` — that
> constraint is specific to the Expo/React Native app's peer-dependency conflicts and
> doesn't apply to this independent `package.json`.

## Configure environment

Copy the example env file and fill in local values:

```bash
cp .env.example .env
```

`.env.example` documents all 7 variables the backend will use (`DATABASE_URL`,
`JWT_SECRET`, `GOOGLE_CLIENT_ID`, `APPLE_CLIENT_ID`, `APPLE_TEAM_ID`, `APPLE_KEY_ID`,
`APPLE_PRIVATE_KEY`), each with an inline comment explaining its purpose. Today only
`DATABASE_URL` is read and validated at boot; the other six are placeholders until auth
is implemented in a later phase. For local development, at minimum set:

- `DATABASE_URL` — must match the Postgres container started below, e.g.
  `postgresql://caltrack:caltrack@localhost:5432/caltrack`
- `JWT_SECRET` — any local placeholder value is fine for now (no auth logic exists yet)

The remaining OAuth variables can stay empty for this bootstrap stage — they're only
validated for presence once auth is implemented in a later phase. `DATABASE_URL` is the
one variable the app fails fast on if it's missing or malformed: booting without it
throws a clear startup error instead of silently starting without a database.

## Start local Postgres

```bash
docker compose up -d
```

This starts a `postgres:16-alpine` container using the credentials in `.env`
(`POSTGRES_USER`/`POSTGRES_PASSWORD`/`POSTGRES_DB`, defaulting to `caltrack`/`caltrack`/
`caltrack`) with a named volume for persistence. The port defaults to `5432` and is
overridable via `POSTGRES_PORT` in `.env` without editing `docker-compose.yml`. If you
change it, also update the port in `DATABASE_URL` so the app and Prisma point at the
same one.

Stop it with:

```bash
docker compose down
```

## Run the database migration

With Postgres up and `DATABASE_URL` pointing at it, apply the Prisma schema:

```bash
npx prisma migrate dev --name init
```

This creates the 4 core tables (`users`, `refresh_tokens`, `food_entries`,
`macro_goals`) as defined in `prisma/schema.prisma` and generates the Prisma Client.
Re-running `migrate dev` later (e.g. after pulling schema changes) is safe — Prisma
only applies pending migrations.

## Run the app

```bash
npm run start:dev
```

The API listens on `http://localhost:3000` (or `PORT` if set) with the global prefix
`/api/v1`. Verify it's up:

```bash
curl http://localhost:3000/api/v1/health
# {"status":"ok"}
```

Other run modes:

```bash
npm run start        # no watch
npm run start:debug  # watch + debugger
npm run start:prod   # run the compiled build (see "Build" below)
```

## Tests

```bash
npm test              # unit tests (Jest)
npm run test:e2e      # e2e/integration tests — requires the local Postgres from
                       # `docker compose up -d` to be running
npm run test:cov      # unit tests with coverage
```

## Lint & format

```bash
npm run lint       # ESLint, auto-fixes what it can
npm run lint:check # ESLint, read-only — fails on any error (what CI runs)
npm run format   # Prettier, writes in place
```

## Build

```bash
npm run build   # compiles to dist/
```

## Project structure

See `CLAUDE.md` in this directory for module layout conventions, the Prisma workflow,
and how this project fits into the wider `caltrack` repo.
