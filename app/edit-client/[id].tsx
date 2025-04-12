import { View, ScrollView } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import EditClientForm from '@/components/clients/edit-client/edit-client-form';
import BackButton from '@/components/ui/back-button';

export default function EditClient() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const clientId = Number(id);

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />
      <BackButton title="Editar cliente" />
      <View className="bg-white rounded-lg p-5 shadow-sm">
        <EditClientForm clientId={clientId} />
      </View>
    </ScrollView>
  );
}
