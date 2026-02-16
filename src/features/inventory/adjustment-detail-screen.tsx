import { Stack, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {
  useFinalizeAdjustment,
  useInventoryAdjustments,
} from '@/features/inventory/api';
import { AdjustmentDetailActions } from '@/features/inventory/components/adjustment-detail-actions';
import { AdjustmentDetailHeader } from '@/features/inventory/components/adjustment-detail-header';
import { useProducts } from '@/features/products/api';
import { queryClient } from '@/lib/api';

// Simple hook to get a single adjustment since the API list endpoint is what we have documented
// In a real app we'd probably have useInventoryAdjustment(id)
function useAdjustment(id: number) {
  const { data: adjustments, isLoading, refetch } = useInventoryAdjustments();
  const adjustment = adjustments?.find(a => a.id === id);
  return { adjustment, isLoading, refetch };
}

export function AdjustmentDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = Number(params.id);
  const { adjustment, isLoading, refetch } = useAdjustment(id);
  const { data: products } = useProducts();
  const finalizeAdj = useFinalizeAdjustment();
  const [finalizing, setFinalizing] = useState(false);

  const isFinalized = adjustment?.status === 'finalized';

  const handleFinalize = async () => {
    Alert.alert(
      'Finalizar Ajuste',
      '¿Estás seguro de que deseas finalizar este ajuste? Esto actualizará el inventario y no se podrá deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Finalizar',
          style: 'destructive',
          onPress: async () => {
            setFinalizing(true);
            try {
              await finalizeAdj.mutateAsync({ id });
              await queryClient.invalidateQueries({ queryKey: ['inventory-adjustments'] });
              await queryClient.invalidateQueries({ queryKey: ['products'] });
              Alert.alert('Éxito', 'Ajuste finalizado correctamente');
              refetch();
            }
            catch (error) {
              console.error(error);
              Alert.alert('Error', 'No se pudo finalizar el ajuste');
            }
            finally {
              setFinalizing(false);
            }
          },
        },
      ],
    );
  };

  const getProductName = (productId: number) => {
    return products?.find(p => p.id === productId)?.name || `Producto #${productId}`;
  };

  const getProductUnit = (productId: number) => {
    return products?.find(p => p.id === productId)?.unit_type || '';
  };

  if (isLoading || !adjustment) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0077FF" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <Stack.Screen options={{ headerTitle: `Ajuste #${id}`, headerBackTitle: 'Atrás' }} />
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      >
        <AdjustmentDetailHeader adjustment={adjustment} />

        {/* Items List */}
        <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 80 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 16 }}>Productos</Text>
          {(adjustment as any).relationships?.items?.map((item: any) => (
            <View
              key={item.id}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#F3F4F6',
              }}
            >
              <View>
                <Text style={{ fontWeight: '600' }}>{getProductName(item.product_id)}</Text>
                <Text style={{ color: '#6B7280', fontSize: 12 }}>{getProductUnit(item.product_id)}</Text>
              </View>
              <Text style={{ fontWeight: '700', fontSize: 16 }}>{item.quantity}</Text>
            </View>
          ))}
          {(!(adjustment as any).relationships?.items || (adjustment as any).relationships?.items?.length === 0) && (
            <Text style={{ color: '#9CA3AF', textAlign: 'center', paddingVertical: 10 }}>
              No hay items para mostrar
            </Text>
          )}
        </View>
      </ScrollView>

      <AdjustmentDetailActions
        id={id}
        isFinalized={isFinalized}
        finalizing={finalizing}
        onFinalize={handleFinalize}
      />
    </View>
  );
}
