import { Text, TouchableOpacity, View } from 'react-native';
import { Link } from 'expo-router';
import { formatCurrency } from '@/utils';
import { ArrowRight, CheckCircle } from 'lucide-react-native';
import { RecentPayment } from '@/types/payments';
import useTransactionTabs from '@/store/use-transaction-tabs';
import useFetchTransactions from '@/actions/transactions/use-fetch-transactions';

export default function RecentPayments({
  payments,
}: {
  payments: RecentPayment[];
}) {
  const { refetch } = useFetchTransactions();
  const setActiveTab = useTransactionTabs(state => state.setActiveTab);

  return (
    <View className="flex-col gap-6 p-5 bg-white rounded-xl border border-gray-100">
      <View className="flex-col">
        <Text className="text-xl font-geist-bold">Pagos recientes</Text>
        <Text className="text-gray-500 font-geist-regular">
          Últimos pagos recibidos
        </Text>
      </View>
      <View className="flex-col gap-3">
        {payments?.length === 0 && (
          <View className="justify-center items-center py-5">
            <Text className="text-gray-500">No hay pagos recientes</Text>
          </View>
        )}
        {payments?.map((payment, index) => (
          <Link
            href={`/transaction/${payment.id}`}
            key={index}
            className="rounded-xl border border-green-100"
            asChild
          >
            <View className="p-3 rounded-xl bg-green-50/50 active:bg-green-100">
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text className="text-gray-800 font-geist-semibold">
                    {payment.name}
                  </Text>
                </View>
                <View className="flex-row gap-2 items-center">
                  <Text className="text-lg font-geist-semibold">
                    {formatCurrency(payment.amount)}
                  </Text>
                  <CheckCircle size={16} color="#22c55e" />
                </View>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-500 font-geist-regular">
                  Recibido:{' '}
                  <Text className="text-black font-geist-medium">
                    {payment.date}
                  </Text>
                </Text>
                <View className="items-end">
                  <Text className="text-sm text-green-500 font-geist-regular">
                    Completado
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
            setActiveTab('payment');
            refetch({ type: 'payment' });
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
