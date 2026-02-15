import type { AxiosError } from 'axios';
import { createMutation, createQuery } from 'react-query-kit';
import { client } from '@/lib/api';

// --- Types ---

export type InventoryAdjustmentItem = {
  id: number;
  inventory_adjustment_id: number;
  product_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
};

export type InventoryAdjustment = {
  id: number;
  user_id: number;
  type: 'input' | 'output';
  description: string;
  status: 'draft' | 'finalized';
  finalized_at: string | null;
  created_at: string;
  updated_at: string;
};

type RestifyListResponse = {
  meta: {
    current_page: number;
    total: number;
  };
  data: Array<{
    id: string;
    type: string;
    attributes: InventoryAdjustment;
    relationships?: {
      items?: InventoryAdjustmentItem[];
    };
  }>;
};

type CreateAdjustmentInput = {
  user_id: number;
  type: 'input' | 'output';
  description?: string;
};

type CreateAdjustmentItemInput = {
  inventory_adjustment_id: number;
  product_id: number;
  quantity: number;
};

// --- Queries ---

export const useInventoryAdjustments = createQuery<
  InventoryAdjustment[],
  void,
  AxiosError
>({
  queryKey: ['inventory-adjustments'],
  fetcher: async () => {
    const response = await client.get<RestifyListResponse>(
      'restify/inventory-adjustments',
      { params: { related: 'items' } },
    );
    return response.data.data.map(item => ({
      ...item.attributes,
      id: Number(item.id),
    }));
  },
});

// --- Mutations ---

export const useCreateAdjustment = createMutation<
  InventoryAdjustment,
  CreateAdjustmentInput,
  AxiosError
>({
  mutationFn: async (variables) => {
    const response = await client.post(
      'restify/inventory-adjustments',
      variables,
    );
    return response.data.data?.attributes ?? response.data;
  },
});

export const useCreateAdjustmentItem = createMutation<
  InventoryAdjustmentItem,
  CreateAdjustmentItemInput,
  AxiosError
>({
  mutationFn: async (variables) => {
    const response = await client.post(
      'restify/inventory-adjustment-items',
      variables,
    );
    return response.data.data?.attributes ?? response.data;
  },
});

export const useFinalizeAdjustment = createMutation<
  void,
  { id: number },
  AxiosError
>({
  mutationFn: async ({ id }) => {
    await client.post(`restify/inventory-adjustments/${id}/actions/finalize`);
  },
});
