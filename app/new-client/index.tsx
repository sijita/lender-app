import { Stack } from 'expo-router';
import NewClientForm from '@/components/clients/new-clients/new-client-form';
import BackButton from '@/components/ui/back-button';
import CustomSafeScreen from '@/components/ui/custom-safe-screen';

export default function NewClient() {
  return (
    <CustomSafeScreen>
      <Stack.Screen options={{ headerShown: false }} />
      <BackButton title="Nuevo cliente" />
      <NewClientForm />
    </CustomSafeScreen>
  );
}
