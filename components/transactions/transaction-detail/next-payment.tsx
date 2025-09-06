import { View, Text } from 'react-native';
import { formatCurrency } from '@/utils';
import { format } from '@formkit/tempo';
import { Calendar } from 'lucide-react-native';

export default function NextPayment({
  nextPaymentDate,
  amount,
}: {
  nextPaymentDate: string;
  amount: number;
}) {
  return (
    <View className="flex-col gap-3 justify-between items-center p-4 bg-blue-50 rounded-xl border border-blue-100 sm:mt-auto">
      <View className="flex-row gap-1 items-center">
        <Calendar size={18} color="#000" />
        <View className="flex-col">
          <Text className="text-lg font-geist-bold">Próximo pago</Text>
        </View>
      </View>
      <Text className="text-xl font-geist-bold">{formatCurrency(amount)}</Text>
      {nextPaymentDate && (
        <Text className="text-gray-700 font-geist-medium">
          {format({
            date: new Date(
              nextPaymentDate?.includes('T')
                ? nextPaymentDate
                : nextPaymentDate + 'T00:00:00-05:00'
            ),
            format: 'full',
            tz: 'America/Bogota',
            locale: 'es',
          })}
        </Text>
      )}
    </View>
  );
}
