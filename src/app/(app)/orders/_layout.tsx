import { Stack } from 'expo-router';
import * as React from 'react';

export default function OrdersLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#0077FF' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: 'Pedidos' }}
      />
      <Stack.Screen
        name="new"
        options={{ title: 'Nuevo Pedido' }}
      />
    </Stack>
  );
}
