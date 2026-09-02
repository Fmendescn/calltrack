import React from 'react';
import { SQLiteProvider, type SQLiteDatabase } from 'expo-sqlite';
import { FoodEntriesProvider } from './context/FoodEntriesContext';
import { MacroGoalsProvider } from './context/MacroGoalsContext';

async function initDatabase(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS food_entries (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      name      TEXT    NOT NULL,
      calories  REAL    NOT NULL DEFAULT 0,
      protein   REAL    NOT NULL DEFAULT 0,
      carbs     REAL    NOT NULL DEFAULT 0,
      fat       REAL    NOT NULL DEFAULT 0,
      fiber     REAL    NOT NULL DEFAULT 0,
      createdAt TEXT    NOT NULL
    );

    CREATE TABLE IF NOT EXISTS macro_goals (
      id        INTEGER PRIMARY KEY DEFAULT 1,
      calories  REAL    NOT NULL DEFAULT 2000,
      protein   REAL    NOT NULL DEFAULT 150,
      carbs     REAL    NOT NULL DEFAULT 250,
      fat       REAL    NOT NULL DEFAULT 65,
      fiber     REAL    NOT NULL DEFAULT 25
    );

    INSERT OR IGNORE INTO macro_goals (id) VALUES (1);
  `);
}

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  return (
    <SQLiteProvider databaseName="caltrack.db" onInit={initDatabase}>
      <MacroGoalsProvider>
        <FoodEntriesProvider>{children}</FoodEntriesProvider>
      </MacroGoalsProvider>
    </SQLiteProvider>
  );
}
