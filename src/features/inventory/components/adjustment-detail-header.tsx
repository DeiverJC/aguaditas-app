import * as React from 'react';
import { Text, View } from 'react-native';

type AdjustmentDetailHeaderProps = {
  adjustment: any;
};

export function AdjustmentDetailHeader({ adjustment }: AdjustmentDetailHeaderProps) {
  const isFinalized = adjustment.status === 'finalized';

  return (
    <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
        <View>
          <Text style={{ fontSize: 14, color: '#6B7280' }}>Fecha</Text>
          <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 2 }}>
            {new Date(adjustment.created_at).toLocaleString()}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
              backgroundColor: isFinalized ? '#EFF6FF' : '#F3F4F6',
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '500',
                color: isFinalized ? '#0077FF' : '#6B7280',
                textTransform: 'capitalize',
              }}
            >
              {isFinalized ? 'Finalizado' : 'Borrador'}
            </Text>
          </View>
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
        <View>
          <Text style={{ fontSize: 14, color: '#6B7280' }}>Tipo</Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              marginTop: 2,
              color: adjustment.type === 'input' ? '#059669' : '#DC2626',
              textTransform: 'capitalize',
            }}
          >
            {adjustment.type === 'input' ? 'Entrada' : 'Salida'}
          </Text>
        </View>
      </View>

      <View>
        <Text style={{ fontSize: 14, color: '#6B7280' }}>Descripción</Text>
        <Text style={{ fontSize: 16, marginTop: 2, color: '#1F2937' }}>
          {adjustment.description || 'Sin descripción'}
        </Text>
      </View>
    </View>
  );
}
