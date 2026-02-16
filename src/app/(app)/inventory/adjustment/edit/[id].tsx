import { useLocalSearchParams } from 'expo-router';
import * as React from 'react';

import { AdjustmentFormScreen } from '@/features/inventory/adjustment-form-screen';

export default function EditAdjustmentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <AdjustmentFormScreen adjustmentId={Number(id)} />;
}
