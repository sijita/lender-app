import { View, Text, TouchableOpacity } from 'react-native';
import { formatCurrency } from '@/utils';
import DynamicIcon from '@/components/ui/dynamic-icon';
import { Link } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import useTransactionTabs from '@/store/use-transaction-tabs';

export default function RecentTransactions({
  transactions,
}: {
  transactions: {
    id: number;
    name: string;
    type: 'payment_received' | 'new_loan';
    amount: number;
    date: string;
  }[];
}) {
  const setActiveTab = useTransactionTabs((state) => state.setActiveTab);
  return (
    <View className="flex-col gap-6 bg-white rounded-xl p-5 border border-gray-100">
      <View className="flex-col">
        <Text className="text-xl font-geist-bold">Préstamos recientes</Text>
        <Text className="text-gray-500 font-geist-regular">
          Últimos desembolsos
        </Text>
      </View>
      <View className="flex-col gap-3">
        {transactions?.length === 0 && (
          <View className="items-center justify-center py-5">
            <Text className="text-gray-500">No hay transacciones</Text>
          </View>
        )}
        {transactions?.map((transaction, index) => (
          <Link
            href={`/transaction/${transaction.id}`}
            key={index}
            className="border border-gray-100 rounded-lg"
            asChild
          >
            <View className="flex-row justify-between items-start p-3 rounded-lg bg-gray-50/50 active:bg-gray-100">
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
                  <DynamicIcon
                    name={
                      transaction.type === 'payment_received'
                        ? 'ArrowDown'
                        : 'ArrowUp'
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
          </Link>
        ))}
      </View>
      <Link
        href="/(tabs)/transactions"
        className="p-4 bg-black rounded-lg"
        asChild
      >
        <TouchableOpacity
          onPress={() => setActiveTab('loan')}
          className="flex-row items-center justify-center gap-2"
        >
          <Text className="text-center font-geist-bold text-white">
            Ver todos
          </Text>
          <ArrowRight size={18} color="#fff" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}
