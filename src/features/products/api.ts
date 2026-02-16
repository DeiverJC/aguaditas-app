import type { UseQueryOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
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

export function useProducts() {
  return useQuery<Product[], AxiosError>({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await client.get<RestifyListResponse<Product>>('restify/products');
      return response.data.data.map(item => ({
        ...item.attributes,
        id: Number(item.id),
      }));
    },
  });
}

export function useProduct({ id }: { id: number }, options?: Omit<UseQueryOptions<Product, AxiosError>, 'queryKey' | 'queryFn'>) {
  return useQuery<Product, AxiosError>({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await client.get<RestifyDetailResponse<Product>>(
        `restify/products/${id}`,
      );
      return {
        ...response.data.data.attributes,
        id: Number(response.data.data.id),
      };
    },
    enabled: !!id,
    ...options,
  });
}

// --- Mutations ---

type CreateProductInput = {
  name: string;
  sku: string;
  unit_type: string;
  sale_price: number;
};

type UpdateProductInput = Partial<CreateProductInput> & { id: number };

export function useCreateProduct() {
  return useMutation<Product, AxiosError, CreateProductInput>({
    mutationFn: async (variables) => {
      const response = await client.post('restify/products', variables);
      return response.data.data?.attributes ?? response.data;
    },
  });
}

export function useUpdateProduct() {
  return useMutation<Product, AxiosError, UpdateProductInput>({
    mutationFn: async ({ id, ...variables }) => {
      const response = await client.patch(`restify/products/${id}`, variables);
      return response.data.data?.attributes ?? response.data;
    },
  });
}
