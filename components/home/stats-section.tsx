import { Platform, Text, View } from 'react-native';
import StatsCard from './stats-card';
import useFetchStats from '@/actions/stats/use-fetch-stats';
import { formatCurrency } from '@/utils';
import {
  HandCoins,
  Users,
  Wallet,
  AlarmClock,
  CircleDollarSign,
} from 'lucide-react-native';
import Skeleton from '@/components/ui/skeleton';

export default function StatsSection() {
  const { stats, loading, error } = useFetchStats();

  const statsData = [
    {
      title: 'Desembolsado en el mes',
      value: loading ? <Skeleton /> : formatCurrency(stats.monthlyLoanedAmount),
      change: !loading && {
        value: stats.monthlyLoanedAmountChange,
        period: 'Último mes',
      },
      icon: <Wallet size={18} color="#000" />,
    },
    {
      title: 'Total pendiente',
      value: loading ? <Skeleton /> : formatCurrency(stats.totalOutstanding),
      change: !loading && {
        value: stats.outstandingChange,
        period: 'Último mes',
      },
      icon: <HandCoins size={18} color="#000" />,
    },
    {
      title: 'Clientes activos',
      value: loading ? <Skeleton /> : stats.activeClients.toString(),
      subtitle: !loading && `+${stats.newClientsThisMonth} Nuevos este mes`,
      icon: <Users size={18} color="#000" />,
    },
    {
      title: 'Próximos pagos',
      value: loading ? <Skeleton /> : stats.upcomingPayments.toString(),
      subtitle: !loading && 'Esta semana',
      icon: <AlarmClock size={18} color="#000" />,
    },
    {
      title: 'Ingresos mensuales',
      value: loading ? <Skeleton /> : formatCurrency(stats.monthlyIncome),
      change: !loading && {
        value: stats.monthlyIncomeChange,
        period: 'Último mes',
      },
      icon: <CircleDollarSign size={18} color="#000" />,
    },
  ];

  if (error) {
    return (
      <View className="flex-col gap-5">
        <Text className="text-2xl font-geist-bold">Inicio</Text>
        <Text className="text-red-500">
          Error al cargar las estadísticas: {error}
        </Text>
      </View>
    );
  }
  return (
    <View className="flex-col gap-5">
      <Text className="text-2xl font-geist-bold">Inicio</Text>
      <View className="flex-row flex-wrap gap-4">
        {Platform.OS === 'web' ? (
          statsData.map((stat, index) => (
            <View key={index} className="flex-1 min-w-[160]">
              <StatsCard
                title={stat.title}
                value={stat.value as string | number | Element}
                change={stat.change as { value: number; period: string }}
                subtitle={stat.subtitle as string}
                icon={stat.icon}
                isLoading={loading}
              />
            </View>
          ))
        ) : (
          <>
            <View className="flex-1 basis-full min-w-[160]">
              <StatsCard
                title={statsData[0].title}
                value={statsData[0].value as string | number | Element}
                change={
                  statsData[0].change as { value: number; period: string }
                }
                subtitle={statsData[0].subtitle as string}
                icon={statsData[0].icon}
                isLoading={loading}
              />
            </View>
            {statsData.slice(1).map((stat, index) => (
              <View key={index} className="flex-1 min-w-[160]">
                <StatsCard
                  title={stat.title}
                  value={stat.value as string | number | Element}
                  change={stat.change as { value: number; period: string }}
                  subtitle={stat.subtitle as string}
                  icon={stat.icon}
                  isLoading={loading}
                />
              </View>
            ))}
          </>
        )}
      </View>
    </View>
  );
}
