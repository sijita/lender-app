import { View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ClientList from '@/components/clients/client-list';

const mockClients = [
  {
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    outstanding: 500,
    status: 'A' as const,
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '(555) 234-5678',
    outstanding: 1200,
    status: 'P' as const,
  },
  {
    name: 'Michael Brown',
    email: 'mbrown@example.com',
    phone: '(555) 345-6789',
    outstanding: 350,
    status: 'A' as const,
  },
  {
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    phone: '(555) 456-7890',
    outstanding: 800,
    status: 'A' as const,
  },
  {
    name: 'Robert Wilson',
    email: 'rwilson@example.com',
    phone: '(555) 567-8901',
    outstanding: 250,
    status: 'P' as const,
  },
];

export default function Clients() {
  const handleClientPress = (client: any) => {
    // Handle client selection
    console.log('Selected client:', client);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="flex-row justify-between items-center px-4 py-6 bg-white border-b border-gray-200">
        <Text className="text-2xl font-geist-bold">Clientes</Text>
        <TouchableOpacity
          className="flex-row items-center gap-1 bg-black px-4 py-2 rounded-full"
          onPress={() => console.log('Add new client')}
        >
          <Text className="text-white font-geist-medium">Añadir cliente</Text>
          <Ionicons name="add" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <ClientList clients={mockClients} onClientPress={handleClientPress} />
    </ScrollView>
  );
}
