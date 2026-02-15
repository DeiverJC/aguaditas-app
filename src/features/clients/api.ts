import type { AxiosError } from 'axios';
import { createMutation, createQuery } from 'react-query-kit';
import { client } from '@/lib/api';

// --- Types ---

export type Client = {
  id: number;
  name: string;
  phone: string;
  address: string;
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
    attributes: Client;
  }>;
};

type CreateClientInput = {
  name: string;
  phone?: string;
  address?: string;
};

// --- Queries ---

export const useClients = createQuery<
  Client[],
  { search?: string },
  AxiosError
>({
  queryKey: ['clients'],
  fetcher: async (variables) => {
    const params: Record<string, string> = {};
    if (variables?.search) {
      params.search = variables.search;
    }
    const response = await client.get<RestifyListResponse>('restify/clients', {
      params,
    });
    return response.data.data.map(item => ({
      ...item.attributes,
      id: Number(item.id),
    }));
  },
});

// --- Mutations ---

export const useCreateClient = createMutation<
  Client,
  CreateClientInput,
  AxiosError
>({
  mutationFn: async (variables) => {
    const response = await client.post('restify/clients', variables);
    return response.data.data?.attributes ?? response.data;
  },
});
