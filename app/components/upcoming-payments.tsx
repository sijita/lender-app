import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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
        return 'On Time';
      case 'at_risk':
        return 'At Risk';
      case 'overdue':
        return 'Overdue';
      default:
        return '';
    }
  };

  return (
    <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <View className="mb-4">
        <Text className="text-xl font-bold">Upcoming Payments</Text>
        <Text className="text-gray-500">Payments due in the next 7 days</Text>
      </View>

      <View className="space-y-4">
        {payments.map((payment, index) => (
          <View key={index} className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="font-semibold text-gray-800">
                {payment.name}
              </Text>
              <Text className="text-gray-500">Due: {payment.dueDate}</Text>
            </View>

            <View className="items-end">
              <View className="flex-row items-center gap-2">
                <Text className="text-lg font-semibold">
                  {formatAmount(payment.amount)}
                </Text>
                <Ionicons
                  name="notifications-outline"
                  size={16}
                  color={payment.status === 'on_time' ? '#22c55e' : '#ef4444'}
                />
              </View>
              <Text className={`${getStatusColor(payment.status)}`}>
                {getStatusText(payment.status)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View className="mt-4 pt-4 border-t border-gray-200">
        <Text className="text-center text-blue-600 font-semibold">
          Send Reminders
        </Text>
      </View>
    </View>
  );
}
