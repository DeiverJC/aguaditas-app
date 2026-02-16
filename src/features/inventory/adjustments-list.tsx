import type { InventoryAdjustment } from '@/features/inventory/api';
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
import { useInventoryAdjustments } from '@/features/inventory/api';

function AdjustmentItem({ adjustment, onPress }: { adjustment: InventoryAdjustment; onPress: () => void }) {
  const isInput = adjustment.type === 'input';
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
          backgroundColor: isInput ? '#ECFDF5' : '#FEF2F2',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 16,
        }}
      >
        <Ionicons
          name={isInput ? 'arrow-down' : 'arrow-up'}
          size={24}
          color={isInput ? '#10B981' : '#EF4444'}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#1e1e1e' }}>
          {adjustment.description || 'Sin descripción'}
        </Text>
        <Text style={{ fontSize: 14, color: '#737373', marginTop: 2 }}>
          {new Date(adjustment.created_at).toLocaleDateString()}
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
            backgroundColor: adjustment.status === 'finalized' ? '#EFF6FF' : '#F3F4F6',
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: '500',
              color: adjustment.status === 'finalized' ? '#0077FF' : '#6B7280',
              textTransform: 'capitalize',
            }}
          >
            {adjustment.status === 'finalized' ? 'Finalizado' : 'Borrador'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export function AdjustmentsList() {
  const router = useRouter();
  // Note: The current API hook returns an array, but we might need pagination in the future.
  // For now, consistent with the Hook signature.
  const { data: adjustments, isLoading } = useInventoryAdjustments();

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
        data={adjustments}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <AdjustmentItem
            adjustment={item}
            onPress={() => router.push(`/inventory/adjustment/${item.id}`)}
          />
        )}
        ListEmptyComponent={(
          <View style={{ padding: 32, alignItems: 'center' }}>
            <Text style={{ color: '#737373' }}>No hay ajustes registrados</Text>
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
        onPress={() => router.push('/inventory/adjustment/new')}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </Pressable>
    </View>
  );
}
