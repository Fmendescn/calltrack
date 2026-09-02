import React from 'react';
import { Stack } from 'expo-router';
import { DatabaseProvider } from '@/database';

export default function RootLayout() {
  return (
    <DatabaseProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </DatabaseProvider>
  );
}
