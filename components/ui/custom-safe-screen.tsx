import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { useTabBarScroll } from '@/hooks/use-tab-bar-scroll';

export default function CustomSafeScreen({
  children,
}: {
  children: React.ReactNode;
}) {
  const { handleScroll } = useTabBarScroll();
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={'height'}
      keyboardVerticalOffset={10}
    >
      <Animated.ScrollView
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}
        onScroll={Platform.OS !== 'web' ? handleScroll : undefined}
        scrollEventThrottle={15}
        contentContainerStyle={{
          paddingBottom: 50,
        }}
        className="bg-gray-50"
      >
        {children}
      </Animated.ScrollView>
    </KeyboardAvoidingView>
  );
}
