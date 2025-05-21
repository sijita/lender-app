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
  const setActiveTab = useTransactionTabs((state) => state.setActiveTab);

  return (
    <View className="flex-col gap-6 bg-white rounded-xl p-5 border border-gray-100">
      <View className="flex-col">
        <Text className="text-xl font-geist-bold">Pagos recientes</Text>
        <Text className="text-gray-500 font-geist-regular">
          Últimos pagos recibidos
        </Text>
      </View>
      <View className="flex-col gap-3">
        {payments?.length === 0 && (
          <View className="items-center justify-center py-5">
            <Text className="text-gray-500">No hay pagos recientes</Text>
          </View>
        )}
        {payments?.map((payment, index) => (
          <Link
            href={`/transaction/${payment.id}`}
            key={index}
            className="border border-gray-100 rounded-lg"
            asChild
          >
            <View
              key={index}
              className="flex-row justify-between items-start p-3 rounded-lg bg-green-50/50 active:bg-green-100"
            >
              <View className="flex-1">
                <Text className="font-geist-semibold text-gray-800">
                  {payment.name}
                </Text>
                <Text className="font-geist-regular text-gray-500">
                  Recibido:{' '}
                  <Text className="font-geist-medium text-black">
                    {payment.date}
                  </Text>
                </Text>
              </View>
              <View className="items-end">
                <View className="flex-row items-center gap-2">
                  <Text className="text-lg font-geist-semibold">
                    {formatCurrency(payment.amount)}
                  </Text>
                  <CheckCircle size={16} color="#22c55e" />
                </View>
                <Text className="text-green-500 font-geist-regular text-sm">
                  Completado
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
          onPress={() => {
            setActiveTab('payment');
            refetch({ type: 'payment' });
          }}
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
