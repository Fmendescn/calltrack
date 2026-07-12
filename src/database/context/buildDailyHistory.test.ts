import { buildDailyHistory } from './buildDailyHistory';
import { FoodEntry } from '../schemas/FoodEntry';

const NOW = new Date(2026, 0, 15, 12, 0, 0, 0); // Jan 15 2026, local noon

function entry(id: number, createdAt: Date, overrides: Partial<Omit<FoodEntry, 'id' | 'createdAt'>> = {}): FoodEntry {
  return {
    id,
    name: 'Test Food',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    createdAt: createdAt.toISOString(),
    ...overrides,
  };
}

describe('buildDailyHistory', () => {
  it('returns exactly 7 buckets ordered most-recent-first (today at index 0)', () => {
    const result = buildDailyHistory([], NOW);

    expect(result).toHaveLength(7);

    const expectedDates = [15, 14, 13, 12, 11, 10, 9];
    result.forEach((bucket, i) => {
      expect(bucket.dayStart.getFullYear()).toBe(2026);
      expect(bucket.dayStart.getMonth()).toBe(0);
      expect(bucket.dayStart.getDate()).toBe(expectedDates[i]);
      expect(bucket.dayStart.getHours()).toBe(0);
      expect(bucket.dayStart.getMinutes()).toBe(0);
      expect(bucket.dayStart.getSeconds()).toBe(0);
      expect(bucket.dayStart.getMilliseconds()).toBe(0);
    });
  });

  it("sums each bucket's totals only from entries within that day's boundaries", () => {
    const entries: FoodEntry[] = [
      entry(1, new Date(2026, 0, 15, 8, 0, 0, 0), { calories: 300, protein: 10, carbs: 20, fat: 5, fiber: 2 }),
      entry(2, new Date(2026, 0, 15, 19, 30, 0, 0), { calories: 500, protein: 20, carbs: 40, fat: 15, fiber: 3 }),
      entry(3, new Date(2026, 0, 14, 9, 0, 0, 0), { calories: 100, protein: 1, carbs: 2, fat: 3, fiber: 4 }),
    ];

    const result = buildDailyHistory(entries, NOW);

    const today = result[0];
    expect(today.totals).toEqual({ calories: 800, protein: 30, carbs: 60, fat: 20, fiber: 5 });
    expect(today.entries).toHaveLength(2);

    const yesterday = result[1];
    expect(yesterday.totals).toEqual({ calories: 100, protein: 1, carbs: 2, fat: 3, fiber: 4 });
    expect(yesterday.entries).toHaveLength(1);
  });

  it('attributes an entry at exactly 23:59:59.999 to that day, not the next (inclusive upper bound)', () => {
    const boundaryEntry = entry(4, new Date(2026, 0, 10, 23, 59, 59, 999), { calories: 111 });

    const result = buildDailyHistory([boundaryEntry], NOW);

    const jan10 = result.find((b) => b.dayStart.getDate() === 10);
    const jan11 = result.find((b) => b.dayStart.getDate() === 11);

    expect(jan10?.totals.calories).toBe(111);
    expect(jan10?.entries).toHaveLength(1);
    expect(jan11?.totals.calories).toBe(0);
    expect(jan11?.entries).toHaveLength(0);
  });

  it('returns all-zero totals and an empty entries array for a day with no matching entries', () => {
    const result = buildDailyHistory([], NOW);

    result.forEach((bucket) => {
      expect(bucket.totals).toEqual({ calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
      expect(bucket.entries).toEqual([]);
    });
  });

  it('excludes entries whose createdAt falls outside the 7-day window', () => {
    // Window covers Jan 9 00:00:00.000 - Jan 15 23:59:59.999; Jan 8 23:59:59.999 is one instant before it.
    const outsideEntry = entry(5, new Date(2026, 0, 8, 23, 59, 59, 999), { calories: 999 });

    const result = buildDailyHistory([outsideEntry], NOW);

    const totalCalories = result.reduce((sum, bucket) => sum + bucket.totals.calories, 0);
    expect(totalCalories).toBe(0);
    result.forEach((bucket) => {
      expect(bucket.entries).not.toContainEqual(outsideEntry);
    });
  });
});
