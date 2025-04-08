import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

interface ClientInfoProps {
  client: {
    name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    sub_address?: string;
    document_type: string;
    document_number: number;
  };
  loanStatus: string;
}

export default function ClientInfo({ client, loanStatus }: ClientInfoProps) {
  return (
    <View className="flex-col gap-6 bg-white p-5 border border-gray-100 rounded-xl">
      <Text className="text-xl font-geist-bold">Información del cliente</Text>
      <View className="flex-row items-center gap-3">
        <View className="w-14 h-14 bg-gray-200 rounded-full items-center justify-center">
          <Text className="font-geist-medium text-gray-600">
            {client?.name.charAt(0)}
            {client?.last_name.charAt(0)}
          </Text>
        </View>
        <View className="flex-col">
          <Text className="font-geist-bold text-lg">
            {client?.name} {client?.last_name}
          </Text>
          <View className="w-40 items-start shrink-0">
            <Text
              className={`px-2 py-1 rounded-full text-xs font-geist-medium ${
                loanStatus === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {loanStatus === 'active' ? 'Crédito activo' : 'Crédito pendiente'}
            </Text>
          </View>
        </View>
      </View>
      <View className="flex-col gap-3">
        <View className="flex-row items-center gap-2">
          <Ionicons name="id-card-outline" size={15} color="#6B7280" />
          <View className="flex-row">
            <Text className="font-geist-medium text-lg capitalize">
              {client?.document_type}
            </Text>
            <Text className="font-geist-medium text-lg">
              : {client?.document_number}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center gap-2">
          <Ionicons name="mail-outline" size={15} color="#6B7280" />
          <Text className="font-geist-medium text-lg">{client?.email}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Ionicons name="call-outline" size={15} color="#6B7280" />
          <Text className="font-geist-medium text-lg">{client?.phone}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Ionicons name="location-outline" size={15} color="#6B7280" />
          <Text className="font-geist-medium text-lg">
            {client?.address}
            {client?.sub_address ? `, ${client?.sub_address}` : ''}
          </Text>
        </View>
      </View>
      <Link href="/" className="p-4 border border-gray-200 rounded-lg" asChild>
        <TouchableOpacity>
          <Text className="text-center font-geist-bold">Ver perfil</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
