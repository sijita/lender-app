import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function BackButton({ title }: { title: string }) {
  const router = useRouter();
  return (
    <View className="flex-row gap-5 items-center px-4 py-6 bg-white border-b border-gray-200">
      <TouchableOpacity
        className="flex-row items-center gap-1 bg-black px-5 py-1 rounded-full"
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={20} color="white" />
      </TouchableOpacity>
      <Text className="text-2xl font-geist-bold">{title}</Text>
    </View>
  );
}
