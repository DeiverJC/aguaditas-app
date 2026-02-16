import type { Product } from '@/features/products/api';
import * as React from 'react';
import { useState } from 'react';
import {
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useProducts } from '@/features/products/api';

export function ProductSelector({
  onSelect,
  onClose,
  visible,
}: {
  onSelect: (product: Product) => void;
  onClose: () => void;
  visible: boolean;
}) {
  const { data: products } = useProducts();
  const [search, setSearch] = useState('');

  const filtered = products?.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
    || p.sku.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
        <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E5E5', backgroundColor: '#fff' }}>
          <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Seleccionar Producto</Text>
          <TextInput
            style={{
              backgroundColor: '#F3F4F6',
              borderRadius: 8,
              padding: 10,
              fontSize: 16,
            }}
            placeholder="Buscar por nombre o SKU..."
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <FlatList
          data={filtered}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => onSelect(item)}
              style={{
                padding: 16,
                backgroundColor: '#fff',
                borderBottomWidth: 1,
                borderBottomColor: '#f0f0f0',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View>
                <Text style={{ fontWeight: '600', fontSize: 16 }}>{item.name}</Text>
                <Text style={{ color: '#6B7280' }}>
                  SKU:
                  {item.sku}
                </Text>
              </View>
              <Text style={{ color: '#0077FF' }}>{item.unit_type}</Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity
          onPress={onClose}
          style={{ padding: 16, alignItems: 'center' }}
        >
          <Text style={{ color: '#EF4444', fontWeight: '600' }}>Cerrar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
}
