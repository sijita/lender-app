import { useRouter } from 'expo-router';
import { ArrowLeft, RotateCcw, TriangleAlert } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Error({
  error,
  refetch,
}: {
  error: string;
  refetch: () => void;
}) {
  const router = useRouter();

  return (
    <View className="min-h-screen p-10 flex-1 flex-col gap-6 justify-center items-center bg-gray-50">
      <View className="flex-col items-center justify-center bg-red-500/10 rounded-full p-3">
        <TriangleAlert size={60} color="red" />
      </View>
      <View className="flex-col gap-1 items-center">
        <Text className="font-geist-extrabold text-red-500 text-3xl">
          Error
        </Text>
        <Text className="font-geist-semibold text-lg text-center">{error}</Text>
      </View>
      <TouchableOpacity
        className="bg-red-500 py-3 px-6 rounded-lg flex-row items-center gap-2 shadow-sm"
        onPress={refetch}
      >
        <Text className="text-white font-geist-medium text-base">
          Intentar nuevamente
        </Text>
        <View className="bg-white/20 rounded-full p-1">
          <RotateCcw size={16} color="white" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-row items-center gap-2 bg-gray-200 px-5 py-2.5 rounded-full mt-10"
        onPress={() => router.back()}
      >
        <ArrowLeft size={16} color="black" />
        <Text className="text-black font-geist-medium">Volver atrás</Text>
      </TouchableOpacity>
    </View>
  );
}
