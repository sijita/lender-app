import { Text, View } from 'react-native';
import DynamicIcon from '@/components/ui/dynamic-icon';
import { icons } from 'lucide-react-native';

const TabIcon = ({
  focused,
  icon,
  title,
}: {
  focused: boolean;
  icon: keyof typeof icons;
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
      <DynamicIcon name={icon} size={23} color="#000" />
    </View>
  );
};

export default TabIcon;
