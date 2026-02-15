import { Stack } from 'expo-router';
import * as React from 'react';

export default function OrdersLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#0077FF' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="new"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
