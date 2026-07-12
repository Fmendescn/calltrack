import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FoodEntry } from '@/database';
import { styles } from './FoodEntryItem.styles';

interface FoodEntryItemProps {
  entry: FoodEntry;
  onDelete?: (id: number) => void;
}

export function FoodEntryItem({ entry, onDelete }: FoodEntryItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.accent} />

      <View style={styles.info}>
        <Text style={styles.name}>{entry.name}</Text>
        <View style={styles.chips}>
          <View style={[styles.chip, styles.calorieChip]}>
            <Text style={[styles.chipText, styles.calorieChipText]}>
              {entry.calories.toFixed(0)} kcal
            </Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipText}>P {entry.protein.toFixed(1)}g</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipText}>C {entry.carbs.toFixed(1)}g</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipText}>G {entry.fat.toFixed(1)}g</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipText}>F {entry.fiber.toFixed(1)}g</Text>
          </View>
        </View>
      </View>

      {onDelete ? (
        <TouchableOpacity
          onPress={() => onDelete(entry.id)}
          style={styles.deleteButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.deleteIcon}>✕</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
