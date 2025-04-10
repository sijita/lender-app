import { FetchClientsParams } from '@/actions/clients/use-fetch-clients';
import { View, Text, TouchableOpacity } from 'react-native';

export default function ClientTypeTabs({
  statusFilter,
  setStatusFilter,
  refetch,
  clientParams,
}: {
  statusFilter: string;
  setStatusFilter: React.Dispatch<
    React.SetStateAction<'all' | 'pending' | 'defaulted' | 'completed'>
  >;
  refetch: (queryParams?: FetchClientsParams) => Promise<void>;
  clientParams: {
    searchQuery: string;
    orderBy: string;
    orderDirection: 'desc' | 'asc';
    status: 'all' | 'pending' | 'defaulted' | 'completed';
  };
}) {
  return (
    <View className="flex-row bg-gray-100 rounded-lg p-1 overflow-auto">
      <TouchableOpacity
        onPress={() => {
          setStatusFilter('all');
          refetch({
            ...clientParams,
            status: 'all',
          });
        }}
        className={`flex-1 py-3 rounded-lg ${
          statusFilter === 'all' ? 'bg-white' : ''
        }`}
      >
        <Text
          className={`text-center font-geist-semibold ${
            statusFilter === 'all' ? 'text-black' : 'text-gray-500'
          }`}
        >
          Todos
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setStatusFilter('pending');
          refetch({
            ...clientParams,
            status: 'pending',
          });
        }}
        className={`flex-1 py-3 rounded-lg ${
          statusFilter === 'pending' ? 'bg-white' : ''
        }`}
      >
        <Text
          className={`text-center font-geist-semibold ${
            statusFilter === 'pending' ? 'text-black' : 'text-gray-500'
          }`}
        >
          Pendientes
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setStatusFilter('defaulted');
          refetch({
            ...clientParams,
            status: 'defaulted',
          });
        }}
        className={`flex-1 py-3 rounded-lg ${
          statusFilter === 'defaulted' ? 'bg-white' : ''
        }`}
      >
        <Text
          className={`text-center font-geist-semibold ${
            statusFilter === 'defaulted' ? 'text-black' : 'text-gray-500'
          }`}
        >
          En mora
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setStatusFilter('completed');
          refetch({
            ...clientParams,
            status: 'completed',
          });
        }}
        className={`flex-1 py-3 rounded-lg ${
          statusFilter === 'completed' ? 'bg-white' : ''
        }`}
      >
        <Text
          className={`text-center font-geist-semibold ${
            statusFilter === 'completed' ? 'text-black' : 'text-gray-500'
          }`}
        >
          Libres
        </Text>
      </TouchableOpacity>
    </View>
  );
}
