import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { FoodEntryItem } from '@/shared/components/FoodEntryItem';
import { MacroKey, MACRO_LABELS, MACRO_UNITS } from '@/shared/constants/macros';
import { DailyHistoryEntry, MacroGoals } from '@/database';
import { styles } from './DayHistoryCard.styles';

const MACRO_ORDER: MacroKey[] = ['protein', 'carbs', 'fat', 'fiber'];

interface DayHistoryCardProps {
  day: DailyHistoryEntry;
  goals: MacroGoals;
}

export function DayHistoryCard({ day, goals }: DayHistoryCardProps) {
  const [expanded, setExpanded] = useState(false);

  const dateLabel = day.dayStart.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const percentage = goals.calories > 0 ? Math.round((day.totals.calories / goals.calories) * 100) : 0;
  const exceeded = day.totals.calories > goals.calories;
  const caloriesRemaining = Math.max(goals.calories - day.totals.calories, 0);
  const isEmpty = day.entries.length === 0;

  return (
    <View style={styles.card}>
      <Pressable
        onPress={() => setExpanded((prev) => !prev)}
        style={styles.header}
        testID="day-history-header"
      >
        <Text style={styles.date}>{dateLabel}</Text>

        <View style={styles.caloriesRow}>
          <Text style={styles.caloriesValue}>{day.totals.calories.toFixed(0)} kcal</Text>
          <Text
            testID="calorie-percentage"
            style={[styles.percentage, exceeded ? styles.percentageExceeded : null]}
          >
            {percentage}%
          </Text>
        </View>

        <Text style={[styles.statusLine, exceeded ? styles.statusLineExceeded : null]}>
          {exceeded
            ? `+${(day.totals.calories - goals.calories).toFixed(0)} kcal acima da meta`
            : `${caloriesRemaining.toFixed(0)} kcal restantes`}
        </Text>

        <View style={styles.macroRow}>
          {MACRO_ORDER.map((macro) => (
            <Text key={macro} style={styles.macroChip}>
              {MACRO_LABELS[macro]}: {day.totals[macro].toFixed(1)}{MACRO_UNITS[macro]}
            </Text>
          ))}
        </View>
      </Pressable>

      {isEmpty ? (
        <Text style={styles.emptyText}>Nenhum alimento registrado</Text>
      ) : expanded ? (
        <View style={styles.entriesList}>
          {day.entries.map((entry) => (
            <FoodEntryItem key={entry.id} entry={entry} />
          ))}
        </View>
      ) : null}
    </View>
  );
}
