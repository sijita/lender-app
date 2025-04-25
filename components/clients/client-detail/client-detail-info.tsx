import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { IdCard, Mail, Map, Phone, SquarePen } from 'lucide-react-native';

export default function ClientDetailInfo({
  client,
}: {
  client: {
    id: number;
    name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    sub_address?: string;
    document_type: string;
    document_number: number;
    created_at: string;
  };
}) {
  return (
    <View className="flex-col gap-6 bg-white p-5 border border-gray-100 rounded-xl">
      <View className="flex-row justify-center items-center">
        <View className="w-16 h-16 bg-gray-200 rounded-full items-center justify-center">
          <Text className="font-geist-medium text-gray-600 text-xl">
            {client?.name?.split(' ')[0]?.charAt(0)}
            {client?.last_name?.split(' ')[1]?.charAt(0)}
          </Text>
        </View>
      </View>
      <View className="flex-col items-center">
        <Text className="font-geist-bold text-xl">
          {client?.name} {client?.last_name}
        </Text>
        <Text className="text-gray-500 font-geist-medium text-sm">
          Cliente desde{' '}
          {new Date(client?.created_at).toLocaleDateString('es-ES', {
            month: 'long',
            year: 'numeric',
          })}
        </Text>
      </View>
      <View className="flex-col gap-3">
        <View className="flex-row items-center gap-2">
          <Mail size={15} color="#6B7280" />
          <Text className="font-geist-medium text-lg">{client?.email}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Phone size={15} color="#6B7280" />
          <Text className="font-geist-medium text-lg">{client?.phone}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Map size={15} color="#6B7280" />
          <Text className="font-geist-medium text-lg">
            {client?.address}
            {client?.sub_address ? `, ${client?.sub_address}` : ''}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <IdCard size={15} color="#6B7280" />
          <View className="flex-row">
            <Text className="font-geist-medium text-lg capitalize">
              {client?.document_type}
            </Text>
            <Text className="font-geist-medium text-lg">
              : {client?.document_number}
            </Text>
          </View>
        </View>
      </View>
      <Link
        href={`/edit-client/${client?.id}`}
        className="bg-gray-800 py-4 rounded-lg"
        asChild
      >
        <TouchableOpacity className="flex-row items-center justify-center gap-2">
          <Text className="text-white text-center font-geist-medium">
            Editar cliente
          </Text>
          <SquarePen size={16} color="white" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}
