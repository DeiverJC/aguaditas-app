import axios from 'axios';
import Env from 'env';

import { getToken } from '@/lib/auth/utils';

export const client = axios.create({
  baseURL: Env.EXPO_PUBLIC_API_URL,
});

// Inject auth token on every request
client.interceptors.request.use((config) => {
  // show full url with base url
  console.log('[URL]', `${Env.EXPO_PUBLIC_API_URL}/${config.url}`);
  // show body if available
  if (config.data) {
    console.log('[BODY]', JSON.stringify(config.data, null, 2));
  }

  const token = getToken();
  if (token?.access) {
    config.headers.Authorization = `Bearer ${token.access}`;
  }
  return config;
});

// Log responses
client.interceptors.response.use((response) => {
  console.log('[RESPONSE]', JSON.stringify(response.data, null, 2));
  return response;
});
