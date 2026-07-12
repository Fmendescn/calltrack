import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useFoodEntries, DailyHistoryEntry } from '@/database';

export function useFoodHistory() {
  const { getWeekHistory } = useFoodEntries();
  const [history, setHistory] = useState<DailyHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    const data = await getWeekHistory();
    setHistory(data);
    setLoading(false);
  }, [getWeekHistory]);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory]),
  );

  return { history, loading };
}
