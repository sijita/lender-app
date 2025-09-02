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
    <View className="flex-col gap-6 p-5 bg-white rounded-xl border border-gray-100">
      <Text className="text-xl font-geist-bold">Información del cliente</Text>
      <View className="flex-row gap-3 items-center">
        <View className="justify-center items-center w-14 h-14 bg-gray-200 rounded-full">
          <Text className="text-gray-600 truncate break-all font-geist-medium text-balance wrap-break-word">
            {client?.name.charAt(0)}
            {client?.last_name.charAt(0)}
          </Text>
        </View>
        <Text
          className="flex-1 text-lg truncate font-geist-semibold"
          numberOfLines={1}
        >
          {client?.name ?? '-'} {client?.last_name ?? '-'}
        </Text>
      </View>
      <View className="flex-col gap-3">
        <View className="flex-row gap-2 items-center">
          <IdCard size={15} color="#6B7280" />
          <View className="flex-row">
            <Text className="text-lg capitalize font-geist-medium">
              {client?.document_type}
            </Text>
            <Text className="text-lg font-geist-medium">
              : {client?.document_number}
            </Text>
          </View>
        </View>
        <View className="flex-row gap-2 items-center">
          <Mail size={15} color="#6B7280" />
          <Text className="text-lg font-geist-medium">
            {client?.email ?? '-'}
          </Text>
        </View>
        <View className="flex-row gap-2 items-center">
          <Phone size={15} color="#6B7280" />
          <Text className="text-lg font-geist-medium">
            {client?.phone ?? '-'}
          </Text>
        </View>
        <View className="flex-row gap-2 items-center">
          <Map size={15} color="#6B7280" />
          <Text className="text-lg font-geist-medium">
            {client?.address ?? '-'}
            {client?.sub_address ? `, ${client?.sub_address}` : ''}
          </Text>
        </View>
      </View>
      <Link
        href={`/client/${client.id}`}
        className="p-4 bg-black rounded-xl"
        asChild
      >
        <TouchableOpacity className="flex-row gap-2 justify-center items-center">
          <Text className="text-center text-white font-geist-bold">
            Ver perfil
          </Text>
          <ArrowRight size={18} color="#fff" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}
