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
    <View className="flex-col gap-6 p-5 bg-white rounded-xl border border-gray-100">
      <View className="flex-col gap-3">
        <View className="flex-row justify-center items-center">
          <View className="justify-center items-center w-16 h-16 bg-gray-200 rounded-full">
            <Text className="text-xl text-gray-600 font-geist-medium">
              {client?.name?.split(' ')[0]?.charAt(0)}
              {client?.last_name?.split(' ')[1]?.charAt(0)}
            </Text>
          </View>
        </View>
        <View className="flex-col gap-2 items-center">
          <Text className="text-xl text-center font-geist-bold">
            {client?.name} {client?.last_name}
          </Text>
          <Text className="text-sm text-gray-500 font-geist-medium">
            Cliente desde{' '}
            {new Date(client?.created_at).toLocaleDateString('es-ES', {
              month: 'long',
              year: 'numeric',
            })}
          </Text>
        </View>
      </View>
      <View className="flex-col gap-3">
        <View className="flex-row gap-2 items-center">
          <IdCard size={15} color="#6B7280" />
          <View className="flex-row">
            <Text className="text-lg capitalize font-geist-medium">
              {client?.document_type ?? '-'}
            </Text>
            <Text className="text-lg font-geist-medium">
              : {client?.document_number ?? '-'}
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
        href={`/edit-client/${client?.id}`}
        className="py-4 bg-amber-500 rounded-xl"
        asChild
      >
        <TouchableOpacity className="flex-row gap-2 justify-center items-center">
          <Text className="text-center text-white font-geist-medium">
            Editar cliente
          </Text>
          <SquarePen size={16} color="white" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}
