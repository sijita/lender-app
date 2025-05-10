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
    <View className="flex-col gap-3 justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-100">
      <View className="flex-row items-center gap-1">
        <Calendar size={18} color="#000" />
        <View className="flex-col">
          <Text className="font-geist-bold text-lg">Próximo pago</Text>
        </View>
      </View>
      <Text className="font-geist-bold text-xl">{formatCurrency(amount)}</Text>
      <Text className="font-geist-medium text-gray-700">
        {format({
          date: new Date(
            nextPaymentDate.includes('T')
              ? nextPaymentDate
              : nextPaymentDate + 'T00:00:00-05:00'
          ),
          format: 'full',
          tz: 'America/Bogota',
          locale: 'es',
        })}
      </Text>
    </View>
  );
}
