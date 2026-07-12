import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useDailyMacros } from '../hooks/useDailyMacros';
import { MacroSummaryCard } from '../components/MacroSummaryCard';
import { FoodEntryItem } from '@/shared/components/FoodEntryItem';
import { useFoodLog } from '@/features/food-log';
import { useMacroGoals } from '@/database';
import { MacroKey } from '@/shared/constants/macros';
import { styles } from './DashboardScreen.styles';

const MACRO_ORDER: MacroKey[] = ['protein', 'carbs', 'fat', 'fiber'];

export function DashboardScreen() {
  const { todayEntries, totals } = useDailyMacros();
  const { deleteEntry } = useFoodLog();
  const { goals } = useMacroGoals();

  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const caloriePct = Math.min(totals.calories / goals.calories, 1);
  const caloriesRemaining = Math.max(goals.calories - totals.calories, 0);
  const caloriesExceeded = totals.calories > goals.calories;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Hero — Calorias */}
      <View style={styles.heroCard}>
        <View style={styles.heroAccent} />
        <View style={styles.heroInner}>
          <Text style={styles.heroDate}>{today}</Text>
          <View style={styles.heroRow}>
            <View style={styles.heroLeft}>
              <Text style={styles.heroLabel}>CALORIAS</Text>
              <Text style={styles.heroValue}>
                {totals.calories.toFixed(0)}
                <Text style={styles.heroUnit}> kcal</Text>
              </Text>
              <Text style={styles.heroSubline}>
                {caloriesExceeded
                  ? `+${(totals.calories - goals.calories).toFixed(0)} kcal acima da meta`
                  : `${caloriesRemaining.toFixed(0)} kcal restantes`}
              </Text>
            </View>
            <View style={styles.heroRight}>
              <Text style={styles.heroPct}>{Math.round(caloriePct * 100)}</Text>
              <Text style={styles.heroPctSign}>%</Text>
            </View>
          </View>
          <View style={styles.heroTrack}>
            <View style={[styles.heroFill, { width: `${caloriePct * 100}%` }]} />
          </View>
          <Text style={styles.heroGoalLine}>meta: {goals.calories} kcal</Text>
        </View>
      </View>

      {/* Macros */}
      <Text style={styles.sectionTitle}>Macronutrientes</Text>
      <View style={styles.macroGrid}>
        {MACRO_ORDER.map(macro => (
          <View key={macro} style={styles.macroGridItem}>
            <MacroSummaryCard macro={macro} value={totals[macro]} />
          </View>
        ))}
      </View>

      {/* Lista de alimentos */}
      <Text style={styles.sectionTitle}>
        Alimentos de hoje
        {todayEntries.length > 0 && (
          <Text style={styles.sectionCount}> · {todayEntries.length}</Text>
        )}
      </Text>

      {todayEntries.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>—</Text>
          <Text style={styles.emptyText}>Nenhum alimento registrado</Text>
          <Text style={styles.emptyHint}>Use a aba Registrar para adicionar</Text>
        </View>
      ) : (
        todayEntries.map(entry => (
          <FoodEntryItem key={entry.id} entry={entry} onDelete={deleteEntry} />
        ))
      )}
    </ScrollView>
  );
}
