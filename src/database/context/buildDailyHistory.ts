import { FoodEntry } from '../schemas/FoodEntry';

export interface DailyTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface DailyHistoryEntry {
  dayStart: Date;
  totals: DailyTotals;
  entries: FoodEntry[];
}

const ZERO_TOTALS: DailyTotals = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };

export function buildDailyHistory(entries: FoodEntry[], now: Date): DailyHistoryEntry[] {
  const buckets: DailyHistoryEntry[] = [];

  for (let offset = 0; offset < 7; offset += 1) {
    const dayStart = new Date(now);
    dayStart.setDate(dayStart.getDate() - offset);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);

    const dayEntries = entries
      .filter((entry) => {
        const createdAt = new Date(entry.createdAt);
        return createdAt >= dayStart && createdAt <= dayEnd;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const totals = dayEntries.reduce<DailyTotals>(
      (acc, entry) => ({
        calories: acc.calories + entry.calories,
        protein: acc.protein + entry.protein,
        carbs: acc.carbs + entry.carbs,
        fat: acc.fat + entry.fat,
        fiber: acc.fiber + entry.fiber,
      }),
      ZERO_TOTALS,
    );

    buckets.push({ dayStart, totals, entries: dayEntries });
  }

  return buckets;
}
