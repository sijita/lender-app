import { Stack } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';

export default function Loading({ loadingText }: { loadingText: string }) {
  return (
    <View className="min-h-screen flex-1 justify-center items-center bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />
      <ActivityIndicator size="large" color="#000" />
      <Text className="mt-2 text-gray-500">{loadingText}</Text>
    </View>
  );
}
