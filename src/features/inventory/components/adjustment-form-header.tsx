import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { getFieldError } from '@/components/ui/form-utils';
import { Input } from '@/components/ui/input';

type AdjustmentFormHeaderProps = {
  form: any;
};

export function AdjustmentFormHeader({ form }: AdjustmentFormHeaderProps) {
  return (
    <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16 }}>
      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Tipo de Ajuste</Text>

      <form.Field
        name="type"
        children={(field: any) => (
          <View style={{ flexDirection: 'row', marginBottom: 16 }}>
            <TouchableOpacity
              onPress={() => field.handleChange('input')}
              style={{
                flex: 1,
                padding: 12,
                backgroundColor: field.state.value === 'input' ? '#ECFDF5' : '#F3F4F6',
                borderRadius: 8,
                alignItems: 'center',
                marginRight: 8,
                borderWidth: field.state.value === 'input' ? 1 : 0,
                borderColor: '#10B981',
              }}
            >
              <Text style={{ color: field.state.value === 'input' ? '#047857' : '#374151', fontWeight: '600' }}>Entrada</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => field.handleChange('output')}
              style={{
                flex: 1,
                padding: 12,
                backgroundColor: field.state.value === 'output' ? '#FEF2F2' : '#F3F4F6',
                borderRadius: 8,
                alignItems: 'center',
                marginLeft: 8,
                borderWidth: field.state.value === 'output' ? 1 : 0,
                borderColor: '#EF4444',
              }}
            >
              <Text style={{ color: field.state.value === 'output' ? '#B91C1C' : '#374151', fontWeight: '600' }}>Salida</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <form.Field
        name="description"
        children={(field: any) => (
          <Input
            label="Descripción"
            placeholder="Motivo del ajuste..."
            value={field.state.value}
            onBlur={field.handleBlur}
            onChangeText={field.handleChange}
            error={getFieldError(field)}
            multiline
            numberOfLines={3}
            className="min-h-[80px]"
          />
        )}
      />
    </View>
  );
}
