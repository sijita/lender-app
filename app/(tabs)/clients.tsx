import { View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ClientList from '@/components/clients/client-list';

export default function Clients() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="flex-row justify-between items-center px-4 py-6 bg-white border-b border-gray-200">
        <Text className="text-2xl font-geist-bold">Clientes</Text>
        <TouchableOpacity
          className="flex-row items-center gap-1 bg-black px-4 py-2 rounded-full"
          onPress={() => router.push('/new-client')}
        >
          <Text className="text-white font-geist-medium">Añadir cliente</Text>
          <Ionicons name="add" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <ClientList />
    </ScrollView>
  );
}
