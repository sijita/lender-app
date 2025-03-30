import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Client = {
  name: string;
  email: string;
  phone: string;
  outstanding: number;
  status: 'A' | 'P';
};

type ClientListProps = {
  clients: Client[];
  onClientPress: (client: Client) => void;
};

export default function ClientList({
  clients,
  onClientPress,
}: ClientListProps) {
  return (
    <View className="p-5 flex-col gap-5">
      <View className="flex-row items-center gap-2">
        <View className="flex-row items-center gap-1 flex-1 bg-white rounded-lg px-3">
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            placeholder="Buscar cliente..."
            className="flex-1 text-base"
            placeholderTextColor="#6B7280"
          />
        </View>
        <TouchableOpacity className="flex-row items-center gap-1 border border-gray-200 rounded-lg px-4 py-2">
          <Text className="text-black font-geist-medium">Filtrar</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center gap-1 border border-gray-200 rounded-lg px-4 py-2">
          <Text className="text-black font-geist-medium">Ordenar</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal className="w-full">
        <View>
          <View className="flex-row px-4 py-2 border-b border-gray-200">
            <Text className="w-52 font-geist-medium text-gray-500">Nombre</Text>
            <Text className="w-48 font-geist-medium text-gray-500">
              Contacto
            </Text>
            <Text className="w-40 font-geist-medium text-gray-500 text-right">
              Pendiente
            </Text>
            <Text className="w-28 font-geist-medium text-gray-500 text-right">
              Estado
            </Text>
            <View className="w-16" />
          </View>
          {clients.map((client, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => onClientPress(client)}
              className="flex-row items-center px-4 py-3 border-b border-gray-100"
            >
              <Text className="w-52 font-geist-medium">{client.name}</Text>
              <View className="w-48">
                <Text className="text-gray-600">{client.email}</Text>
                <Text className="text-gray-500 text-sm">{client.phone}</Text>
              </View>
              <Text className="w-40 font-geist-semibold text-right">
                ${client.outstanding.toLocaleString()}
              </Text>
              <View className="w-28 items-end shrink-0">
                <Text
                  className={`px-2 py-1 rounded-full text-xs font-geist-medium ${
                    client.status === 'A'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {client.status}
                </Text>
              </View>
              <View className="w-16 items-end">
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
