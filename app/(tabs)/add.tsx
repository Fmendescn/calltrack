import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AddFoodScreen } from '@/features/food-log';
import { Colors } from '@/shared/constants/theme';

export default function AddFoodRoute() {
  return (
    <View style={styles.container}>
      <AddFoodScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
