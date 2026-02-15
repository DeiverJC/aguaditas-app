import type { Order } from '@/features/orders/api';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as React from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  Text as RNText,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useOrders } from '@/features/orders/api';

function OrderCard({ order }: { order: Order }) {
  const isPending = order.status === 'pending';

  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View>
          <RNText style={{ fontSize: 16, fontWeight: '600', color: '#1a1a1a' }}>
            Pedido #
            {order.id}
          </RNText>
          <RNText style={{ fontSize: 14, color: '#888', marginTop: 4 }}>
            {order.items?.length ?? 0}
            {' '}
            producto(s)
          </RNText>
        </View>
        <View
          style={{
            backgroundColor: isPending ? '#FFF7ED' : '#ECFDF5',
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 4,
          }}
        >
          <RNText
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: isPending ? '#F97316' : '#10B981',
            }}
          >
            {isPending ? 'Pendiente' : 'Entregado'}
          </RNText>
        </View>
      </View>
      <RNText style={{ fontSize: 18, fontWeight: 'bold', color: '#0077FF', marginTop: 8 }}>
        $
        {Number(order.total_amount).toLocaleString()}
      </RNText>
      <RNText style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>
        {new Date(order.created_at).toLocaleDateString()}
      </RNText>
    </View>
  );
}

export function OrdersScreen() {
  const router = useRouter();
  const { data: orders, isLoading, refetch, error } = useOrders();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' }} edges={['top']}>
      <View style={{ backgroundColor: '#0077FF', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 }}>
        <RNText style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>Pedidos</RNText>
      </View>

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 16, paddingTop: 12 }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        {isLoading
          ? <ActivityIndicator size="large" color="#0077FF" style={{ marginTop: 40 }} />
          : error
            ? (
                <RNText style={{ textAlign: 'center', marginTop: 40, color: 'red' }}>
                  Error:
                  {' '}
                  {error.message}
                </RNText>
              )
            : orders && orders.length > 0
              ? orders.map(order => <OrderCard key={order.id} order={order} />)
              : (
                  <View style={{ alignItems: 'center', paddingTop: 80 }}>
                    <Ionicons name="receipt-outline" size={48} color="#A3A3A3" />
                    <RNText style={{ fontSize: 18, color: '#aaa', marginTop: 16 }}>No hay pedidos</RNText>
                  </View>
                )}
      </ScrollView>

      {/* FAB - Nuevo Pedido */}
      <Pressable
        onPress={() => router.push('/orders/new')}
        style={{
          position: 'absolute',
          right: 24,
          bottom: 40,
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: '#0077FF',
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 8,
          shadowColor: '#0077FF',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        }}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </Pressable>
    </SafeAreaView>
  );
}
