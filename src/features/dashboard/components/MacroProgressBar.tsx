import React from 'react';
import { View } from 'react-native';
import { styles } from './MacroProgressBar.styles';

interface MacroProgressBarProps {
  value: number;
  goal: number;
  color: string;
}

export function MacroProgressBar({ value, goal, color }: MacroProgressBarProps) {
  const progress = Math.min(value / goal, 1);

  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${progress * 100}%`, backgroundColor: color }]} />
    </View>
  );
}
