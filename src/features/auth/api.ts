import type { AxiosError } from 'axios';

import { createMutation } from 'react-query-kit';
import { client } from '@/lib/api';

// --- Types ---

type LoginInput = {
  email: string;
  password: string;
};

type UserAttributes = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'repartidor';
};

type LoginResponse = {
  id: string;
  type: string;
  attributes: UserAttributes;
  meta: {
    authorizedToShow: boolean;
    authorizedToStore: boolean;
    authorizedToUpdate: boolean;
    authorizedToDelete: boolean;
    token: string;
  };
};

type ProfileResponse = {
  data: {
    id: string;
    type: string;
    attributes: UserAttributes;
  };
};

// --- Mutations ---

export const useLogin = createMutation<LoginResponse, LoginInput, AxiosError>({
  mutationFn: async (variables) => {
    const response = await client.post('login', variables);
    return response.data;
  },
});

export const useLogout = createMutation<void, void, AxiosError>({
  mutationFn: async () => {
    await client.post('logout');
  },
});

export const useProfile = createMutation<ProfileResponse, void, AxiosError>({
  mutationFn: async () => {
    const response = await client.get('restify/profile');
    return response.data;
  },
});
