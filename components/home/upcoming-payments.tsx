import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

type Payment = {
  name: string;
  amount: number;
  dueDate: string;
  status: 'on_time' | 'at_risk' | 'overdue';
};

type UpcomingPaymentsProps = {
  payments: Payment[];
};

export default function UpcomingPayments({ payments }: UpcomingPaymentsProps) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(amount);
  };

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
    <View className="flex-col gap-6 bg-white rounded-xl p-5 border border-gray-100">
      <View className="flex-col">
        <Text className="text-xl font-geist-bold">Pagos pendientes</Text>
        <Text className="text-gray-500 font-geist-regular">
          Pagos con vencimiento en los próximos 7 días
        </Text>
      </View>
      <View className="flex-col gap-3">
        {payments.map((payment, index) => (
          <View key={index} className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="font-geist-semibold text-gray-800">
                {payment.name}
              </Text>
              <Text className="font-geist-regular text-gray-500">
                Due: {payment.dueDate}
              </Text>
            </View>
            <View className="items-end">
              <View className="flex-row items-center gap-2">
                <Text className="text-lg font-geist-semibold">
                  {formatAmount(payment.amount)}
                </Text>
                <Ionicons
                  name="notifications-outline"
                  size={16}
                  color={payment.status === 'on_time' ? '#22c55e' : '#ef4444'}
                />
              </View>
              <Text
                className={`${getStatusColor(payment.status)} font-geist-light`}
              >
                {getStatusText(payment.status)}
              </Text>
            </View>
          </View>
        ))}
      </View>
      <Link href="/" className="p-4 border border-gray-200 rounded-lg" asChild>
        <TouchableOpacity>
          <Text className="text-center font-geist-bold">Ver todos</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
