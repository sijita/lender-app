import { useSidebar } from '@/hooks/use-sidebar';
import { TouchableOpacity, View } from 'react-native';
import DynamicIcon from '@/components/ui/dynamic-icon';

export default function ToggleButton() {
  const isWeb = useSidebar(state => state.isWeb);
  const isOpen = useSidebar(state => state.isOpen);
  const toggleSidebar = useSidebar(state => state.toggle);

  return (
    <>
      {isWeb && (
        <View className="w-10 justify-center items-start">
          <TouchableOpacity
            className="bg-gray-100 rounded-xl p-2"
            onPress={toggleSidebar}
          >
            {isOpen ? (
              <DynamicIcon name="X" size={24} color="#000" />
            ) : (
              <DynamicIcon name="Menu" size={24} color="#000" />
            )}
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}
