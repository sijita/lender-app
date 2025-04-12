import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency } from '@/utils';
import { formatDate, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export default function NextPayment({
  nextPaymentDate,
  amount,
}: {
  nextPaymentDate: string;
  amount: number;
}) {
  return (
    <View className="flex-row justify-between items-center p-4 bg-yellow-50 rounded-lg border border-yellow-100">
      <View className="flex-row items-center gap-3">
        <Ionicons name="calendar-outline" size={20} color="#000" />
        <View className="flex-col">
          <Text className="font-geist-bold text-lg">Próximo pago</Text>
          <Text className="text-gray-700">
            {formatDate(parseISO(nextPaymentDate), "dd 'de' MMMM, yyyy", {
              locale: es,
            })}
          </Text>
        </View>
      </View>
      <View className="flex-row justify-between">
        <Text className="font-geist-bold text-xl">
          {formatCurrency(amount)}
        </Text>
      </View>
    </View>
  );
}
