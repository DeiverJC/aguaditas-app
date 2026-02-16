import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

type AdjustmentDetailActionsProps = {
  id: number;
  isFinalized: boolean;
  finalizing: boolean;
  onFinalize: () => void;
};

export function AdjustmentDetailActions({
  id,
  isFinalized,
  finalizing,
  onFinalize,
}: AdjustmentDetailActionsProps) {
  const router = useRouter();

  if (isFinalized)
    return null;

  return (
    <View style={{ padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E5E5E5', flexDirection: 'row', gap: 12 }}>
      <TouchableOpacity
        onPress={() => router.push(`/inventory/adjustment/edit/${id}`)}
        disabled={finalizing}
        style={{
          flex: 1,
          backgroundColor: '#F3F4F6',
          paddingVertical: 16,
          borderRadius: 12,
          alignItems: 'center',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="create-outline" size={20} color="#374151" style={{ marginRight: 8 }} />
          <Text style={{ color: '#374151', fontSize: 16, fontWeight: '700' }}>Editar</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onFinalize}
        disabled={finalizing}
        style={{
          flex: 1,
          backgroundColor: '#10B981',
          paddingVertical: 16,
          borderRadius: 12,
          alignItems: 'center',
          opacity: finalizing ? 0.7 : 1,
        }}
      >
        {finalizing
          ? (
              <ActivityIndicator color="#fff" />
            )
          : (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="checkmark-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Finalizar</Text>
              </View>
            )}
      </TouchableOpacity>
    </View>
  );
}
