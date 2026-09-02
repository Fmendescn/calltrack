import { useFoodEntries } from '@/database';

export function useDailyMacros() {
  const { todayEntries, totals } = useFoodEntries();
  return { todayEntries, totals };
}
