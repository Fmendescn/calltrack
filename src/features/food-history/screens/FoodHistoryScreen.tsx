import React from 'react';
import { ScrollView } from 'react-native';
import { useFoodHistory } from '../hooks/useFoodHistory';
import { DayHistoryCard } from '../components/DayHistoryCard';
import { useMacroGoals } from '@/database';
import { styles } from './FoodHistoryScreen.styles';

export function FoodHistoryScreen() {
  const { history } = useFoodHistory();
  const { goals } = useMacroGoals();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {history.map((day) => (
        <DayHistoryCard key={day.dayStart.toISOString()} day={day} goals={goals} />
      ))}
    </ScrollView>
  );
}
