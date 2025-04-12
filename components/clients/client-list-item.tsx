import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

export default function ClientListItem({
  client,
}: {
  client: {
    id: number;
    name: string;
    last_name: string;
    email: string;
    phone: string;
    document_type: string;
    document_number: number;
    status?: string;
  };
}) {
  return (
    <Link href={`/client/${client.id}`} asChild>
      <TouchableOpacity className="flex-row justify-between items-center p-4 bg-white rounded-lg border border-gray-100 mb-3">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center">
            <Text className="font-geist-medium text-gray-600">
              {client.name.charAt(0)}
              {client.last_name.charAt(0)}
            </Text>
          </View>
          <View>
            <Text className="font-geist-medium text-lg">
              {client.name} {client.last_name}
            </Text>
            <Text className="text-gray-500">
              {client.document_type}: {client.document_number}
            </Text>
          </View>
        </View>

        {client.status && (
          <View className="flex-row items-center gap-2">
            <Text
              className={`px-2 py-1 rounded-full text-xs font-geist-medium ${
                client.status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : client.status === 'defaulted'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {client.status === 'completed'
                ? 'Libre'
                : client.status === 'defaulted'
                ? 'En Mora'
                : 'Pendiente'}
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#6B7280" />
          </View>
        )}

        {!client.status && (
          <Ionicons name="chevron-forward" size={16} color="#6B7280" />
        )}
      </TouchableOpacity>
    </Link>
  );
}
