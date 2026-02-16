import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type AdjustmentItemListProps = {
  form: any;
  onAddPress: () => void;
};

export function AdjustmentItemList({ form, onAddPress }: AdjustmentItemListProps) {
  return (
    <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 80 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <form.Subscribe
          selector={(state: any) => [state.values.items]}
          children={([items]: [any[]]) => (
            <Text style={{ fontSize: 16, fontWeight: '600' }}>
              Productos (
              {items.length}
              )
            </Text>
          )}
        />
        <TouchableOpacity onPress={onAddPress}>
          <Text style={{ color: '#0077FF', fontWeight: '600' }}>+ Agregar</Text>
        </TouchableOpacity>
      </View>

      <form.Field
        name="items"
        mode="array"
        children={(field: any) => (
          <View>
            {field.state.value.map((item: any, index: number) => (
              <View
                key={`${item.product.id}_${item.quantity}`} // Using product ID and quantity as composite key
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: '#F3F4F6',
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '600' }}>{item.product.name}</Text>
                  <Text style={{ color: '#6B7280', fontSize: 12 }}>{item.product.unit_type}</Text>
                </View>
                <Text style={{ fontWeight: '700', fontSize: 16, marginHorizontal: 16 }}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => field.removeValue(index)}>
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
            {field.state.meta.errors
              ? (
                  <Text className="mt-2 text-center text-sm text-danger-400 dark:text-danger-600">
                    {field.state.meta.errors.join(', ')}
                  </Text>
                )
              : null}
          </View>
        )}
      />

      <form.Subscribe
        selector={(state: any) => [state.values.items]}
        children={([items]: [any[]]) => items.length === 0 && (
          <Text style={{ color: '#9CA3AF', textAlign: 'center', paddingVertical: 20 }}>
            No hay productos agregados
          </Text>
        )}
      />
    </View>
  );
}
