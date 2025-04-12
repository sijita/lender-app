import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BackButton from '@/components/ui/back-button';
import ClientDetailInfo from '@/components/clients/client-detail/client-detail-info';
import ClientPaymentHistory from '@/components/clients/client-detail/client-payment-history';
import ClientActivityHistory from '@/components/clients/client-detail/client-activity-history';
import ClientDetailTabs from '@/components/clients/client-detail/client-detail-tabs';
import ClientQuickActions from '@/components/clients/client-detail/client-quick-actions';

import useFetchClientDetail from '@/actions/clients/use-fetch-client-detail';

export default function ClientDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { client, loading, error, refetch } = useFetchClientDetail(Number(id));
  const router = useRouter();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-2 text-gray-500">Cargando detalles...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-lg font-geist-medium text-gray-800">
          Error al cargar los datos del cliente
        </Text>
        <TouchableOpacity
          className="mt-4 flex-row items-center gap-2 bg-black px-4 py-2 rounded-full"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={16} color="white" />
          <Text className="text-white font-geist-medium">Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!client) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-lg font-geist-medium text-gray-800">
          Cliente no encontrado
        </Text>
        <TouchableOpacity
          className="mt-4 flex-row items-center gap-2 bg-black px-4 py-2 rounded-full"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={16} color="white" />
          <Text className="text-white font-geist-medium">Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />
      <BackButton title={`Cliente #${client.id}`} />

      <View className="p-5 flex-col gap-5">
        <ClientDetailInfo client={client} />
        <ClientDetailTabs client={client} />
        <ClientActivityHistory activities={client.activity_history} />
        <ClientQuickActions />
      </View>
    </ScrollView>
  );
}
