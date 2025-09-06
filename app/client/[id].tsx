import { View, Text, TouchableOpacity, Platform } from 'react-native';
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
        <Text className="text-lg text-gray-800 font-geist-medium">
          Cliente no encontrado
        </Text>
        <TouchableOpacity
          className="flex-row gap-2 items-center px-4 py-2 mt-4 bg-black rounded-full"
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
      <View className="flex-col gap-5 p-5 sm:flex-row">
        <View className="flex-col gap-5">
          <ClientDetailInfo client={client} />
          {Platform.OS === 'web' && <ClientQuickActions clientId={id} />}
        </View>
        <ClientDetailTabs client={client} />
        <ClientActivityHistory activities={client?.activity_history} />
        {Platform.OS !== 'web' && <ClientQuickActions clientId={id} />}
      </View>
    </CustomSafeScreen>
  );
}
