import { Text, View } from 'react-native';
import DynamicIcon from '@/components/ui/dynamic-icon';
import { icons } from 'lucide-react-native';

const TabIcon = ({
  focused,
  icon,
  title,
  isWeb,
}: {
  focused: boolean;
  icon: keyof typeof icons;
  title: string;
  isWeb?: boolean;
}) => {
  if (isWeb) {
    return (
      <View
        className={`flex-row gap-3 items-center w-full h-full p-3 ${
          focused ? 'bg-black rounded-xl' : ''
        }`}
      >
        <DynamicIcon name={icon} size={20} color={focused ? '#fff' : '#000'} />
        <Text
          className={`text-sm ${
            focused
              ? 'font-geist-semibold text-white'
              : 'text-gray-700 font-geist-regular'
          }`}
        >
          {title}
        </Text>
      </View>
    );
  }

  // Mobile version
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
