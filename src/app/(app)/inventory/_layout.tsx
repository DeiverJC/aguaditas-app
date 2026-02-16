import { Stack } from 'expo-router';

export default function InventoryLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#0077FF' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ title: 'Inventario', headerShadowVisible: false }} />
      <Stack.Screen name="product/new" options={{ title: 'Nuevo Producto' }} />
      <Stack.Screen name="product/[id]" options={{ title: 'Detalle de Producto' }} />
      <Stack.Screen name="adjustment/new" options={{ title: 'Nuevo Ajuste' }} />
      <Stack.Screen name="adjustment/[id]" options={{ title: 'Detalle de Ajuste' }} />
      <Stack.Screen name="adjustment/edit/[id]" options={{ title: 'Editar Ajuste' }} />
    </Stack>
  );
}
