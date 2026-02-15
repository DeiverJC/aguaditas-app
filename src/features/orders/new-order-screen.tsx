import type { Client } from '@/features/clients/api';
import type { Product } from '@/features/products/api';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text as RNText,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthStore } from '@/features/auth/use-auth-store';
import { useClients } from '@/features/clients/api';
import { useCreateOrder } from '@/features/orders/api';
import { useProducts } from '@/features/products/api';
import { queryClient } from '@/lib/api';

type OrderItemState = {
  product_id: number;
  quantity: number;
  product: Product;
};

function StepHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <View style={{ backgroundColor: '#0077FF', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable onPress={onBack} style={{ flexDirection: 'row', alignItems: 'center', minHeight: 44 }}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
          <RNText style={{ color: '#fff', fontWeight: '600', fontSize: 16, marginLeft: 4 }}>Atrás</RNText>
        </Pressable>
        <RNText style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>{title}</RNText>
        <View style={{ width: 60 }} />
      </View>
    </View>
  );
}

function ClientCard({ client, onSelect }: { client: Client; onSelect: () => void }) {
  return (
    <Pressable
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
        minHeight: 56,
      }}
      onPress={onSelect}
    >
      <RNText style={{ fontSize: 16, fontWeight: '600', color: '#1a1a1a' }}>{client.name}</RNText>
      {client.phone
        ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <Ionicons name="call-outline" size={14} color="#888" />
              <RNText style={{ fontSize: 14, color: '#888', marginLeft: 4 }}>{client.phone}</RNText>
            </View>
          )
        : null}
      {client.address
        ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <Ionicons name="location-outline" size={14} color="#888" />
              <RNText style={{ fontSize: 14, color: '#888', marginLeft: 4 }} numberOfLines={1}>{client.address}</RNText>
            </View>
          )
        : null}
    </Pressable>
  );
}

function ClientStep({ onSelect, onBack }: { onSelect: (client: Client) => void; onBack: () => void }) {
  const { data: clients, isLoading } = useClients({ variables: {} });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' }} edges={['top']}>
      <StepHeader title="Paso 1: Cliente" onBack={onBack} />
      <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 12 }}>
        {isLoading
          ? <ActivityIndicator size="large" color="#0077FF" style={{ marginTop: 40 }} />
          : clients && clients.length > 0
            ? clients.map(c => <ClientCard key={c.id} client={c} onSelect={() => onSelect(c)} />)
            : (
                <View style={{ alignItems: 'center', paddingTop: 80 }}>
                  <Ionicons name="people-outline" size={48} color="#A3A3A3" />
                  <RNText style={{ fontSize: 18, color: '#aaa', marginTop: 16 }}>No hay clientes</RNText>
                </View>
              )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ProductCard({ product, quantity, onUpdate }: {
  product: Product;
  quantity: number;
  onUpdate: (delta: number) => void;
}) {
  return (
    <View style={{
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
        <View style={{ flex: 1 }}>
          <RNText style={{ fontSize: 16, fontWeight: '600', color: '#1a1a1a' }}>{product.name}</RNText>
          <RNText style={{ fontSize: 14, color: '#888', marginTop: 2 }}>
            {product.unit_type}
            {' · $'}
            {Number(product.sale_price).toLocaleString()}
          </RNText>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Pressable
            onPress={() => onUpdate(-1)}
            style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name="remove" size={20} color="#555" />
          </Pressable>
          <RNText style={{ fontSize: 18, fontWeight: 'bold', color: '#1a1a1a', width: 30, textAlign: 'center' }}>
            {quantity}
          </RNText>
          <Pressable
            onPress={() => onUpdate(1)}
            style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#0077FF', alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name="add" size={20} color="#fff" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function BottomBar({ children }: { children: React.ReactNode }) {
  return (
    <View style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#fff',
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 32,
      borderTopWidth: 1,
      borderTopColor: '#E5E5E5',
    }}
    >
      {children}
    </View>
  );
}

function ProductStep({ client, items, totalAmount, onUpdateQuantity, onContinue, onBack }: {
  client: Client;
  items: OrderItemState[];
  totalAmount: number;
  onUpdateQuantity: (productId: number, delta: number, product: Product) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  const { data: products, isLoading } = useProducts();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' }} edges={['top']}>
      <StepHeader title="Paso 2: Productos" onBack={onBack} />
      <RNText style={{ paddingHorizontal: 16, paddingTop: 8, fontSize: 14, color: '#888' }}>
        Cliente:
        {' '}
        {client.name}
      </RNText>
      <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 12 }} contentContainerStyle={{ paddingBottom: 120 }}>
        {isLoading
          ? <ActivityIndicator size="large" color="#0077FF" style={{ marginTop: 40 }} />
          : products && products.length > 0
            ? products.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  quantity={items.find(i => i.product_id === p.id)?.quantity ?? 0}
                  onUpdate={delta => onUpdateQuantity(p.id, delta, p)}
                />
              ))
            : (
                <View style={{ alignItems: 'center', paddingTop: 80 }}>
                  <Ionicons name="cube-outline" size={48} color="#A3A3A3" />
                  <RNText style={{ fontSize: 18, color: '#aaa', marginTop: 16 }}>No hay productos</RNText>
                </View>
              )}
      </ScrollView>
      {items.length > 0
        ? (
            <BottomBar>
              <Pressable
                onPress={onContinue}
                style={{ backgroundColor: '#0077FF', borderRadius: 16, paddingVertical: 16, alignItems: 'center', minHeight: 56 }}
              >
                <RNText style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>
                  Continuar · $
                  {totalAmount.toLocaleString()}
                </RNText>
              </Pressable>
            </BottomBar>
          )
        : null}
    </SafeAreaView>
  );
}

