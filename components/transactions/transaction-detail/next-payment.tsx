import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency } from '@/utils';
import { formatDate, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface NextPaymentProps {
  nextPaymentDate: string;
  amount: number;
}

export default function NextPayment({
  nextPaymentDate,
  amount,
}: NextPaymentProps) {
  return (
    <View className="flex-col gap-4 bg-gray-50 p-5 border border-gray-100 rounded-xl">
      <View className="flex-row items-center gap-2">
        <Ionicons name="calendar-outline" size={20} color="#6B7280" />
        <Text className="text-lg font-geist-bold">Próximo pago</Text>
      </View>
      <View className="flex-col gap-1">
        <Text className="text-gray-500 font-geist-medium">
          {formatDate(parseISO(nextPaymentDate), "dd 'de' MMMM, yyyy", {
            locale: es,
          })}
        </Text>
        <Text className="font-geist-bold text-xl">
          {formatCurrency(amount)}
        </Text>
      </View>
    </View>
  );
}
