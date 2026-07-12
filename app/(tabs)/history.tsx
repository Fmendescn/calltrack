import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FoodHistoryScreen } from '@/features/food-history';
import { Colors } from '@/shared/constants/theme';

export default function HistoryRoute() {
  return (
    <View style={styles.container}>
      <FoodHistoryScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
