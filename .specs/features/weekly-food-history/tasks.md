# Weekly Food History Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.** Do not search for skill files by filesystem path. The skill is the source of truth for the full flow (per-task cycle, sub-agent delegation, adequacy review, Verifier, discrimination sensor).

**If the skill cannot be activated, STOP and tell the user — do not proceed without it.**

---

**Design**: `.specs/features/weekly-food-history/design.md`
**Status**: Draft

---

## Test Coverage Matrix

> Generated from codebase + spec — confirm before Execute. Guidelines found: none (`CLAUDE.md` states "There are no linters or tests configured in this project"; no existing test files to sample). User decision: **unit tests only**, no SQLite integration tests (see AD-004 / conversation) — the day-bucketing logic is extracted into a pure function specifically so it doesn't need a real/mocked database to be tested.

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
| --- | --- | --- | --- | --- |
| Domain logic — day bucketing & totals (`buildDailyHistory` pure function) | unit | All branches; 1:1 to HIST-01/02/03 + edge cases (7-day window, most-recent-first order, boundary instant `23:59:59.999`, zero-goal guard, <7 days of real data) | `src/database/context/buildDailyHistory.test.ts` (co-located) | `npm test` |
| Components — `FoodEntryItem` (shared), `DayHistoryCard`, `FoodHistoryScreen` | unit (render, `@testing-library/react-native`) | All branches tied to ACs: optional-delete rendering (HIST-06), expand/collapse (HIST-04/05), empty-day state (HIST-03), goal-exceeded visual distinction (HIST-07/08), zero-goal guard (no crash) | `src/**/*.test.tsx` (co-located next to component) | `npm test` |
| Context wiring (`getWeekHistory` DB call), feature hook (`useFoodHistory`), routing/tab files | none | Build/typecheck gate only — no SQLite integration tests (user decision) | — | `npx tsc --noEmit` |

## Gate Check Commands

> Generated from codebase — confirm before Execute. No integration/e2e layer in this feature, so there is no "Full" gate.

| Gate Level | When to Use | Command |
| --- | --- | --- |
| Quick | After tasks with unit tests only | `npm test` |
| Build | After phase completion or config/routing-only tasks | `npx tsc --noEmit && npm test` |

---

## Execution Plan

Phases are ordered and run sequentially — each phase completes before the next begins, and tasks within a phase execute in order.

### Phase 1: Foundation

```
T1 → T2
```

### Phase 2: Data Layer

```
T3 → T4
```

### Phase 3: Feature UI

```
T5 → T6 → T7
```

### Phase 4: Routing

```
T8
```

---

## Task Breakdown

### T1: Set up jest-expo test runner

**What**: Install `jest-expo`, `jest`, `@testing-library/react-native` as dev dependencies; create `jest.config.js` with `preset: 'jest-expo'` and `passWithNoTests: true`; add `"test": "jest"` to `package.json` scripts.
**Where**: `package.json`, `jest.config.js` (new)
**Depends on**: None
**Reuses**: N/A — first test infra in the project (AD-004)
**Requirement**: infra (enables all HIST-* tasks below)

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [x] `jest-expo`, `jest`, `@testing-library/react-native` installed with `--legacy-peer-deps` (per CLAUDE.md convention)
- [x] `jest.config.js` present with `preset: 'jest-expo'`, `passWithNoTests: true`
- [x] `npm test` runs and exits 0 (no test files yet, `passWithNoTests` covers this)
- [x] `npx tsc --noEmit` still passes (no regressions from new devDependencies/types)

**Tests**: none (infra task; `passWithNoTests` is the intended state until T2 adds the first real test)
**Gate**: build

**Commit**: `chore(test): add jest-expo test runner`

---

### T2: Relocate FoodEntryItem to shared/components with optional onDelete

**What**: Move `src/features/food-log/components/FoodEntryItem.tsx` + `.styles.ts` to `src/shared/components/FoodEntryItem.tsx` + `.styles.ts`; make `onDelete` optional (`onDelete?: (id: number) => void`), rendering the delete `TouchableOpacity` only when it's provided. Update `src/features/dashboard/screens/DashboardScreen.tsx` and `src/features/food-log/index.ts` to import from the new location (remove the old re-export from `food-log/index.ts`).
**Where**: `src/shared/components/FoodEntryItem.tsx` (new), `src/shared/components/FoodEntryItem.styles.ts` (new), `src/features/food-log/components/FoodEntryItem.tsx` (deleted), `src/features/dashboard/screens/DashboardScreen.tsx` (import path), `src/features/food-log/index.ts` (remove re-export)
**Depends on**: T1
**Reuses**: Existing `FoodEntryItem` JSX/styles as-is (AD-003)
**Requirement**: HIST-06 (foundation for read-only reuse), AD-003

