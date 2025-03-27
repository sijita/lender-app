import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

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
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(amount);
  };

  return (
    <View className="flex-col gap-6 bg-white rounded-xl p-5 shadow-sm border border-gray-200">
      <View className="flex-col">
        <Text className="text-xl font-inter-bold">Transacciones recientes</Text>
        <Text className="text-gray-500 font-inter-regular">
          Últimos movimientos financieros
        </Text>
      </View>
      <View className="flex-col gap-3">
        {transactions.map((transaction, index) => (
          <View key={index} className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="font-inter-semibold text-gray-800">
                {transaction.name}
              </Text>
              <Text className="text-gray-500 font-inter-regular">
                {transaction.type === 'payment_received'
                  ? 'Pago recibido'
                  : 'Nuevo préstamo'}
              </Text>
            </View>
            <View className="items-end">
              <View className="flex-row items-center gap-2">
                <Text className="text-lg font-inter-semibold">
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
              <Text className="text-gray-500 text-sm font-inter-light">
                {transaction.date}
              </Text>
            </View>
          </View>
        ))}
      </View>
      <Link
        href="/transactions"
        className="p-4 border border-gray-200 rounded-lg"
        asChild
      >
        <TouchableOpacity>
          <Text className="text-center font-inter-bold">Ver todos</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
