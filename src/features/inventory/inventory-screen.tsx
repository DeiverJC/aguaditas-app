import type { Product } from '@/features/products/api';
import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthStore } from '@/features/auth/use-auth-store';
import {
  useCreateAdjustment,
  useCreateAdjustmentItem,
  useFinalizeAdjustment,
} from '@/features/inventory/api';
import { useProducts } from '@/features/products/api';
import { queryClient } from '@/lib/api';

function ProductChip({
  product,
  selected,
  onPress,
}: {
  product: Product;
  selected: boolean;
  onPress: () => void;
}) {
  const iconName
    = product.unit_type === 'paca'
      ? ('cube-outline' as const)
      : product.unit_type === 'botellon'
        ? ('water-outline' as const)
        : ('snow-outline' as const);
  return (
    <Pressable
      style={{
        marginRight: 12,
        alignItems: 'center',
        borderRadius: 16,
        backgroundColor: '#fff',
        padding: 16,
        minWidth: 140,
        minHeight: 44,
        borderWidth: selected ? 2 : 0,
        borderColor: '#0077FF',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      }}
      onPress={onPress}
    >
      <Ionicons name={iconName} size={32} color="#0077FF" />
      <Text
        style={{ marginTop: 8, textAlign: 'center', fontSize: 14, fontWeight: '600', color: '#1e1e1e' }}
        numberOfLines={2}
      >
        {product.name}
      </Text>
      <Text style={{ marginTop: 4, fontSize: 12, color: '#737373' }}>{product.unit_type}</Text>
    </Pressable>
  );
}

function SubmitButton({ onPress, loading }: { onPress: () => void; loading: boolean }) {
  return (
    <Pressable
      style={{
        marginTop: 24,
        alignItems: 'center',
        borderRadius: 16,
        backgroundColor: '#10B981',
        paddingVertical: 16,
        minHeight: 56,
        opacity: loading ? 0.7 : 1,
      }}
      onPress={onPress}
      disabled={loading}
    >
      {loading
        ? (
            <ActivityIndicator color="#fff" />
          )
        : (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="checkmark-circle" size={22} color="#fff" />
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>Confirmar Ingreso</Text>
            </View>
          )}
    </Pressable>
  );
}

function QuantityForm({
  product,
  onSubmitted,
}: {
  product: Product;
  onSubmitted: () => void;
}) {
  const user = useAuthStore.use.user();
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const createAdjustment = useCreateAdjustment();
  const createItem = useCreateAdjustmentItem();
  const finalizeAdj = useFinalizeAdjustment();

  const handleSubmit = useCallback(async () => {
    if (!user) {
      return;
    }

    const qty = Number.parseInt(quantity, 10);
    if (Number.isNaN(qty) || qty <= 0) {
      Alert.alert('Error', 'La cantidad debe ser un número positivo');
      return;
    }

    setSubmitting(true);
    try {
      const adj = await createAdjustment.mutateAsync({
        user_id: user.id,
        type: 'input',
        description: description || `Ingreso de ${product.name}`,
      });
      const adjId = adj.id ?? (adj as any).data?.id;
      await createItem.mutateAsync({
        inventory_adjustment_id: adjId,
        product_id: product.id,
        quantity: qty,
      });
      await finalizeAdj.mutateAsync({ id: adjId });

      queryClient.invalidateQueries({ queryKey: ['inventory-adjustments'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });

      Alert.alert('Ingreso exitoso', `Se ingresaron ${qty} unidades de ${product.name}`);
      onSubmitted();
    }
    catch {
      Alert.alert('Error', 'No se pudo registrar el ingreso.');
    }
    finally {
      setSubmitting(false);
    }
  }, [quantity, description, user, product, createAdjustment, createItem, finalizeAdj, onSubmitted]);

  const labelStyle = { fontSize: 12, fontWeight: '500' as const, letterSpacing: 0.5, color: '#737373', textTransform: 'uppercase' as const };

  return (
    <View style={{ borderRadius: 16, backgroundColor: '#fff', padding: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 }}>
      <Text style={labelStyle}>Producto seleccionado</Text>
      <Text style={{ marginTop: 4, fontSize: 18, fontWeight: 'bold', color: '#1e1e1e' }}>{product.name}</Text>

      <Text style={{ marginTop: 16, ...labelStyle }}>Cantidad a ingresar</Text>
      <TextInput
        style={{ marginTop: 8, borderRadius: 12, borderWidth: 1, borderColor: '#e5e5e5', backgroundColor: '#fafafa', padding: 16, textAlign: 'center', fontSize: 28, fontWeight: 'bold', color: '#1e1e1e' }}
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="number-pad"
        placeholder="0"
        placeholderTextColor="#A3A3A3"
      />

      <Text style={{ marginTop: 16, ...labelStyle }}>Descripción (opcional)</Text>
      <TextInput
        style={{ marginTop: 8, borderRadius: 12, borderWidth: 1, borderColor: '#e5e5e5', backgroundColor: '#fafafa', paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: '#1e1e1e' }}
        value={description}
        onChangeText={setDescription}
        placeholder="Ej: Carga del proveedor"
        placeholderTextColor="#A3A3A3"
      />

      <SubmitButton onPress={handleSubmit} loading={submitting} />
    </View>
  );
}

export function InventoryScreen() {
  const { data: products, isLoading } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' }} edges={['top']}>
      <View style={{ backgroundColor: '#0077FF', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>Ingreso al Inventario</Text>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
        <Text style={{ marginBottom: 12, fontSize: 18, fontWeight: '600', color: '#383838' }}>Selecciona un Producto</Text>

        {isLoading
          ? (
              <ActivityIndicator size="large" color="#0077FF" style={{ marginTop: 20 }} />
            )
          : products && products.length > 0
            ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
                  {products.map(p => (
                    <ProductChip
                      key={p.id}
                      product={p}
                      selected={selectedProduct?.id === p.id}
                      onPress={() => setSelectedProduct(p)}
                    />
                  ))}
                </ScrollView>
              )
            : (
                <View style={{ marginBottom: 24, alignItems: 'center', borderRadius: 16, backgroundColor: '#fff', paddingVertical: 32 }}>
                  <Ionicons name="cube-outline" size={48} color="#A3A3A3" />
                  <Text style={{ marginTop: 12, fontSize: 16, fontWeight: '500', color: '#a3a3a3' }}>No hay productos</Text>
                </View>
              )}

        {selectedProduct
          ? (
              <QuantityForm
                product={selectedProduct}
                onSubmitted={() => {
                  setSelectedProduct(null);
                }}
              />
            )
          : null}
      </ScrollView>
    </SafeAreaView>
  );
}
