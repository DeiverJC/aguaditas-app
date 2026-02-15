import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';
import { client } from '@/lib/api';

// --- Types ---

export type Product = {
  id: number;
  name: string;
  sku: string;
  unit_type: string;
  sale_price: string;
  created_at: string;
  updated_at: string;
};

type RestifyListResponse<T> = {
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
  data: Array<{
    id: string;
    type: string;
    attributes: T;
  }>;
};

type RestifyDetailResponse<T> = {
  data: {
    id: string;
    type: string;
    attributes: T;
  };
};

// --- Queries ---

export const useProducts = createQuery<Product[], void, AxiosError>({
  queryKey: ['products'],
  fetcher: async () => {
    const response
      = await client.get<RestifyListResponse<Product>>('restify/products');
    return response.data.data.map(item => ({
      ...item.attributes,
      id: Number(item.id),
    }));
  },
});

export const useProduct = createQuery<Product, { id: number }, AxiosError>({
  queryKey: ['product'],
  fetcher: async ({ id }) => {
    const response = await client.get<RestifyDetailResponse<Product>>(
      `restify/products/${id}`,
    );
    return {
      ...response.data.data.attributes,
      id: Number(response.data.data.id),
    };
  },
});
