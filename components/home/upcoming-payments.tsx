import { Text, TouchableOpacity, View } from 'react-native';
import { Link } from 'expo-router';
import { formatCurrency } from '@/utils';
import { ArrowRight, Bell } from 'lucide-react-native';

type Payment = {
  name: string;
  amount: number;
  dueDate: string;
  status: 'on_time' | 'at_risk' | 'overdue';
};

export default function UpcomingPayments({
  payments,
}: {
  payments: Payment[];
}) {
  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'on_time':
        return 'text-green-500';
      case 'at_risk':
        return 'text-red-500';
      case 'overdue':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusText = (status: Payment['status']) => {
    switch (status) {
      case 'on_time':
        return 'A tiempo';
      case 'at_risk':
        return 'Crítico';
      case 'overdue':
        return 'Vencido';
      default:
        return '';
    }
  };

  return (
    <View className="flex-col gap-6 bg-white rounded-xl rounded-t-none p-5 border border-gray-100">
      <View className="flex-col">
        <Text className="text-xl font-geist-bold">Pagos pendientes</Text>
        <Text className="text-gray-500 font-geist-regular">
          Pagos con vencimiento en los próximos 7 días
        </Text>
      </View>
      <View className="flex-col gap-3">
        {payments.map((payment, index) => (
          <View key={index} className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="font-geist-semibold text-gray-800">
                {payment.name}
              </Text>
              <Text className="font-geist-regular text-gray-500">
                Vencimiento: {payment.dueDate}
              </Text>
            </View>
            <View className="items-end">
              <View className="flex-row items-center gap-2">
                <Text className="text-lg font-geist-semibold">
                  {formatCurrency(payment.amount)}
                </Text>
                <Bell
                  size={16}
                  color={payment.status === 'on_time' ? '#22c55e' : '#ef4444'}
                />
              </View>
              <Text
                className={`${getStatusColor(
                  payment.status
                )} font-geist-regular text-sm`}
              >
                {getStatusText(payment.status)}
              </Text>
            </View>
          </View>
        ))}
      </View>
      <Link
        href="/(tabs)/transactions"
        className="p-4 border border-gray-200 rounded-lg"
        asChild
      >
        <TouchableOpacity className="flex-row items-center justify-center gap-2">
          <Text className="text-center font-geist-bold">Ver todos</Text>
          <ArrowRight size={18} color="#000" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}
