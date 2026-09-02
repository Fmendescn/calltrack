import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { DAILY_GOALS } from '@/shared/constants/macros';

export interface MacroGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

interface MacroGoalsContextData {
  goals: MacroGoals;
  updateGoals: (goals: MacroGoals) => Promise<void>;
}

const MacroGoalsContext = createContext<MacroGoalsContextData>({} as MacroGoalsContextData);

export function MacroGoalsProvider({ children }: { children: React.ReactNode }) {
  const db = useSQLiteContext();
  const [goals, setGoals] = useState<MacroGoals>(DAILY_GOALS);

  const loadGoals = useCallback(async () => {
    const row = await db.getFirstAsync<MacroGoals>(
      'SELECT calories, protein, carbs, fat, fiber FROM macro_goals WHERE id = 1',
    );
    if (row) setGoals(row);
  }, [db]);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  async function updateGoals(newGoals: MacroGoals) {
    await db.runAsync(
      'UPDATE macro_goals SET calories = ?, protein = ?, carbs = ?, fat = ?, fiber = ? WHERE id = 1',
      [newGoals.calories, newGoals.protein, newGoals.carbs, newGoals.fat, newGoals.fiber],
    );
    setGoals(newGoals);
  }

  return (
    <MacroGoalsContext.Provider value={{ goals, updateGoals }}>
      {children}
    </MacroGoalsContext.Provider>
  );
}

export function useMacroGoals() {
  return useContext(MacroGoalsContext);
}
