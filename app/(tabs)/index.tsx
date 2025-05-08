import { View } from 'react-native';
import { memo } from 'react';
import Header from '@/components/home/header';
import StatsSection from '@/components/home/stats-section';
import TransactionsSection from '@/components/home/transactions-section';
import DirectShortcuts from '@/components/home/direct-shortcuts';
import CustomSafeScreen from '@/components/ui/custom-safe-screen';

function Index() {
  return (
    <CustomSafeScreen>
      <Header />
      <View className="p-5 flex-col gap-5">
        <StatsSection />
        <DirectShortcuts />
        <TransactionsSection />
      </View>
    </CustomSafeScreen>
  );
}

export default memo(Index);
