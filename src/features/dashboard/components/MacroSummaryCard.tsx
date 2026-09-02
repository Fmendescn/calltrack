import React from 'react';
import { View, Text } from 'react-native';
import { MacroProgressBar } from './MacroProgressBar';
import { MacroKey, MACRO_LABELS, MACRO_UNITS, MACRO_COLORS } from '@/shared/constants/macros';
import { useMacroGoals } from '@/database';
import { styles } from './MacroSummaryCard.styles';

interface MacroSummaryCardProps {
  macro: MacroKey;
  value: number;
}

export function MacroSummaryCard({ macro, value }: MacroSummaryCardProps) {
  const { goals } = useMacroGoals();
  const goal = goals[macro];
  const label = MACRO_LABELS[macro];
  const unit = MACRO_UNITS[macro];
  const color = MACRO_COLORS[macro];
  const percentage = Math.min(Math.round((value / goal) * 100), 100);
  const remaining = Math.max(goal - value, 0);
  const exceeded = value > goal;

  const displayValue = value % 1 === 0 ? value.toFixed(0) : value.toFixed(1);
  const displayRemaining = remaining % 1 === 0 ? remaining.toFixed(0) : remaining.toFixed(1);

  return (
    <View style={styles.card}>
      <View style={[styles.topBar, { backgroundColor: color }]} />

      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <View style={[styles.badge, { backgroundColor: `${color}1A` }]}>
          <Text style={[styles.badgeText, { color }]}>{percentage}%</Text>
        </View>
      </View>

      <View style={styles.valuesRow}>
        <Text style={styles.consumed}>{displayValue}</Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>

      <MacroProgressBar value={value} goal={goal} color={color} />

      <Text style={styles.remaining}>
        {exceeded ? (
          <Text style={[styles.remainingValue, { color: '#FF5252' }]}>
            +{(value - goal).toFixed(1)}{unit}
          </Text>
        ) : (
          <Text style={styles.remainingValue}>{displayRemaining}{unit} restantes</Text>
        )}
      </Text>
    </View>
  );
}
