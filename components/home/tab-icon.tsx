import { Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const TabIcon = ({
  focused,
  icon,
  title,
}: {
  focused: boolean;
  icon: string;
  title: string;
}) => {
  if (focused) {
    return (
      <View className="flex flex-row w-full flex-1 min-w-[100px] min-h-[60px] mt-3 justify-center items-center rounded-full overflow-hidden bg-black">
        <Text className="text-white text-base font-semibold">{title}</Text>
      </View>
    );
  }

  return (
    <View className="size-full justify-center items-center mt-3 rounded-full">
      <Ionicons
        name={icon as keyof typeof Ionicons.glyphMap}
        size={23}
        color="#000"
      />
    </View>
  );
};

export default TabIcon;
