import { View, Text, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import BackButton from '@/components/ui/back-button';
import ClientDetailInfo from '@/components/clients/client-detail/client-detail-info';
import ClientActivityHistory from '@/components/clients/client-detail/client-activity-history';
import ClientDetailTabs from '@/components/clients/client-detail/client-detail-tabs';
import ClientQuickActions from '@/components/clients/client-detail/client-quick-actions';
import useFetchClientDetail from '@/actions/clients/use-fetch-client-detail';
import { ArrowLeft } from 'lucide-react-native';
import CustomSafeScreen from '@/components/ui/custom-safe-screen';
import Loading from '@/components/ui/loading';
import Error from '@/components/ui/error';

export default function ClientDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { client, loading, error, refetch } = useFetchClientDetail(Number(id));
  const router = useRouter();

  if (loading) {
    return <Loading loadingText="Cargando detalles del cliente..." />;
  }

  if (error) {
    return <Error error={error} refetch={refetch} />;
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
          <ArrowLeft size={16} color="white" />
          <Text className="text-white font-geist-medium">Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <CustomSafeScreen>
      <Stack.Screen options={{ headerShown: false }} />
      <BackButton title={`Cliente #${client?.id}`} />
      <View className="p-5 flex-col gap-5">
        <ClientDetailInfo client={client} />
        <ClientDetailTabs client={client} />
        <ClientActivityHistory activities={client?.activity_history} />
        <ClientQuickActions />
      </View>
    </CustomSafeScreen>
  );
}
