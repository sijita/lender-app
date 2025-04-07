import { Text, View } from 'react-native';
import StatsCard from './stats-card';
import useFetchStats from '@/actions/stats/use-fetch-stats';
import { formatCurrency } from '@/utils';

export default function StatsSection() {
  const { stats, loading, error } = useFetchStats();

  const statsData = [
    {
      title: 'Total pendiente',
      value: loading ? '-' : formatCurrency(stats.totalOutstanding),
      change: { value: stats.outstandingChange, period: 'Último mes' },
      icon: 'cash-outline',
    },
    {
      title: 'Clientes activos',
      value: loading ? '-' : stats.activeClients.toString(),
      subtitle: loading ? '-' : `+${stats.newClientsThisMonth} Nuevos este mes`,
      icon: 'people-outline',
    },
    {
      title: 'Próximos pagos',
      value: loading ? '-' : stats.upcomingPayments.toString(),
      subtitle: 'Esta semana',
      icon: 'time-outline',
    },
    {
      title: 'Ingresos mensuales',
      value: loading ? '-' : formatCurrency(stats.monthlyIncome),
      change: { value: stats.monthlyIncomeChange, period: 'Último mes' },
      icon: 'stats-chart-outline',
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
        {statsData.map((stat, index) => (
          <View key={index} className="flex-1 min-w-[160]">
            <StatsCard
              title={stat.title}
              value={stat.value}
              change={stat.change}
              subtitle={stat.subtitle}
              icon={stat.icon}
            />
          </View>
        ))}
      </View>
    </View>
  );
}
