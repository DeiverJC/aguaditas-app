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

type RestifyDetailResponse = {
  data: {
    id: string;
    type: string;
    attributes: InventoryAdjustment;
    relationships?: {
      items?: InventoryAdjustmentItem[];
    };
  };
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

export const useInventoryAdjustment = createQuery<
  InventoryAdjustment,
  { id: number },
  AxiosError
>({
  queryKey: ['inventory-adjustment'],
  fetcher: async ({ id }) => {
    const response = await client.get<RestifyDetailResponse>(
      `restify/inventory-adjustments/${id}`,
      { params: { related: 'items' } },
    );
    // Merge relationships into attributes or handle them as needed
    const attributes = response.data.data.attributes;
    const items = response.data.data.relationships?.items || [];
    // Inject items into attributes for easier access in UI (casting as any to avoid strict type issues with original type)
    return {
      ...attributes,
      id: Number(response.data.data.id),
      relationships: { items },
    } as any;
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
    await client.post(`restify/inventory-adjustments/${id}/actions?action=finalize-inventory-adjustment`);
  },
});

export const useUpdateAdjustment = createMutation<
  InventoryAdjustment,
  Partial<CreateAdjustmentInput> & { id: number },
  AxiosError
>({
  mutationFn: async ({ id, ...variables }) => {
    const response = await client.post(
      `restify/inventory-adjustments/${id}`,
      { ...variables, _method: 'PATCH' },
    );
    return response.data.data?.attributes ?? response.data;
  },
});
