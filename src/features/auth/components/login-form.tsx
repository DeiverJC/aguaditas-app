import { Ionicons } from '@expo/vector-icons';
import { useForm } from '@tanstack/react-form';

import * as React from 'react';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import * as z from 'zod';

import { Button, Input, Text, View } from '@/components/ui';
import { getFieldError } from '@/components/ui/form-utils';

const schema = z.object({
  email: z
    .string({
      message: 'El correo es obligatorio',
    })
    .min(1, 'El correo es obligatorio')
    .email('Formato de correo inválido'),
  password: z
    .string({
      message: 'La contraseña es obligatoria',
    })
    .min(1, 'La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export type FormType = z.infer<typeof schema>;

export type LoginFormProps = {
  onSubmit?: (data: FormType) => void;
  isLoading?: boolean;
  error?: string;
};

export function LoginForm({
  onSubmit = () => { },
  isLoading = false,
  error,
}: LoginFormProps) {
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },

    validators: {
      onChange: schema as any,
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={10}
    >
      <View className="flex-1 justify-center px-6">
        {/* Logo / Branding */}
        <View className="mb-10 items-center justify-center">
          <View className="mb-4 size-20 items-center justify-center rounded-full bg-primary-500">
            <Ionicons name="water" size={32} color="#fff" />
          </View>
          <Text
            testID="form-title"
            className="text-center text-3xl font-bold text-charcoal-900 dark:text-white"
          >
            Aguaditas
          </Text>
          <Text className="mt-2 text-center text-base text-neutral-500 dark:text-neutral-400">
            Distribución de Agua y Hielo
          </Text>
        </View>

        {/* Error message */}
        {error
          ? (
              <View className="mb-4 rounded-xl bg-danger-50 p-3 dark:bg-danger-900">
                <Text className="text-center text-sm text-danger-600 dark:text-danger-300">
                  {error}
                </Text>
              </View>
            )
          : null}

        <form.Field
          name="email"
          children={field => (
            <Input
              testID="email-input"
              label="Correo electrónico"
              placeholder="tu@correo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChangeText={field.handleChange}
              error={getFieldError(field)}
            />
          )}
        />

        <form.Field
          name="password"
          children={field => (
            <Input
              testID="password-input"
              label="Contraseña"
              placeholder="••••••••"
              secureTextEntry={true}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChangeText={field.handleChange}
              error={getFieldError(field)}
            />
          )}
        />

        <View className="mt-4">
          <Button
            testID="login-button"
            label="Iniciar Sesión"
            onPress={form.handleSubmit}
            loading={isLoading}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
