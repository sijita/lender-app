import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function DirectShortcuts() {
  return (
    <View className="flex-row gap-2 flex-wrap">
      <Link
        href="/new-transaction"
        className="px-4 py-5 bg-black rounded-xl flex-1"
        asChild
      >
        <TouchableOpacity className="flex-row items-center justify-center gap-2">
          <Text className="text-white font-geist-medium">
            Nueva transacción
          </Text>
          <Ionicons name="receipt-outline" size={15} color="white" />
        </TouchableOpacity>
      </Link>
      <Link
        href="/new-client"
        className="px-4 py-5 bg-black rounded-xl flex-1"
        asChild
      >
        <TouchableOpacity className="flex-row items-center justify-center gap-2">
          <Text className="text-white font-geist-medium">Nuevo cliente</Text>
          <Ionicons name="person-add-outline" size={15} color="white" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}
