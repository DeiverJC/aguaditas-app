import type { AxiosError } from 'axios';
import { createMutation, createQuery } from 'react-query-kit';
import { client } from '@/lib/api';

// --- Types ---

export type OrderItem = {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price_at_time: string;
  created_at: string;
  updated_at: string;
};

export type Order = {
  id: number;
  client_id: number;
  user_id: number;
  total_amount: string;
  status: 'pending' | 'delivered' | 'cancelled';
  items: OrderItem[];
  created_at: string;
};

type RestifyListResponse = {
  meta: {
    current_page: number;
    total: number;
  };
  data: Array<{
    id: string;
    type: string;
    attributes: Order;
  }>;
};

type CreateOrderInput = {
  client_id: number;
  items: Array<{
    product_id: number;
    quantity: number;
  }>;
};

// --- Queries ---

export const useOrders = createQuery<Order[], void, AxiosError>({
  queryKey: ['orders'],
  fetcher: async () => {
    const response = await client.get<RestifyListResponse>('restify/orders');
    return response.data.data.map(item => ({
      ...item.attributes,
      id: Number(item.id),
    }));
  },
});

// --- Mutations ---

export const useCreateOrder = createMutation<
  Order,
  CreateOrderInput,
  AxiosError
>({
  mutationFn: async (variables) => {
    const response = await client.post('restify/orders', variables);
    return response.data.data ?? response.data;
  },
});