function CheckoutItemRow({ item }: { item: OrderItemState }) {
  return (
    <View style={{
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      elevation: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
    >
      <View style={{ flex: 1 }}>
        <RNText style={{ fontSize: 16, fontWeight: '600', color: '#1a1a1a' }}>{item.product.name}</RNText>
        <RNText style={{ fontSize: 14, color: '#888', marginTop: 2 }}>
          {item.quantity}
          {' × $'}
          {Number(item.product.sale_price).toLocaleString()}
        </RNText>
      </View>
      <RNText style={{ fontSize: 18, fontWeight: 'bold', color: '#1a1a1a' }}>
        $
        {(item.quantity * Number(item.product.sale_price)).toLocaleString()}
      </RNText>
    </View>
  );
}

function CheckoutStep({ client, items, totalAmount, onSubmit, isPending, onBack }: {
  client: Client;
  items: OrderItemState[];
  totalAmount: number;
  onSubmit: () => void;
  isPending: boolean;
  onBack: () => void;
}) {
  const user = useAuthStore.use.user();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' }} edges={['top']}>
      <StepHeader title="Resumen" onBack={onBack} />
      <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 12 }} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, elevation: 1 }}>
          <RNText style={{ fontSize: 12, fontWeight: '500', color: '#888', textTransform: 'uppercase' }}>Cliente</RNText>
          <RNText style={{ fontSize: 16, fontWeight: '600', color: '#1a1a1a', marginTop: 4 }}>{client.name}</RNText>
        </View>

        <RNText style={{ fontSize: 18, fontWeight: '600', color: '#1a1a1a', marginBottom: 12 }}>Productos</RNText>
        {items.map(item => <CheckoutItemRow key={item.product_id} item={item} />)}

        <View style={{ backgroundColor: '#EBF5FF', borderRadius: 16, padding: 16, marginTop: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <RNText style={{ fontSize: 18, fontWeight: '600', color: '#1a1a1a' }}>Total</RNText>
            <RNText style={{ fontSize: 24, fontWeight: 'bold', color: '#0077FF' }}>
              $
              {totalAmount.toLocaleString()}
            </RNText>
          </View>
        </View>

        <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16, marginTop: 16, elevation: 1 }}>
          <RNText style={{ fontSize: 12, fontWeight: '500', color: '#888', textTransform: 'uppercase' }}>Repartidor</RNText>
          <RNText style={{ fontSize: 16, fontWeight: '600', color: '#1a1a1a', marginTop: 4 }}>{user?.name ?? 'Sin asignar'}</RNText>
        </View>
      </ScrollView>

      <BottomBar>
        <Pressable
          onPress={onSubmit}
          disabled={isPending}
          style={{
            backgroundColor: '#10B981',
            borderRadius: 16,
            paddingVertical: 16,
            alignItems: 'center',
            minHeight: 56,
            opacity: isPending ? 0.7 : 1,
          }}
        >
          {isPending
            ? <ActivityIndicator color="#fff" />
            : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="checkmark-circle" size={22} color="#fff" />
                  <RNText style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>Finalizar Entrega</RNText>
                </View>
              )}
        </Pressable>
      </BottomBar>
    </SafeAreaView>
  );
}

export function NewOrderScreen() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItemState[]>([]);
  const createOrder = useCreateOrder();

  const updateQuantity = useCallback((productId: number, delta: number, product: Product) => {
    setOrderItems((prev) => {
      const existing = prev.find(i => i.product_id === productId);
      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0) {
          return prev.filter(i => i.product_id !== productId);
        }
        return prev.map(i => (i.product_id === productId ? { ...i, quantity: newQty } : i));
      }
      if (delta > 0) {
        return [...prev, { product_id: productId, quantity: 1, product }];
      }
      return prev;
    });
  }, []);

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.quantity * Number(item.product.sale_price),
    0,
  );

  const handleSubmit = () => {
    if (!selectedClient) {
      return;
    }
    createOrder.mutate(
      { client_id: selectedClient.id, items: orderItems.map(i => ({ product_id: i.product_id, quantity: i.quantity })) },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['orders'] });
          Alert.alert('Pedido creado', 'El pedido se registró exitosamente', [
            { text: 'OK', onPress: () => router.back() },
          ]);
        },
        onError: () => Alert.alert('Error', 'No se pudo crear el pedido.'),
      },
    );
  };

  if (step === 1) {
    return (
      <ClientStep
        onSelect={(c) => {
          setSelectedClient(c);
          setStep(2);
        }}
        onBack={() => router.back()}
      />
    );
  }

  if (step === 2) {
    return (
      <ProductStep
        client={selectedClient!}
        items={orderItems}
        totalAmount={totalAmount}
        onUpdateQuantity={updateQuantity}
        onContinue={() => setStep(3)}
        onBack={() => setStep(1)}
      />
    );
  }

  return (
    <CheckoutStep
      client={selectedClient!}
      items={orderItems}
      totalAmount={totalAmount}
      onSubmit={handleSubmit}
      isPending={createOrder.isPending}
      onBack={() => setStep(2)}
    />
  );
}
