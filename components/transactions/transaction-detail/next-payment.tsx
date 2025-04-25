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
    <View className="flex-row justify-between items-center p-4 bg-yellow-50 rounded-lg border border-yellow-100">
      <View className="flex-row items-center gap-4">
        <Calendar size={20} color="#000" />
        <View className="flex-col">
          <Text className="font-geist-bold text-lg">Próximo pago</Text>
          <Text className="text-gray-700">
            {format(new Date(nextPaymentDate), 'full', 'es')}
          </Text>
        </View>
      </View>
      <Text className="font-geist-bold text-xl">{formatCurrency(amount)}</Text>
    </View>
  );
}
