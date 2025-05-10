import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { ArrowRight, IdCard, Mail, Map, Phone } from 'lucide-react-native';

export default function ClientInfo({
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
  };
}) {
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
        <Text className="font-geist-bold text-lg">
          {client?.name} {client?.last_name}
        </Text>
      </View>
      <View className="flex-col gap-3">
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
      </View>
      <Link
        href={`/client/${client.id}`}
        className="p-4 bg-black rounded-lg"
        asChild
      >
        <TouchableOpacity className="flex-row items-center justify-center gap-2">
          <Text className="text-center text-white font-geist-bold">
            Ver perfil
          </Text>
          <ArrowRight size={18} color="#fff" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}
