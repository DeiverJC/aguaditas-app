import type { LoginFormProps } from './components/login-form';

import { useRouter } from 'expo-router';
import * as React from 'react';

import { FocusAwareStatusBar } from '@/components/ui';
import { useLogin } from './api';
import { LoginForm } from './components/login-form';
import { useAuthStore } from './use-auth-store';

export function LoginScreen() {
  const router = useRouter();
  const signIn = useAuthStore.use.signIn();
  const loginMutation = useLogin();

  const onSubmit: LoginFormProps['onSubmit'] = (data) => {
    loginMutation.mutate(data, {
      onSuccess: (response) => {
        const token = response.meta.token;
        const user = {
          id: response.attributes.id,
          name: response.attributes.name,
          email: response.attributes.email,
          role: response.attributes.role,
        };
        signIn({ access: token, refresh: '' }, user);
        router.replace('/');
      },
    });
  };

  const errorMessage = loginMutation.error
    ? 'Credenciales incorrectas. Intenta de nuevo.'
    : undefined;

  return (
    <>
      <FocusAwareStatusBar />
      <LoginForm
        onSubmit={onSubmit}
        isLoading={loginMutation.isPending}
        error={errorMessage}
      />
    </>
  );
}
