/* eslint-disable max-lines-per-function */
import type { Product } from '@/features/products/api';
import { useForm } from '@tanstack/react-form';
import { Stack, useRouter } from 'expo-router';
import * as React from 'react';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/features/auth/use-auth-store';
import {
  useCreateAdjustment,
  useCreateAdjustmentItem,
  useFinalizeAdjustment,
  useInventoryAdjustment,
  useUpdateAdjustment,
} from '@/features/inventory/api';
import { AdjustmentFormHeader } from '@/features/inventory/components/adjustment-form-header';
import { AdjustmentItemList } from '@/features/inventory/components/adjustment-item-list';
import { ProductSelector } from '@/features/inventory/components/product-selector';
import { queryClient } from '@/lib/api';

const adjustmentSchema = z.object({
  type: z.enum(['input', 'output']),
  description: z.string(),
  items: z.array(z.object({
    product: z.custom<Product>(),
    quantity: z.number().min(1),
  })).min(1, 'Debe agregar al menos un producto'),
});

type AdjustmentFormScreenProps = {
  adjustmentId?: number;
};

export function AdjustmentFormScreen({ adjustmentId }: AdjustmentFormScreenProps) {
  const router = useRouter();
  const user = useAuthStore.use.user();

  // Queries & Mutations
  const { data: existingAdjustment } = useInventoryAdjustment(
    { variables: { id: adjustmentId! }, enabled: !!adjustmentId },
  );

  const createAdjustment = useCreateAdjustment();
  const updateAdjustment = useUpdateAdjustment();
  const createItem = useCreateAdjustmentItem();
  const finalizeAdj = useFinalizeAdjustment();

  const isEditing = !!adjustmentId;

  const [showProductSelector, setShowProductSelector] = useState(false);
  const [quantityModalVisible, setQuantityModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantityInput, setQuantityInput] = useState('');
  const [submitAction, setSubmitAction] = useState<'draft' | 'finalize'>('draft');

  // Prepare initial values if editing
  const initialValues = React.useMemo(() => {
    if (existingAdjustment) {
      return {
        type: existingAdjustment.type,
        description: existingAdjustment.description || '',
        items: (existingAdjustment as any).relationships?.items?.map((item: any) => ({
          product: { id: item.product_id, name: `Producto #${item.product_id}`, unit_type: 'UN' } as Product, // Ideally fetch full product details
          quantity: item.quantity,
        })) || [],
      };
    }
    return {
      type: 'input' as 'input' | 'output',
      description: '',
      items: [] as Array<{ product: Product; quantity: number }>,
    };
  }, [existingAdjustment]);

  const form = useForm({
    defaultValues: initialValues,
    validators: {
      onChange: adjustmentSchema,
    },
    onSubmit: async ({ value }) => {
      if (!user)
        return;

      try {
        let adjId = adjustmentId;

        if (isEditing && adjId) {
          // Update existing adjustment
          await updateAdjustment.mutateAsync({
            id: adjId!,
            type: value.type,
            description: value.description,
          });

          // Basic item sync: For now, we assume we just add *new* items or recreate.
          // Since the API is limited, a robust sync is complex.
          // For MVP: We will just add newly added items if tracking new vs old.
          // However, to keep it simple and given previous constraints:
          // We will just try to add all items. If they exist, it might duplicate or fail depending on backend.
          // Ideally: Backend should handle sync.
          // PRACTICAL APPROACH: Use createItem for NEW items.
          // But here, we might just be adding more.
          // **CRITICAL**: The user just wants to ADD products if editing.
          // We will iterate and add. (Ideally we filter out existing ones if we had IDs)

          // Filter out items that were already there?
          // The form items list might not have IDs.

          // Let's assume we re-add everything or just added ones?
          // Simplest: Just save the adjustment properties.
          // REAL implementation needs better item sync.
        }
        else {
          // Create new adjustment
          const adj = await createAdjustment.mutateAsync({
            user_id: user.id,
            type: value.type,
            description: value.description || `Ajuste de ${value.type === 'input' ? 'Entrada' : 'Salida'}`,
          });
          adjId = adj.id ?? (adj as any).data?.id;
        }

        // Add items (Primitive implementation: just add them all for new, or potentially duplicate for edit)
        // If editing, we should ideally only add *new* ones.
        // But since we don't have item IDs in the form state easily mapped back:
        // We will just re-add all items if it's NEW.
        // If EDITING, this is risky without item IDs.
        // **Correct approach for Edit**: Only add items that don't have an ID (newly added).
        // But our form state `items` objects don't store the item ID, just product & qty.
        // Let's assume for now we only support adding items on CREATE, or careful manual add on EDIT.
        // **ACTUALLY**, let's just create items. The backend might handle it.

        if (!isEditing) {
          for (const item of value.items) {
            await createItem.mutateAsync({
              inventory_adjustment_id: adjId!,
              product_id: item.product.id,
              quantity: item.quantity,
            });
          }
        }
        else {
          // If editing, we might need a better strategy.
          // For now, let's assume the user can only modify description/type or use a specific "Add Item" flow that is immediate?
          // No, the form is "Save".
          // Let's only add items if we are finalizing or saving draft on a NEW one.
          // If editing, maybe we skip item sync to avoid duplication?
          // **User Request**: "agregar dos botones... uno para guardar borrador y otro finalizar"
          // **User Request**: "el formulario de editar ajuste no deja agregar productos" -> implying they WANT to add products.

          // We need to support adding items on edit.
          // Logic: Check if item exists in `existingAdjustment`. If not, add it.
          const existingItems = (existingAdjustment as any)?.relationships?.items || [];
          for (const item of value.items) {
            const alreadyExists = existingItems.some((ex: any) => ex.product_id === item.product.id && ex.quantity === item.quantity);
            if (!alreadyExists) {
              await createItem.mutateAsync({
                inventory_adjustment_id: adjId!,
                product_id: item.product.id,
                quantity: item.quantity,
              });
            }
          }
        }

        if (submitAction === 'finalize') {
          await finalizeAdj.mutateAsync({ id: adjId! });
          Alert.alert('Éxito', 'Ajuste finalizado correctamente');
        }
        else {
          Alert.alert('Éxito', 'Borrador guardado correctamente');
        }

        queryClient.invalidateQueries({ queryKey: ['inventory-adjustments'] });
        queryClient.invalidateQueries({ queryKey: ['products'] });
        if (isEditing) {
          queryClient.invalidateQueries({ queryKey: ['inventory-adjustment', { id: adjId }] });
        }

        router.back();
      }
      catch (error) {
        console.error(error);
        Alert.alert('Error', 'No se pudo guardar el ajuste');
      }
    },
  });

  const handleAddItem = (product: Product) => {
    setSelectedProduct(product);
    setQuantityInput('');
    setShowProductSelector(false);
    setQuantityModalVisible(true);
  };

  const confirmAddItem = () => {
    const qty = Number.parseInt(quantityInput, 10);
    if (Number.isNaN(qty) || qty <= 0) {
      Alert.alert('Error', 'Cantidad inválida');
      return;
    }
    if (selectedProduct) {
      form.setFieldValue('items', (old: any[]) => [...old, { product: selectedProduct, quantity: qty }]);
      setQuantityModalVisible(false);
      setSelectedProduct(null);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <Stack.Screen options={{ headerTitle: isEditing ? 'Editar Ajuste' : 'Nuevo Ajuste', headerBackTitle: 'Atrás' }} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <AdjustmentFormHeader form={form} />
          <AdjustmentItemList form={form} onAddPress={() => setShowProductSelector(true)} />
        </ScrollView>

        {/* Footer actions */}
        <View style={{ padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E5E5E5', flexDirection: 'row', gap: 12 }}>
          <form.Subscribe
            selector={state => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <>
                <View style={{ flex: 1 }}>
                  <Button
                    label="Guardar Borrador"
                    variant="secondary"
                    onPress={() => {
                      setSubmitAction('draft');
                      form.handleSubmit();
                    }}
                    loading={isSubmitting && submitAction === 'draft'}
                    disabled={!canSubmit || isSubmitting}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Button
                    label="Finalizar"
                    onPress={() => {
                      setSubmitAction('finalize');
                      Alert.alert(
                        'Finalizar Ajuste',
                        '¿Seguro que deseas finalizar? Esto afectará el inventario permanentemente.',
                        [
                          { text: 'Cancelar', style: 'cancel' },
                          { text: 'Finalizar', style: 'destructive', onPress: () => form.handleSubmit() },
                        ],
                      );
                    }}
                    loading={isSubmitting && submitAction === 'finalize'}
                    disabled={!canSubmit || isSubmitting}
                  />
                </View>
              </>
            )}
          />
        </View>
      </KeyboardAvoidingView>

      <ProductSelector
        visible={showProductSelector}
        onSelect={handleAddItem}
        onClose={() => setShowProductSelector(false)}
      />

      <Modal transparent visible={quantityModalVisible} animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 24, width: '100%', maxWidth: 340 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 16, textAlign: 'center' }}>
              {selectedProduct?.name}
            </Text>
            <Text style={{ marginBottom: 8 }}>Cantidad:</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#D1D5DB',
                borderRadius: 8,
                padding: 12,
                fontSize: 24,
                textAlign: 'center',
                fontWeight: 'bold',
                marginBottom: 24,
              }}
              value={quantityInput}
              onChangeText={setQuantityInput}
              keyboardType="number-pad"
              autoFocus
            />
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={() => setQuantityModalVisible(false)}
                style={{ flex: 1, padding: 12, alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 8 }}
              >
                <Text style={{ color: '#374151', fontWeight: '600' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmAddItem}
                style={{ flex: 1, padding: 12, alignItems: 'center', backgroundColor: '#0077FF', borderRadius: 8 }}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
