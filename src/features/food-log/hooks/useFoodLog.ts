import { useFoodEntries } from '@/database';

export function useFoodLog() {
  const { addEntry, deleteEntry } = useFoodEntries();
  return { addEntry, deleteEntry };
}