**Tools**:
- MCP: NONE
- Skill: `vercel-react-native-skills`

**Done when**:
- [x] `FoodEntryItem` renders its delete button when `onDelete` is passed, and omits it entirely when `onDelete` is undefined
- [x] `DashboardScreen` still deletes today's entries correctly via the relocated component (existing Dashboard behavior unchanged)
- [x] No remaining import of `FoodEntryItem` from `@/features/food-log` anywhere in the codebase
- [x] Gate check passes: `npm test`
- [x] Test count: 2 tests pass (renders delete button when `onDelete` provided; omits it when absent) — no silent deletions

**Tests**: unit
**Gate**: quick

**Commit**: `refactor(shared): relocate FoodEntryItem to shared/components with optional onDelete`

---

### T3: Implement and test `buildDailyHistory` pure function

**What**: Create `buildDailyHistory(entries: FoodEntry[], now: Date): DailyHistoryEntry[]` — a pure function that buckets `entries` into exactly 7 calendar-day groups (today + 6 previous days, local time, `now` injectable for testability), most-recent-first, computing per-day `DailyTotals`, with empty days present as zeroed buckets. Also define and export `DailyTotals` and `DailyHistoryEntry` types here.
**Where**: `src/database/context/buildDailyHistory.ts` (new)
**Depends on**: T1
**Reuses**: Same local-midnight boundary computation already used by `loadTodayEntries` in `FoodEntriesContext.tsx` (`setHours(0,0,0,0)` / `setHours(23,59,59,999)`), same `DailyTotals` reduce shape
**Requirement**: HIST-01, HIST-02, HIST-03 + edge cases (boundary instant, <7 days of history)

**Tools**:
- MCP: NONE
- Skill: `vercel-react-native-skills`

**Done when**:
- [x] Returns exactly 7 buckets ordered most-recent-first (today at index 0) for any `now`
- [x] Each bucket's totals correctly sum only entries whose `createdAt` falls within that bucket's local day boundaries
- [x] An entry with `createdAt` exactly at `23:59:59.999` is attributed to that day (inclusive upper bound), not the next day
- [x] A day with no matching entries returns a bucket with all-zero totals and an empty `entries` array
- [x] Gate check passes: `npm test`
- [x] Test count: 5 tests pass (7-bucket count + ordering; correct totals per bucket; boundary-instant attribution; empty-day zeroing; entries outside the 7-day window excluded) — no silent deletions

**Tests**: unit
**Gate**: quick

**Commit**: `feat(database): add buildDailyHistory pure day-bucketing function`

---

### T4: Wire `getWeekHistory` into FoodEntriesContext

**What**: Add `getWeekHistory(): Promise<DailyHistoryEntry[]>` to `FoodEntriesContext` — runs one ranged SQLite query (`dayStart(-6)` .. end of today) and passes the rows through `buildDailyHistory` (T3). Export `getWeekHistory`, `DailyTotals`, and `DailyHistoryEntry` from `src/database/index.ts`.
**Where**: `src/database/context/FoodEntriesContext.tsx` (modify), `src/database/index.ts` (modify)
**Depends on**: T3
**Reuses**: `buildDailyHistory` (T3), existing `db.getAllAsync` query pattern from `loadTodayEntries`

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [x] `getWeekHistory` is exposed on the context value and importable via `@/database`
- [x] It queries `food_entries` once (not 7 separate queries) and delegates grouping to `buildDailyHistory`
- [x] `DailyTotals` and `DailyHistoryEntry` types are exported from `@/database`
- [x] `npx tsc --noEmit` passes with no type errors
- [x] Gate check passes: `npx tsc --noEmit && npm test` (existing T3 tests still pass, no regression)

