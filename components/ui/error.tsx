import { Text, TouchableOpacity, View } from 'react-native';

export default function Error({
  error,
  refetch,
}: {
  error: string;
  refetch: () => void;
}) {
  return (
    <View className="flex-1 justify-center items-center p-5">
      <Text className="text-red-500 mb-4">Error: {error}</Text>
      <TouchableOpacity
        className="bg-black py-2 px-4 rounded-lg"
        onPress={refetch}
      >
        <Text className="text-white font-geist-medium">Reintentar</Text>
      </TouchableOpacity>
    </View>
  );
}
