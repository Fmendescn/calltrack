# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start dev server (requires Expo Go SDK 57 on device)
npm start

# Build and run on device/emulator (requires Android Studio or Xcode)
npm run android
npm run ios

# Install new packages — always use --legacy-peer-deps due to peer dep conflicts in this project
npm install <package> --legacy-peer-deps

# Fix package versions to match Expo SDK 57
./node_modules/.bin/expo install --fix
```

> There are no linters or tests configured in this project.

## Architecture

**Expo SDK 57** · React Native 0.86 · React 19.2 · expo-router v6 (file-based routing) · expo-sqlite v16 (local persistence, works in Expo Go)

### Path alias

`@/` resolves to `src/` — configured in both `babel.config.js` (via `babel-plugin-module-resolver`) and `tsconfig.json`.

### Feature-based modular structure

Code lives in `src/features/<feature-name>/` with each feature being self-contained:

```
src/
├── database/                   # SQLite layer — the only place that touches the DB
│   ├── schemas/FoodEntry.ts    # TypeScript interface (id, name, calories, protein, carbs, fat, fiber, createdAt)
│   ├── DatabaseProvider.tsx    # SQLiteProvider wrapper; runs CREATE TABLE migrations on init
│   ├── context/
│   │   ├── FoodEntriesContext.tsx   # State for today's food entries; provides addEntry/deleteEntry
│   │   └── MacroGoalsContext.tsx    # State for user macro goals (single row in macro_goals table)
│   └── index.ts                # Public API: DatabaseProvider, useFoodEntries, useMacroGoals, types
│
├── features/
│   ├── dashboard/              # Today's summary view
│   │   ├── hooks/useDailyMacros.ts  # Thin wrapper over useFoodEntries
│   │   ├── components/MacroSummaryCard{.tsx,.styles.ts}
│   │   ├── components/MacroProgressBar{.tsx,.styles.ts}
│   │   └── screens/DashboardScreen{.tsx,.styles.ts}
│   │
│   ├── food-log/               # Register food entries
│   │   ├── hooks/useFoodLog.ts        # Thin wrapper over useFoodEntries
│   │   ├── components/FoodEntryItem{.tsx,.styles.ts}
│   │   └── screens/AddFoodScreen{.tsx,.styles.ts}
│   │
│   └── macro-goals/            # Edit daily macro targets
│       ├── hooks/useMacroGoalsForm.ts  # Thin wrapper over useMacroGoals
│       └── screens/MacroGoalsScreen{.tsx,.styles.ts}
│
└── shared/
    ├── components/Button{.tsx,.styles.ts}
    └── constants/
        ├── theme.ts    # Design tokens: Colors, Spacing, Radius, Shadow, Typography
        └── macros.ts   # MacroKey type, MACRO_LABELS, MACRO_UNITS, MACRO_COLORS, DAILY_GOALS
```

### Routing (`app/`)

`app/` contains only routing — no business logic or styles:

```
app/
├── _layout.tsx          # Root: wraps everything in <DatabaseProvider>
└── (tabs)/
    ├── _layout.tsx      # Tab bar config (Dashboard / Registrar / Metas)
    ├── index.tsx        # → DashboardScreen
    ├── add.tsx          # → AddFoodScreen
    └── goals.tsx        # → MacroGoalsScreen
```

### Data flow

`DatabaseProvider` (root) → `MacroGoalsProvider` → `FoodEntriesProvider` → app tree.

Both contexts expose reactive state backed by SQLite. After any write (`addEntry`, `deleteEntry`, `updateGoals`), the context re-fetches from SQLite and updates state — components re-render automatically.

Features **do not import from each other** — cross-feature data comes only from `@/database`.

### Style convention

Each component/screen has a sibling `*.styles.ts` file that exports a single `styles` const (`StyleSheet.create({...})`). All style values come from `@/shared/constants/theme.ts` tokens.

### Adding a new feature

1. Create `src/features/<name>/` with `screens/`, `hooks/`, `components/`, `index.ts`
2. If DB access is needed, add methods to the appropriate context in `src/database/context/` (or create a new context and add it to `DatabaseProvider`)
3. Add a route file under `app/` that imports the screen from the feature barrel
