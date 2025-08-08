import { Text, View } from 'react-native';
import ToggleButton from './toggle-button';
import { useSidebar } from '@/hooks/use-sidebar';

export default function Header() {
  const sidebarVisible = useSidebar(state => state.isOpen);

  return (
    <View className="flex-row items-center px-4 py-6 border-b border-gray-200 bg-white">
      {!sidebarVisible && <ToggleButton />}
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-geist-black">$ HyM</Text>
      </View>
    </View>
  );
}
