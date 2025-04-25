import { View, Text } from 'react-native';
import { formatCurrency } from '@/utils';
import DynamicIcon from '@/components/ui/dynamic-icon';

export default function ClientActivityHistory({
  activities,
}: {
  activities: Array<{
    id: number;
    type: string;
    description: string;
    date: string;
    amount?: number;
  }>;
}) {
  return (
    <View className="flex-col gap-6 bg-white p-5 border border-gray-100 rounded-xl">
      <Text className="text-xl font-geist-bold">Historial de actividad</Text>
      {activities.length > 0 ? (
        <View className="flex-col gap-4">
          {activities.map((activity) => (
            <View key={activity.id} className="flex-row items-center gap-3">
              <DynamicIcon
                name={activity.type === 'payment' ? 'ArrowDown' : 'ArrowUp'}
                size={16}
                color={activity.type === 'payment' ? '#16a34a' : '#2563eb'}
              />
              <View className="flex-col gap-1 flex-1">
                <Text className="font-geist-medium">
                  {activity.description}
                </Text>
                <Text className="text-gray-500 text-sm">
                  {new Date(activity.date).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                  })}
                </Text>
              </View>
              {activity.amount && (
                <Text className="font-geist-medium">
                  {formatCurrency(activity.amount)}
                </Text>
              )}
            </View>
          ))}
        </View>
      ) : (
        <View className="py-4 items-center">
          <Text className="text-gray-500">No hay actividades registradas</Text>
        </View>
      )}
    </View>
  );
}
