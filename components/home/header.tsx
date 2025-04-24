import { Text, View } from 'react-native';

export default function Header() {
  return (
    <View className="flex-row items-center justify-center px-4 py-6 border-b border-gray-200 bg-white">
      <Text className="text-2xl font-geist-black">$ HyM</Text>
    </View>
  );
}
