import { useForm } from '@tanstack/react-form';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as React from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import * as z from 'zod';

import { ProductFormFields } from '@/features/inventory/components/product-form-fields';
import { useCreateProduct, useProduct, useUpdateProduct } from '@/features/products/api';

// Defined logic to ensure coercion is handled properly in Zod
const productSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  sku: z.string().min(1, 'El SKU es obligatorio'),
  unit_type: z.string().min(1, 'El tipo de unidad es obligatorio'),
  sale_price: z.number().min(0, 'El precio debe ser mayor o igual a 0'), // Removed coerce here, handling it in UI or submit
});

export function ProductFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const id = params.id ? Number(params.id) : undefined;
  const isEditing = !!id;

  const { data: product, isLoading: isLoadingProduct } = useProduct({ id: id! }, { enabled: isEditing });
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const form = useForm({
    defaultValues: {
      name: product?.name ?? '',
      sku: product?.sku ?? '',
      unit_type: product?.unit_type ?? '',
      sale_price: product?.sale_price ? Number(product.sale_price) : 0,
    },
    validators: {
      onChange: productSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        if (isEditing) {
          await updateProduct.mutateAsync({
            id: id!,
            ...value,
          });
          Alert.alert('Éxito', 'Producto actualizado correctamente');
        }
        else {
          await createProduct.mutateAsync(value);
          Alert.alert('Éxito', 'Producto creado correctamente');
        }
        router.back();
      }
      catch (error) {
        console.error(error);
        Alert.alert('Error', 'Ocurrió un error al guardar el producto');
      }
    },
  });

  // Update form values when product data loads
  React.useEffect(() => {
    if (product) {
      form.setFieldValue('name', product.name);
      form.setFieldValue('sku', product.sku);
      form.setFieldValue('unit_type', product.unit_type);
      form.setFieldValue('sale_price', Number(product.sale_price));
    }
  }, [product, form]);

  if (isEditing && isLoadingProduct) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0077FF" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: '#F9FAFB' }}
    >
      <Stack.Screen
        options={{
          headerTitle: isEditing ? 'Editar Producto' : 'Nuevo Producto',
        }}
      />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <ProductFormFields
          form={form}
          isEditing={isEditing}
          isLoading={createProduct.isPending || updateProduct.isPending}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
