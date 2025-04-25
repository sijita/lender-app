import { Animated, View } from 'react-native';
import { memo } from 'react';
import Header from '@/components/home/header';
import StatsSection from '@/components/home/stats-section';
import TransactionsSection from '@/components/home/transactions-section';
import { useTabBarScroll } from '@/hooks/use-tab-bar-scroll';
import DirectShortcuts from '@/components/home/direct-shortcuts';

function Index() {
  const { handleScroll } = useTabBarScroll();

  return (
    <Animated.ScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{
        minHeight: '100%',
        paddingBottom: 10,
      }}
      onScroll={handleScroll}
      scrollEventThrottle={15}
    >
      <Header />
      <View className="p-5 flex-col gap-5">
        <StatsSection />
        <DirectShortcuts />
        <TransactionsSection />
      </View>
    </Animated.ScrollView>
  );
}

export default memo(Index);
