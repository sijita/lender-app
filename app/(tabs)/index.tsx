import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import StatsCard from '../components/stats-card';
import RecentTransactions from '../components/recent-transactions';
import UpcomingPayments from '../components/upcoming-payments';
import { useCallback } from 'react';
import { Link, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Index() {
  const navigation = useNavigation();
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const velocity = event.nativeEvent.velocity?.y ?? 0;

      if (velocity > 0 && offsetY > 50) {
        navigation.setOptions({
          tabBarStyle: {
            display: 'none',
          },
        });
      } else {
        navigation.setOptions({
          tabBarStyle: {
            display: 'flex',
            backgroundColor: '#FAFAFA',
            borderRadius: 50,
            marginHorizontal: 20,
            marginBottom: 35,
            height: 50,
            position: 'absolute',
            overflow: 'hidden',
          },
        });
      }
    },
    [navigation]
  );

  return (
    <Animated.ScrollView
      className="flex-1"
      contentContainerStyle={{
        minHeight: '100%',
        paddingBottom: 10,
      }}
      onScroll={handleScroll}
      scrollEventThrottle={15}
    >
      <View className="flex-row items-center justify-between p-4 border-b border-gray-200 bg-white">
        <Text className="text-xl font-inter-black">$ LenderApp</Text>
        <Link href="/" className="px-4 py-3 bg-black rounded-xl" asChild>
          <TouchableOpacity className="flex-row items-center gap-1">
            <Ionicons name="add-outline" size={16} color="white" />
            <Text className="text-center text-white font-inter-medium">
              Nueva transacción
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
      <View className="p-5 flex-col gap-5">
        <Text className="text-2xl font-inter-bold">Inicio</Text>
        <View className="flex-row flex-wrap gap-4">
          <View className="flex-1 min-w-[160]">
            <StatsCard
              title="Total pendiente"
              value="$12,450.00"
              change={{ value: 2.5, period: 'Último mes' }}
              icon="cash-outline"
            />
          </View>
          <View className="flex-1 min-w-[160]">
            <StatsCard
              title="Clientes activos"
              value="24"
              subtitle="+3 Nuevos este mes"
              icon="people-outline"
            />
          </View>
          <View className="flex-1 min-w-[160]">
            <StatsCard
              title="Próximos pagos"
              value="8"
              subtitle="Esta semana"
              icon="time-outline"
            />
          </View>
          <View className="flex-1 min-w-[160]">
            <StatsCard
              title="Ingresos mensuales"
              value="$1,890.00"
              change={{ value: 12.3, period: 'Último mes' }}
              icon="stats-chart-outline"
            />
          </View>
        </View>
        <View className="flex-col gap-5">
          <RecentTransactions
            transactions={[
              {
                name: 'John Smith',
                type: 'payment_received',
                amount: 500,
                date: 'Today',
              },
              {
                name: 'Sarah Johnson',
                type: 'new_loan',
                amount: 1200,
                date: 'Yesterday',
              },
              {
                name: 'Michael Brown',
                type: 'payment_received',
                amount: 350,
                date: 'Mar 15, 2025',
              },
              {
                name: 'Emily Davis',
                type: 'new_loan',
                amount: 800,
                date: 'Mar 12, 2025',
              },
            ]}
          />
          <UpcomingPayments
            payments={[
              {
                name: 'Robert Wilson',
                amount: 250,
                dueDate: 'Tomorrow',
                status: 'on_time',
              },
              {
                name: 'Jennifer Lee',
                amount: 420,
                dueDate: 'Mar 19, 2025',
                status: 'on_time',
              },
              {
                name: 'David Miller',
                amount: 600,
                dueDate: 'Mar 20, 2025',
                status: 'at_risk',
              },
              {
                name: 'Lisa Taylor',
                amount: 180,
                dueDate: 'Mar 22, 2025',
                status: 'on_time',
              },
            ]}
          />
        </View>
      </View>
    </Animated.ScrollView>
  );
}
