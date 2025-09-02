import { Animated, Text, TouchableOpacity } from 'react-native';
import DynamicIcon from './dynamic-icon';
import { X } from 'lucide-react-native';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  visible: boolean;
  message: string;
  type: ToastType;
  onClose: () => void;
  fadeAnim: Animated.Value;
}

export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type,
  onClose,
  fadeAnim,
}) => {
  if (!visible) return null;

  const getIconName = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'BadgeCheck';
      case 'error':
        return 'CircleX';
      case 'warning':
        return 'TriangleAlert';
      case 'info':
      default:
        return 'Info';
    }
  };

  const getBackgroundColor = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'info':
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          {
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-20, 0],
            }),
          },
        ],
      }}
      className={`absolute top-10 left-5 right-5 ${getBackgroundColor(
        type
      )} rounded-xl shadow-lg p-4 z-50 flex-row items-center`}
    >
      <DynamicIcon name={getIconName(type)} size={24} color="white" />
      <Text className="flex-1 text-white font-geist-medium ml-3">
        {message}
      </Text>
      <TouchableOpacity onPress={onClose}>
        <X size={20} color="white" />
      </TouchableOpacity>
    </Animated.View>
  );
};
