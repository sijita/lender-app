import { Text, View } from 'react-native';
import StatsCard from './stats-card';

const statsData = [
  {
    title: 'Total pendiente',
    value: '$12,450.00',
    change: { value: 2.5, period: 'Último mes' },
    icon: 'cash-outline',
  },
  {
    title: 'Clientes activos',
    value: '24',
    subtitle: '+3 Nuevos este mes',
    icon: 'people-outline',
  },
  {
    title: 'Próximos pagos',
    value: '8',
    subtitle: 'Esta semana',
    icon: 'time-outline',
  },
  {
    title: 'Ingresos mensuales',
    value: '$1,890.00',
    change: { value: 12.3, period: 'Último mes' },
    icon: 'stats-chart-outline',
  },
];

/**
 * Componente que muestra la sección de estadísticas en la pantalla de inicio
 */
export default function StatsSection() {
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
