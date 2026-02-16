import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { Alert, Pressable, Text, View } from 'react-native';

import { useLogout } from '@/features/auth/api';
import { useAuthStore } from '@/features/auth/use-auth-store';

function UserAvatar({ name }: { name: string }) {
  return (
    <View
      style={{
        width: 80,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 40,
        backgroundColor: '#cce5ff',
      }}
    >
      <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#0066dd' }}>
        {name.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}

function MenuItem({ label, icon }: { label: string; icon: keyof typeof Ionicons.glyphMap }) {
  return (
    <Pressable
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
        padding: 16,
        minHeight: 56,
      }}
    >
      <Ionicons name={icon} size={20} color="#555" style={{ marginRight: 12 }} />
      <Text style={{ fontSize: 16, color: '#383838' }}>{label}</Text>
    </Pressable>
  );
}

export function ProfileScreen() {
  const user = useAuthStore.use.user();
  const signOut = useAuthStore.use.signOut();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro de que deseas salir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salir',
        style: 'destructive',
        onPress: () => {
          logoutMutation.mutate(undefined, {
            onSuccess: () => signOut(),
            onError: () => signOut(),
          });
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>

      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 24 }}>
        {/* User card */}
        <View
          style={{
            alignItems: 'center',
            borderRadius: 16,
            backgroundColor: '#fff',
            padding: 24,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
          }}
        >
          <UserAvatar name={user?.name ?? '?'} />
          <Text style={{ marginTop: 16, fontSize: 20, fontWeight: 'bold', color: '#1e1e1e' }}>
            {user?.name ?? 'Usuario'}
          </Text>
          <Text style={{ marginTop: 4, fontSize: 14, color: '#737373' }}>
            {user?.email ?? ''}
          </Text>
          <View style={{ marginTop: 8, borderRadius: 20, backgroundColor: '#e6f2ff', paddingHorizontal: 16, paddingVertical: 4 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#0066dd' }}>
              {user?.role === 'admin' ? 'Administrador' : 'Repartidor'}
            </Text>
          </View>
        </View>

        {/* Menu items */}
        <View
          style={{
            marginTop: 24,
            borderRadius: 16,
            backgroundColor: '#fff',
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
          }}
        >
          <MenuItem label="Mis Pedidos" icon="receipt-outline" />
          <MenuItem label="Estadísticas" icon="bar-chart-outline" />
          <MenuItem label="Configuración" icon="settings-outline" />
        </View>

        {/* Logout button */}
        <Pressable
          style={{
            marginTop: 24,
            alignItems: 'center',
            borderRadius: 16,
            backgroundColor: '#fef2f2',
            paddingVertical: 16,
            minHeight: 56,
          }}
          onPress={handleLogout}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="log-out-outline" size={20} color="#DC2626" />
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#dc2626' }}>
              Cerrar Sesión
            </Text>
          </View>
        </Pressable>

        <Text style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: '#a3a3a3' }}>
          Aguaditas App v0.0.1
        </Text>
      </View>
    </View>
  );
}
