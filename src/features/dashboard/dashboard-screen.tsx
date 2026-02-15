import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as React from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { useAuthStore } from '@/features/auth/use-auth-store';
import { useOrders } from '@/features/orders/api';
import { useProducts } from '@/features/products/api';

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        borderRadius: 16,
        backgroundColor: '#fff',
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: color,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      }}
    >
      <Text style={{ fontSize: 12, fontWeight: '500', letterSpacing: 0.5, color: '#737373', textTransform: 'uppercase' }}>
        {title}
      </Text>
      <Text style={{ marginTop: 4, fontSize: 24, fontWeight: 'bold', color: '#1e1e1e' }}>
        {String(value)}
      </Text>
    </View>
  );
}

function OrderCard({ id, itemCount, status, total }: {
  id: number;
  itemCount: number;
  status: string;
  total: string;
}) {
  const isPending = status === 'pending';
  return (
    <View
      style={{
        marginBottom: 12,
        borderRadius: 16,
        backgroundColor: '#fff',
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1e1e1e' }}>
            Pedido #
            {id}
          </Text>
          <Text style={{ fontSize: 14, color: '#737373' }}>
            {itemCount}
            {' '}
            producto(s)
          </Text>
        </View>
        <View
          style={{
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 4,
            backgroundColor: isPending ? '#FFF7ED' : '#ECFDF5',
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: isPending ? '#F97316' : '#10B981',
            }}
          >
            {isPending ? 'Pendiente' : 'Entregado'}
          </Text>
        </View>
      </View>
      <Text style={{ marginTop: 8, fontSize: 18, fontWeight: 'bold', color: '#0077FF' }}>
        $
        {Number(total).toLocaleString()}
      </Text>
    </View>
  );
}

function EmptyState({ icon, text, hint }: { icon: keyof typeof Ionicons.glyphMap; text: string; hint?: string }) {
  return (
    <View style={{ alignItems: 'center', borderRadius: 16, backgroundColor: '#fff', paddingVertical: 48 }}>
      <Ionicons name={icon} size={48} color="#A3A3A3" />
      <Text style={{ marginTop: 12, fontSize: 16, fontWeight: '500', color: '#a3a3a3' }}>{text}</Text>
      {hint ? <Text style={{ marginTop: 4, fontSize: 14, color: '#a3a3a3' }}>{hint}</Text> : null}
    </View>
  );
}

function RepartidorDashboard() {
  const router = useRouter();
  const { data: orders, isLoading, refetch } = useOrders();

  const pendingOrders = orders?.filter(o => o.status === 'pending').length ?? 0;
  const deliveredOrders = orders?.filter(o => o.status === 'delivered').length ?? 0;

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      >
        <Text style={{ marginBottom: 16, fontSize: 18, fontWeight: '600', color: '#383838' }}>Resumen del Día</Text>
        <View style={{ marginBottom: 16, flexDirection: 'row', gap: 12 }}>
          <StatCard title="Pendientes" value={pendingOrders} color="#F97316" />
          <StatCard title="Entregados" value={deliveredOrders} color="#10B981" />
        </View>
        <StatCard title="Total Pedidos" value={orders?.length ?? 0} color="#0077FF" />

        <Text style={{ marginTop: 24, marginBottom: 12, fontSize: 18, fontWeight: '600', color: '#383838' }}>Últimos Pedidos</Text>
        {isLoading
          ? (
              <ActivityIndicator size="large" color="#0077FF" />
            )
          : orders && orders.length > 0
            ? (
                orders
                  .slice(0, 5)
                  .map(order => (
                    <OrderCard
                      key={order.id}
                      id={order.id}
                      itemCount={order.items?.length ?? 0}
                      status={order.status}
                      total={order.total_amount}
                    />
                  ))
              )
            : (
                <EmptyState icon="cube-outline" text="No hay pedidos aún" hint="Presiona + para crear uno nuevo" />
              )}
      </ScrollView>

      <Pressable
        style={{
          position: 'absolute',
          right: 24,
          bottom: 112,
          width: 64,
          height: 64,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 32,
          backgroundColor: '#0077FF',
          elevation: 8,
          shadowColor: '#0077FF',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        }}
        onPress={() => router.push('/orders/new')}
      >
        <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#fff' }}>+</Text>
      </Pressable>
    </View>
  );
}

function AdminDashboard() {
  const { data: orders, isLoading, refetch } = useOrders();
  const { data: products } = useProducts();

  const totalSales = orders?.reduce((sum, o) => sum + Number(o.total_amount), 0) ?? 0;
  const pendingOrders = orders?.filter(o => o.status === 'pending').length ?? 0;

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      >
        <Text style={{ marginBottom: 16, fontSize: 18, fontWeight: '600', color: '#383838' }}>Panel Administrativo</Text>
        <View style={{ marginBottom: 16, flexDirection: 'row', gap: 12 }}>
          <StatCard title="Ventas Totales" value={`$${totalSales.toLocaleString()}`} color="#10B981" />
          <StatCard title="Pendientes" value={pendingOrders} color="#F97316" />
        </View>
        <View style={{ marginBottom: 16, flexDirection: 'row', gap: 12 }}>
          <StatCard title="Productos" value={products?.length ?? 0} color="#0077FF" />
          <StatCard title="Pedidos" value={orders?.length ?? 0} color="#7C3AED" />
        </View>

        <Text style={{ marginTop: 16, marginBottom: 12, fontSize: 18, fontWeight: '600', color: '#383838' }}>Stock de Productos</Text>
        {products && products.length > 0
          ? (
              products.map(p => (
                <View
                  key={p.id}
                  style={{
                    marginBottom: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: 16,
                    backgroundColor: '#fff',
                    padding: 16,
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 2,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#1e1e1e' }}>{p.name}</Text>
                    <Text style={{ fontSize: 14, color: '#737373' }}>
                      {p.unit_type}
                      {' · SKU: '}
                      {p.sku}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#0077FF' }}>
                    $
                    {Number(p.sale_price).toLocaleString()}
                  </Text>
                </View>
              ))
            )
          : (
              <EmptyState icon="bar-chart-outline" text="No hay productos registrados" />
            )}
      </ScrollView>
    </View>
  );
}

export function DashboardScreen() {
  const user = useAuthStore.use.user();
  return user?.role === 'admin' ? <AdminDashboard /> : <RepartidorDashboard />;
}
