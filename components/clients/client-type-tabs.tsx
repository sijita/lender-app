import { FetchClientsParams } from '@/actions/clients/use-fetch-clients';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

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
  const tabs = [
    { id: 'all', label: 'Todos' },
    { id: 'pending', label: 'Pendientes' },
    { id: 'defaulted', label: 'En mora' },
    { id: 'completed', label: 'Libres' },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="border-b border-gray-200"
    >
      <View className="flex-row">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => {
              setStatusFilter(tab.id as any);
              refetch({
                ...clientParams,
                status: tab.id as any,
              });
            }}
            className={`px-5 py-4 ${
              statusFilter === tab.id ? 'border-b-2 border-black' : ''
            }`}
          >
            <Text
              className={`font-geist-semibold ${
                statusFilter === tab.id ? 'text-black' : 'text-gray-500'
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
