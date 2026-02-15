import type { Client } from '@/features/clients/api';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import * as React from 'react';
import { useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useClients } from '@/features/clients/api';

function ClientCard({ client }: { client: Client }) {
  const handleCall = () => Linking.openURL(`tel:${client.phone}`);
  const handleMap = () => {
    const encoded = encodeURIComponent(client.address);
    Linking.openURL(`https://maps.google.com/?q=${encoded}`);
  };

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
      <Text style={{ fontSize: 16, fontWeight: '600', color: '#1e1e1e' }}>
        {client.name}
      </Text>
      {client.phone
        ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Ionicons name="call-outline" size={14} color="#888" />
            <Text style={{ fontSize: 14, color: '#737373', marginLeft: 4 }}>
              {client.phone}
            </Text>
          </View>
        )
        : null}
      {client.address
        ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Ionicons name="location-outline" size={14} color="#888" />
            <Text style={{ fontSize: 14, color: '#737373', marginLeft: 4 }} numberOfLines={1}>
              {client.address}
            </Text>
          </View>
        )
        : null}

      <View style={{ marginTop: 12, flexDirection: 'row', gap: 12 }}>
        {client.phone
          ? (
            <Pressable
              style={{
                flex: 1,
                alignItems: 'center',
                borderRadius: 12,
                backgroundColor: '#ecfdf5',
                paddingVertical: 12,
                minHeight: 44,
              }}
              onPress={handleCall}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="call" size={16} color="#16A34A" />
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#059669' }}>Llamar</Text>
              </View>
            </Pressable>
          )
          : null}
        {client.address
          ? (
            <Pressable
              style={{
                flex: 1,
                alignItems: 'center',
                borderRadius: 12,
                backgroundColor: '#e6f2ff',
                paddingVertical: 12,
                minHeight: 44,
              }}
              onPress={handleMap}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="map" size={16} color="#2563EB" />
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#0066dd' }}>Mapa</Text>
              </View>
            </Pressable>
          )
          : null}
      </View>
    </View>
  );
}

export function ClientsScreen() {
  const [search, setSearch] = useState('');
  const { data: clients, isLoading } = useClients({ variables: { search } });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' }} edges={['top']}>
      <View style={{ backgroundColor: '#0077FF', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 }}>
        <Text style={{ marginBottom: 12, fontSize: 20, fontWeight: 'bold', color: '#fff' }}>Clientes</Text>
        <TextInput
          style={{
            borderRadius: 12,
            backgroundColor: 'rgba(255,255,255,0.2)',
            paddingHorizontal: 16,
            paddingVertical: 12,
            fontSize: 16,
            color: '#fff',
          }}
          placeholder="Buscar cliente..."
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
        />
      </View>

      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 12 }}>
        {isLoading
          ? (
            <ActivityIndicator
              size="large"
              color="#0077FF"
              style={{ marginTop: 40 }}
            />
          )
          : clients && clients.length > 0
            ? (
              <FlashList
                data={clients}
                renderItem={({ item }) => <ClientCard client={item} />}
                keyExtractor={item => String(item.id)}
              />
            )
            : (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="people-outline" size={48} color="#A3A3A3" />
                <Text style={{ marginTop: 16, fontSize: 18, fontWeight: '500', color: '#a3a3a3' }}>
                  No hay clientes
                </Text>
                <Text style={{ marginTop: 4, fontSize: 14, color: '#a3a3a3' }}>
                  {search ? 'Intenta con otra búsqueda' : 'Agrega tu primer cliente'}
                </Text>
              </View>
            )}
      </View>
    </SafeAreaView>
  );
}
