import * as React from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { getFieldError } from '@/components/ui/form-utils';
import { Input } from '@/components/ui/input';

type ProductFormFieldsProps = {
  form: any; // Using any for simplicity with complex TanStack Form types, or could verify exact type
  isEditing: boolean;
  isLoading: boolean;
};

export function ProductFormFields({ form, isEditing, isLoading }: ProductFormFieldsProps) {
  return (
    <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 }}>
      <form.Field
        name="name"
        children={(field: any) => (
          <Input
            label="Nombre del Producto"
            placeholder="Ej. Agua Botellón"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChangeText={field.handleChange}
            error={getFieldError(field)}
          />
        )}
      />

      <form.Field
        name="sku"
        children={(field: any) => (
          <Input
            label="SKU"
            placeholder="Ej. SKU-001"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChangeText={field.handleChange}
            error={getFieldError(field)}
          />
        )}
      />

      <form.Field
        name="unit_type"
        children={(field: any) => (
          <Input
            label="Tipo de Unidad"
            placeholder="Ej. botellon, paca"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChangeText={field.handleChange}
            error={getFieldError(field)}
          />
        )}
      />

      <form.Field
        name="sale_price"
        children={(field: any) => (
          <Input
            label="Precio de Venta"
            placeholder="0.00"
            keyboardType="numeric"
            value={field.state.value.toString()}
            onBlur={field.handleBlur}
            onChangeText={(text: string) => field.handleChange(Number(text))}
            error={getFieldError(field)}
          />
        )}
      />

      <Button
        className="mt-6"
        label={isEditing ? 'Actualizar Producto' : 'Crear Producto'}
        onPress={form.handleSubmit}
        loading={isLoading}
      />
    </View>
  );
}
