import { Text, TouchableOpacity, View } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Header() {
  return (
    <View className="flex-row items-center justify-between px-4 py-6 border-b border-gray-200 bg-white">
      <Text className="text-2xl font-geist-black">$ LenderApp</Text>
      <Link href="/" className="px-4 py-2 bg-black rounded-full" asChild>
        <TouchableOpacity className="flex-row items-center gap-1">
          <Text className="text-white font-geist-medium">
            Nueva transacción
          </Text>
          <Ionicons name="add-outline" size={20} color="white" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}
