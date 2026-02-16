import type { Product } from '@/features/products/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as React from 'react';

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';
import { useProducts } from '@/features/products/api';

function ProductItem({ product, onPress }: { product: Product; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: '#EFF6FF',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 16,
        }}
      >
        <Ionicons name="cube-outline" size={24} color="#0077FF" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#1e1e1e' }}>
          {product.name}
        </Text>
        <Text style={{ fontSize: 14, color: '#737373', marginTop: 2 }}>
          SKU:
          {' '}
          {product.sku}
          {' '}
          |
          {' '}
          {product.unit_type}
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1e1e1e' }}>
          $
          {Number(product.sale_price).toLocaleString()}
        </Text>
      </View>
    </Pressable>
  );
}

export function ProductsList() {
  const router = useRouter();
  const { data: products, isLoading } = useProducts();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0077FF" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <ProductItem
            product={item}
            onPress={() => router.push(`/inventory/product/${item.id}`)}
          />
        )}
        ListEmptyComponent={(
          <View style={{ padding: 32, alignItems: 'center' }}>
            <Text style={{ color: '#737373' }}>No hay productos registrados</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <Pressable
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: '#0077FF',
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
        }}
        onPress={() => router.push('/inventory/product/new')}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </Pressable>
    </View>
  );
}
