import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency } from '@/utils';

export default function RecentTransactions({
  transactions,
}: {
  transactions: {
    name: string;
    type: 'payment_received' | 'new_loan';
    amount: number;
    date: string;
  }[];
}) {
  return (
    <View className="flex-col gap-6 bg-white rounded-xl rounded-b-none p-5 border border-gray-100">
      <View className="flex-col">
        <Text className="text-xl font-geist-bold">Transacciones recientes</Text>
        <Text className="text-gray-500 font-geist-regular">
          Últimos movimientos financieros
        </Text>
      </View>
      <View className="flex-col gap-3">
        {transactions.map((transaction, index) => (
          <View key={index} className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="font-geist-semibold text-gray-800">
                {transaction.name}
              </Text>
              <Text className="text-gray-500 font-geist-regular">
                {transaction.type === 'payment_received'
                  ? 'Pago recibido'
                  : 'Nuevo préstamo'}
              </Text>
            </View>
            <View className="items-end">
              <View className="flex-row items-center gap-2">
                <Text className="text-lg font-geist-semibold">
                  {formatCurrency(transaction.amount)}
                </Text>
                <Ionicons
                  name={
                    transaction.type === 'payment_received'
                      ? 'arrow-down'
                      : 'arrow-up'
                  }
                  size={16}
                  color={
                    transaction.type === 'payment_received'
                      ? '#16a34a'
                      : '#2563eb'
                  }
                />
              </View>
              <Text className="text-gray-500 text-sm font-geist-regular">
                {transaction.date}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
