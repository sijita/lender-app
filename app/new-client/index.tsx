import { View, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import NewClientForm from '@/components/clients/new-clients/new-client-form';
import BackButton from '@/components/ui/back-button';

export default function NewClient() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />
      <BackButton title="Nuevo cliente" />
      <View className="bg-white rounded-lg p-5 shadow-sm">
        <NewClientForm />
      </View>
    </ScrollView>
  );
}
