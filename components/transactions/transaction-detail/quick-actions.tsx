import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

export default function QuickActions() {
  return (
    <View className="flex-col gap-6 rounded-xl bg-white p-5 border border-gray-200">
      <Text className="text-xl font-geist-bold">Acciones Rápidas</Text>
      <View className="flex-row gap-3">
        <Link
          href="/"
          className="px-3 py-4 border border-gray-200 rounded-lg w-full flex-1"
          asChild
        >
          <TouchableOpacity className="flex-row items-center justify-center gap-1">
            <Ionicons name="document-text-outline" size={15} color="#6B7280" />
            <Text className="text-center font-geist-medium">
              Nuevo préstamo
            </Text>
          </TouchableOpacity>
        </Link>
        <Link
          href="/new-transaction"
          className="px-3 py-4 bg-black rounded-lg w-full flex-1"
          asChild
        >
          <TouchableOpacity className="flex-row items-center justify-center gap-1">
            <Ionicons name="cash-outline" size={15} color="#fff" />
            <Text className="text-white text-center font-geist-medium">
              Nuevo pago
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
