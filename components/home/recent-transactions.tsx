import { View, Text, TouchableOpacity } from 'react-native';
import { formatCurrency } from '@/utils';
import DynamicIcon from '@/components/ui/dynamic-icon';
import { Link } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import useTransactionTabs from '@/store/use-transaction-tabs';
import useFetchTransactions from '@/actions/transactions/use-fetch-transactions';

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
  const { refetch } = useFetchTransactions();
  const setActiveTab = useTransactionTabs(state => state.setActiveTab);

  return (
    <View className="flex-col gap-6 p-5 bg-white rounded-xl border border-gray-100">
      <View className="flex-col">
        <Text className="text-xl font-geist-bold">Préstamos recientes</Text>
        <Text className="text-gray-500 font-geist-regular">
          Últimos desembolsos
        </Text>
      </View>
      <View className="flex-col gap-3">
        {transactions?.length === 0 && (
          <View className="justify-center items-center py-5">
            <Text className="text-gray-500">No hay transacciones</Text>
          </View>
        )}
        {transactions?.map((transaction, index) => (
          <Link
            href={`/transaction/${transaction.id}`}
            key={index}
            className="rounded-xl border border-sky-100"
            asChild
          >
            <View className="p-3 rounded-xl bg-sky-50/50 active:bg-sky-100">
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text className="text-gray-800 font-geist-semibold">
                    {transaction.name}
                  </Text>
                </View>
                <View className="flex-row gap-2 items-center">
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
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-500 font-geist-regular">
                  {transaction.type === 'payment_received'
                    ? 'Pago recibido'
                    : 'Nuevo préstamo'}
                </Text>
                <View className="items-end">
                  <Text className="text-sm text-gray-500 font-geist-regular">
                    {transaction.date}
                  </Text>
                </View>
              </View>
            </View>
          </Link>
        ))}
      </View>
      <Link
        href="/(tabs)/transactions"
        className="p-4 mt-auto bg-black rounded-xl"
        asChild
      >
        <TouchableOpacity
          onPress={() => {
            setActiveTab('loan');
            refetch({ type: 'loan_disbursement' });
          }}
          className="flex-row gap-2 justify-center items-center"
        >
          <Text className="text-center text-white font-geist-bold">
            Ver todos
          </Text>
          <ArrowRight size={18} color="#fff" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}
