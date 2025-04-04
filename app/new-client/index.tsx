import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import NewClientForm from '@/components/clients/new-clients/new-client-form';

export default function NewClient() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-row gap-5 items-center px-4 py-6 bg-white border-b border-gray-200">
        <TouchableOpacity
          className="flex-row items-center gap-1 bg-black px-5 py-1 rounded-full"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <Text className="text-2xl font-geist-bold">Agregar Cliente</Text>
      </View>
      <View className="bg-white rounded-lg p-5 shadow-sm">
        <NewClientForm />
      </View>
    </ScrollView>
  );
}
