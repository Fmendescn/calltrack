import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MacroGoalsScreen } from '@/features/macro-goals';
import { Colors } from '@/shared/constants/theme';

export default function GoalsRoute() {
  return (
    <View style={styles.container}>
      <MacroGoalsScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
