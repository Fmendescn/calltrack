import React, { createContext, useCallback, useContext, useEffect, useReducer, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { FoodEntry, NewFoodEntry } from '../schemas/FoodEntry';
import { buildDailyHistory, DailyHistoryEntry, DailyTotals } from './buildDailyHistory';

export type { DailyTotals, DailyHistoryEntry };

interface FoodEntriesContextData {
  todayEntries: FoodEntry[];
  totals: DailyTotals;
  addEntry: (data: NewFoodEntry) => Promise<void>;
  deleteEntry: (id: number) => Promise<void>;
  getWeekHistory: () => Promise<DailyHistoryEntry[]>;
}

const FoodEntriesContext = createContext<FoodEntriesContextData>({} as FoodEntriesContextData);

const ZERO_TOTALS: DailyTotals = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };

export function FoodEntriesProvider({ children }: { children: React.ReactNode }) {
  const db = useSQLiteContext();
  const [todayEntries, setTodayEntries] = useState<FoodEntry[]>([]);

  const loadTodayEntries = useCallback(async () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const rows = await db.getAllAsync<FoodEntry>(
      'SELECT * FROM food_entries WHERE createdAt >= ? AND createdAt <= ? ORDER BY createdAt DESC',
      [start.toISOString(), end.toISOString()],
    );
    setTodayEntries(rows);
  }, [db]);

  useEffect(() => {
    loadTodayEntries();
  }, [loadTodayEntries]);

  async function addEntry(data: NewFoodEntry) {
    await db.runAsync(
      'INSERT INTO food_entries (name, calories, protein, carbs, fat, fiber, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [data.name, data.calories, data.protein, data.carbs, data.fat, data.fiber, new Date().toISOString()],
    );
    await loadTodayEntries();
  }

  async function deleteEntry(id: number) {
    await db.runAsync('DELETE FROM food_entries WHERE id = ?', [id]);
    await loadTodayEntries();
  }

  async function getWeekHistory(): Promise<DailyHistoryEntry[]> {
    const now = new Date();

    const start = new Date(now);
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);

    const rows = await db.getAllAsync<FoodEntry>(
      'SELECT * FROM food_entries WHERE createdAt >= ? AND createdAt <= ? ORDER BY createdAt DESC',
      [start.toISOString(), end.toISOString()],
    );

    return buildDailyHistory(rows, now);
  }

  const totals = todayEntries.reduce<DailyTotals>(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fat: acc.fat + entry.fat,
      fiber: acc.fiber + entry.fiber,
    }),
    ZERO_TOTALS,
  );

  return (
    <FoodEntriesContext.Provider value={{ todayEntries, totals, addEntry, deleteEntry, getWeekHistory }}>
      {children}
    </FoodEntriesContext.Provider>
  );
}

export function useFoodEntries() {
  return useContext(FoodEntriesContext);
}
