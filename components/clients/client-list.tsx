import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import useFetchClients from '@/actions/clients/use-fetch-clients';
import Error from '@/components/ui/error';
import ClientTypeTabs from './client-type-tabs';

export default function ClientList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [orderBy, setOrderBy] = useState('name');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'pending' | 'defaulted' | 'completed'
  >('all');

  const clientParams = {
    searchQuery,
    orderBy,
    orderDirection,
    status: statusFilter,
  };

  const { clients, loading, error, refetch } = useFetchClients(clientParams);

  useEffect(() => {
    const timer = setTimeout(() => {
      refetch({
        ...clientParams,
        searchQuery,
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (loading) {
    return (
      <View className="min-h-screen flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-2 text-gray-500">Cargando clientes...</Text>
      </View>
    );
  }

  if (error) <Error error={error} refetch={refetch} />;

  return (
    <View className="p-5 flex-col gap-5">
      <ClientTypeTabs
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        refetch={refetch}
        clientParams={clientParams}
      />
      <View className="flex-row items-center gap-2">
        <View className="flex-row items-center gap-1 flex-1 bg-white rounded-lg px-3 border border-gray-100">
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            placeholder="Buscar cliente..."
            className="flex-1 text-base placeholder:font-geist-light"
            placeholderTextColor="#6B7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          className="flex-row items-center gap-1 bg-white rounded-lg px-4 py-2 border border-gray-100"
          onPress={() => {
            const newOrderBy = orderBy === 'name' ? 'document_number' : 'name';
            setOrderBy(newOrderBy);
            refetch({
              ...clientParams,
              orderBy: newOrderBy,
              orderDirection,
            });
          }}
        >
          <Text className="text-black font-geist-medium">
            {orderBy === 'name' ? 'Nombre' : 'Cédula'}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-white rounded-lg px-[8px] py-[8px] border border-gray-100"
          onPress={() => {
            const newDirection = orderDirection === 'desc' ? 'asc' : 'desc';
            setOrderDirection(newDirection);
            refetch({
              ...clientParams,
              orderBy,
              orderDirection: newDirection,
            });
          }}
        >
          <Ionicons
            name={
              orderDirection === 'desc'
                ? 'arrow-down-outline'
                : 'arrow-up-outline'
            }
            size={15}
            color="#000"
          />
        </TouchableOpacity>
      </View>
      <ScrollView horizontal className="w-full">
        <View className="bg-white rounded-xl p-4 border border-gray-100">
          <View className="flex-row px-4 pb-4 border-b border-gray-200">
            <Text className="w-36 font-geist-medium text-gray-500">Cédula</Text>
            <Text className="w-40 font-geist-medium text-gray-500">Nombre</Text>
            <Text className="w-52 font-geist-medium text-gray-500">
              Contacto
            </Text>
            <Text className="w-40 font-geist-medium text-gray-500 text-right">
              Pendiente
            </Text>
            <Text className="w-40 font-geist-medium text-gray-500 text-right">
              Estado
            </Text>
            <View className="w-16" />
          </View>
          {clients.length === 0 ? (
            <View className="py-8 items-center">
              <Text className="text-gray-500">No se encontraron clientes</Text>
            </View>
          ) : (
            clients.map((client) => (
              <TouchableOpacity
                key={client.id}
                // onPress={() => onClientPress(client)}
                className="flex-row items-center px-4 py-3 border-b border-gray-100"
              >
                <Text className="w-36 font-geist-medium">
                  {client.documentNumber}
                </Text>
                <Text className="w-40 font-geist-medium">
                  {client.name} {client.lastName}
                </Text>
                <View className="w-52">
                  <Text className="text-gray-600 font-geist-regular">
                    {client.email}
                  </Text>
                  <Text className="text-gray-500 text-sm font-geist-regular">
                    {client.phone}
                  </Text>
                </View>
                <Text className="w-40 font-geist-semibold text-right">
                  ${(client as any).outstanding?.toLocaleString() ?? '0'}
                </Text>
                <View className="w-40 items-end shrink-0">
                  <Text
                    className={`px-2 py-1 rounded-full text-xs font-geist-medium ${
                      (client as any).status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : (client as any).status === 'defaulted'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {(client as any).status === 'defaulted'
                      ? 'En mora'
                      : (client as any).status === 'pending'
                      ? 'Pendiente'
                      : 'Libre'}
                  </Text>
                </View>
                <View className="w-16 items-end">
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
