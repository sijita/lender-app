import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Transaction = {
  name: string;
  type: 'payment_received' | 'new_loan';
  amount: number;
  date: string;
};

type RecentTransactionsProps = {
  transactions: Transaction[];
};

export default function RecentTransactions({
  transactions,
}: RecentTransactionsProps) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <View className="mb-4">
        <Text className="text-xl font-bold">Recent Transactions</Text>
        <Text className="text-gray-500">Your latest financial activities</Text>
      </View>

      <View className="space-y-4">
        {transactions.map((transaction, index) => (
          <View key={index} className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="font-semibold text-gray-800">
                {transaction.name}
              </Text>
              <Text className="text-gray-500">
                {transaction.type === 'payment_received'
                  ? 'Payment Received'
                  : 'New Loan'}
              </Text>
            </View>

            <View className="items-end">
              <View className="flex-row items-center gap-2">
                <Text className="text-lg font-semibold">
                  {formatAmount(transaction.amount)}
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
              <Text className="text-gray-500">{transaction.date}</Text>
            </View>
          </View>
        ))}
      </View>

      <View className="mt-4 pt-4 border-t border-gray-200">
        <Text className="text-center text-blue-600 font-semibold">
          View All Transactions
        </Text>
      </View>
    </View>
  );
}
