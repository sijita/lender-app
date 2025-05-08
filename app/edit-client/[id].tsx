import { View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import EditClientForm from '@/components/clients/edit-client/edit-client-form';
import BackButton from '@/components/ui/back-button';
import CustomSafeScreen from '@/components/ui/custom-safe-screen';

export default function EditClient() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const clientId = Number(id);

  return (
    <CustomSafeScreen>
      <Stack.Screen options={{ headerShown: false }} />
      <BackButton title="Editar cliente" />
      <EditClientForm clientId={clientId} />
    </CustomSafeScreen>
  );
}
