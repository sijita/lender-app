import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Link } from 'expo-router';
import useFetchClients from '@/actions/clients/use-fetch-clients';
import Error from '@/components/ui/error';
import ClientTypeTabs from './client-type-tabs';
import DynamicIcon from '@/components/ui/dynamic-icon';
import { ChevronDown, ChevronRight, Search } from 'lucide-react-native';
import Loading from '@/components/ui/loading';
import PaginationButtons from '../ui/pagination-buttons';

export default function ClientList() {
  const {
    clients,
    loading,
    error,
    statusFilter,
    orderBy,
    orderDirection,
    searchQuery,
    setOrderDirection,
    setStatusFilter,
    setSearchQuery,
    setOrderBy,
    refetch,
    page,
    setPage,
    pageSize,
    totalClients,
  } = useFetchClients();

  if (loading) {
    return <Loading loadingText="Cargando clientes..." />;
  }

  if (error) {
    return <Error error={error} refetch={refetch} />;
  }

  return (
    <View className="flex-col gap-5 p-5">
      <ClientTypeTabs
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        refetch={refetch}
        setPage={setPage}
        clientParams={{
          searchQuery,
          orderBy,
          orderDirection,
          status: statusFilter,
          page,
          pageSize,
        }}
      />
      <View className="flex-row gap-2 items-center">
        <View className="flex-row flex-1 gap-1 items-center px-3 bg-white rounded-xl border border-gray-100">
          <Search size={20} color="#6B7280" />
          <TextInput
            placeholder="Buscar cliente..."
            className="flex-1 text-base placeholder:font-geist-light sm:p-2"
            placeholderTextColor="#6B7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          className="flex-row gap-1 items-center px-4 py-2 bg-white rounded-xl border border-gray-100"
          onPress={() => {
            const newOrderBy = orderBy === 'name' ? 'document_number' : 'name';
            setOrderBy(newOrderBy);
            refetch({
              searchQuery,
              orderBy: newOrderBy,
              orderDirection,
              status: statusFilter,
            });
          }}
        >
          <Text className="text-black font-geist-medium">
            {orderBy === 'name' ? 'Nombre' : 'Cédula'}
          </Text>
          <ChevronDown size={16} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-white rounded-xl px-[8px] py-[8px] border border-gray-100"
          onPress={() => {
            const newDirection = orderDirection === 'desc' ? 'asc' : 'desc';
            setOrderDirection(newDirection);
            refetch({
              searchQuery,
              orderBy,
              orderDirection: newDirection,
              status: statusFilter,
            });
          }}
        >
          <DynamicIcon
            name={orderDirection === 'desc' ? 'ArrowDown' : 'ArrowUp'}
            size={15}
            color="#000"
          />
        </TouchableOpacity>
      </View>
      <ScrollView
        className="w-full"
        contentContainerClassName="sm:w-full"
        horizontal
      >
        <View className="p-4 w-full bg-white rounded-xl border border-gray-100">
          <View className="flex-row px-4 pb-4 border-b border-gray-200">
            <Text className="w-36 text-gray-500 sm:flex-1 font-geist-medium">
              Cédula
            </Text>
            <Text className="w-40 text-gray-500 sm:flex-1 font-geist-medium">
              Nombre
            </Text>
            <Text className="w-52 text-gray-500 sm:flex-1 font-geist-medium">
              Contacto
            </Text>
            <Text className="w-40 text-right text-gray-500 sm:flex-1 font-geist-medium">
              Pendiente
            </Text>
            <Text className="w-40 text-right text-gray-500 sm:flex-1 font-geist-medium">
              Estado
            </Text>
            <View className="w-16" />
          </View>
          {clients.length === 0 ? (
            <View className="items-center py-8">
              <Text className="text-gray-500">No se encontraron clientes</Text>
            </View>
          ) : (
            clients.map(client => (
              <Link key={client.id} href={`/client/${client.id}`} asChild>
                <TouchableOpacity className="flex-row items-center px-4 py-3 border-b border-gray-100">
                  <Text className="w-36 sm:flex-1 font-geist-medium">
                    {client.documentNumber}
                  </Text>
                  <Text className="w-40 sm:flex-1 font-geist-medium">
                    {client.name} {client.lastName}
                  </Text>
                  <View className="w-52 sm:flex-1">
                    <Text className="text-gray-600 font-geist-regular">
                      {client.email}
                    </Text>
                    <Text className="text-sm text-gray-500 font-geist-regular">
                      {client.phone}
                    </Text>
                  </View>
                  <Text className="w-40 text-right sm:flex-1 font-geist-semibold">
                    ${(client as any).outstanding?.toLocaleString() ?? '0'}
                  </Text>
                  <View className="items-end w-40 sm:flex-1 shrink-0">
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
                  <View className="items-end w-16">
                    <ChevronRight size={20} color="#9CA3AF" />
                  </View>
                </TouchableOpacity>
              </Link>
            ))
          )}
        </View>
      </ScrollView>
      <PaginationButtons
        page={page}
        setPage={setPage}
        totalClients={totalClients}
        pageSize={pageSize}
      />
    </View>
  );
}
