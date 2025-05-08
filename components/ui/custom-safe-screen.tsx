import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Animated } from 'react-native';
import { useTabBarScroll } from '@/hooks/use-tab-bar-scroll';

export default function CustomSafeScreen({
  children,
}: {
  children: React.ReactNode;
}) {
  const { handleScroll } = useTabBarScroll();
  const insets = useSafeAreaInsets();

  return (
    <Animated.ScrollView
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
      onScroll={handleScroll}
      scrollEventThrottle={15}
      contentContainerStyle={{
        paddingBottom: 50,
      }}
      className="bg-gray-50"
    >
      {children}
    </Animated.ScrollView>
  );
}