**Tests**: none (DB wiring layer — matrix marks this "none"; the logic it delegates to is already covered by T3's unit tests)
**Gate**: build

**Commit**: `feat(database): wire getWeekHistory context method`

---

### T5: Create `useFoodHistory` hook

**What**: Create `useFoodHistory(): { history: DailyHistoryEntry[], loading: boolean }` — thin wrapper that calls `getWeekHistory()` on mount and re-fetches via `useFocusEffect` (from `expo-router`) whenever the Histórico tab regains focus.
**Where**: `src/features/food-history/hooks/useFoodHistory.ts` (new)
**Depends on**: T4
**Reuses**: `getWeekHistory` (T4); thin-wrapper-hook pattern from `useDailyMacros`/`useFoodLog`

**Tools**:
- MCP: NONE
- Skill: `vercel-react-native-skills`

**Done when**:
- [x] Calls `getWeekHistory` on initial mount and populates `history`
- [x] Re-fetches when the screen regains focus (via `useFocusEffect` from `expo-router`, not `@react-navigation/native` directly)
- [x] `npx tsc --noEmit` passes with no type errors

**Tests**: none (thin wrapper with no branching logic of its own — matches the untested convention of `useDailyMacros`/`useFoodLog`; its behavior is exercised indirectly by T7's `FoodHistoryScreen` test via mocking)
**Gate**: build

**Commit**: `feat(food-history): add useFoodHistory hook`

---

### T6: Create `DayHistoryCard` component

**What**: Build `DayHistoryCard({ day: DailyHistoryEntry, goals: MacroGoals })` — renders the day's date header, aggregate totals (calories + macros), a goal-adherence indicator (calories vs. current `goals.calories`, guarded against divide-by-zero), an empty-day state when `day.entries` is empty, and an expand/collapse toggle that reveals `FoodEntryItem` rows (imported from `@/shared/components`, no `onDelete` passed) when expanded.
**Where**: `src/features/food-history/components/DayHistoryCard.tsx` (new), `src/features/food-history/components/DayHistoryCard.styles.ts` (new)
**Depends on**: T2 (shared `FoodEntryItem`), T3 (types)
**Reuses**: Exceeded/within-goal color pattern from `MacroSummaryCard`/`DashboardScreen`; `MACRO_LABELS`/`MACRO_UNITS`/`MACRO_COLORS` from `@/shared/constants/macros`; `FoodEntryItem` (T2) for the expanded list; `theme.ts` tokens for styles
**Requirement**: HIST-03, HIST-04, HIST-05, HIST-07, HIST-08 + zero-goal edge case

**Tools**:
- MCP: NONE
- Skill: `vercel-react-native-skills`

**Done when**:
- [x] Renders totals + goal-adherence indicator for a day with entries
- [x] Renders the "Nenhum alimento registrado" empty state for a day with zero entries
- [x] Tapping the card reveals the food entry list (no delete action visible); tapping again collapses it
- [x] A day whose calorie total exceeds the goal is visually distinguished from one that isn't
- [x] When `goals.calories` is 0, the percentage renders as 0% instead of crashing/`NaN`
- [x] Gate check passes: `npm test`
- [x] Test count: 5 tests pass (totals render; empty-day state; expand reveals items / collapse hides them; exceeded-goal visual distinction; zero-goal guard) — no silent deletions

**Tests**: unit
**Gate**: quick

**Commit**: `feat(food-history): add DayHistoryCard component`

---

### T7: Create `FoodHistoryScreen`

**What**: Build the screen that calls `useFoodHistory()` + `useMacroGoals()` and renders 7 `DayHistoryCard`s in the order returned by the hook (most-recent-first, per HIST-01).
**Where**: `src/features/food-history/screens/FoodHistoryScreen.tsx` (new), `src/features/food-history/screens/FoodHistoryScreen.styles.ts` (new)
**Depends on**: T5, T6
**Reuses**: `ScrollView` + `content` container pattern from `DashboardScreen.styles.ts`
**Requirement**: HIST-01

**Tools**:
- MCP: NONE
- Skill: `vercel-react-native-skills`

**Done when**:
- [ ] Renders exactly 7 `DayHistoryCard`s given a mocked 7-entry `history` array from `useFoodHistory`
- [ ] Cards render in the same order as the array returned by the hook (no re-sorting in the screen — ordering is `buildDailyHistory`'s responsibility, already tested in T3)
- [ ] Gate check passes: `npm test`
- [ ] Test count: 1 test passes (renders 7 cards in given order) — no silent deletions

**Tests**: unit
**Gate**: quick

**Commit**: `feat(food-history): add FoodHistoryScreen`

---

### T8: Wire barrel export, route, and tab entry

**What**: Create `src/features/food-history/index.ts` barrel (`export { FoodHistoryScreen } from './screens/FoodHistoryScreen';`); create `app/(tabs)/history.tsx` rendering `<FoodHistoryScreen />` (mirrors `add.tsx`); add a 4th `Tabs.Screen` ("Histórico") to `app/(tabs)/_layout.tsx` with a tab icon glyph consistent with the existing ◈ / + / ◎ style.
**Where**: `src/features/food-history/index.ts` (new), `app/(tabs)/history.tsx` (new), `app/(tabs)/_layout.tsx` (modify)
**Depends on**: T7
**Reuses**: `add.tsx` route-file shape; `_layout.tsx`'s existing `Tabs.Screen`/`TabIcon` pattern
**Requirement**: HIST-01 (navigation entry point)

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Histórico tab appears in the tab bar alongside Dashboard / Registrar / Metas
- [ ] Tapping it renders `FoodHistoryScreen` with 7 day cards
- [ ] `npx tsc --noEmit` passes with no type errors
- [ ] Gate check passes: `npx tsc --noEmit && npm test` (full suite, no regressions)

**Tests**: none (routing/config layer, matrix marks this "none")
**Gate**: build

**Commit**: `feat(food-history): wire Histórico tab route`

---

## Phase Execution Map

```
Phase 1 → Phase 2 → Phase 3 → Phase 4

Phase 1:  T1 ──→ T2
Phase 2:  T3 ──→ T4
Phase 3:  T5 ──→ T6 ──→ T7
Phase 4:  T8
```

Execution is strictly sequential — there is no intra-phase parallelism. 8 tasks total, at the single-batch threshold (≤ ~8) — no sub-agent offer needed; runs inline in the main window.

---

## Task Granularity Check

| Task | Scope | Status |
| --- | --- | --- |
| T1: Set up jest-expo test runner | 1 concern (test infra config) | ✅ Granular |
| T2: Relocate FoodEntryItem | 1 component (moved + 1 prop change + caller updates) | ✅ Granular |
| T3: Implement `buildDailyHistory` | 1 function + its types | ✅ Granular |
| T4: Wire `getWeekHistory` | 1 method on 1 context | ✅ Granular |
| T5: `useFoodHistory` hook | 1 hook | ✅ Granular |
| T6: `DayHistoryCard` | 1 component | ✅ Granular |
| T7: `FoodHistoryScreen` | 1 screen | ✅ Granular |
| T8: Barrel + route + tab | 3 small config/wiring files, single cohesive concern ("make the feature reachable") | ✅ Granular (2-3 related things, cohesive) |

---

## Diagram-Definition Cross-Check

| Task | Depends On (task body) | Diagram Shows | Status |
| --- | --- | --- | --- |
| T1 | None | No incoming arrow | ✅ Match |
| T2 | T1 | T1 → T2 | ✅ Match |
| T3 | T1 | T1 → T3 (Phase 2 starts after Phase 1) | ✅ Match |
| T4 | T3 | T3 → T4 | ✅ Match |
| T5 | T4 | T4 → T5 (Phase 3 starts after Phase 2) | ✅ Match |
| T6 | T2, T3 | T2 → T6, T3 → T6 (cross-phase deps from Phase 1/2 into Phase 3) | ✅ Match |
| T7 | T5, T6 | T5 → T7, T6 → T7 | ✅ Match |
| T8 | T7 | T7 → T8 (Phase 4 starts after Phase 3) | ✅ Match |

No task depends on a task in a later phase — all dependencies point backward or within the same phase.

---

## Test Co-location Validation

| Task | Code Layer Created/Modified | Matrix Requires | Task Says | Status |
| --- | --- | --- | --- | --- |
| T1: Test runner setup | infra/config | none | none | ✅ OK |
| T2: Relocate FoodEntryItem | Component (shared) | unit | unit | ✅ OK |
| T3: buildDailyHistory | Domain logic | unit | unit | ✅ OK |
| T4: getWeekHistory wiring | Context wiring (DB) | none | none | ✅ OK |
| T5: useFoodHistory | Feature hook | none | none | ✅ OK |
| T6: DayHistoryCard | Component | unit | unit | ✅ OK |
| T7: FoodHistoryScreen | Component (screen) | unit | unit | ✅ OK |
| T8: Barrel + route + tab | Routing/config | none | none | ✅ OK |

No violations — every "none" task maps to a matrix layer explicitly marked "none", and every "unit" task includes its tests in the same task (no deferred testing).
