import { Text, TouchableOpacity, View } from 'react-native';
import { Link } from 'expo-router';
import { formatCurrency } from '@/utils';
import { ArrowRight, Bell } from 'lucide-react-native';
import { UpcomingPayment } from '@/types/payments';
import useTransactionTabs from '@/store/use-transaction-tabs';
import useFetchTransactions from '@/actions/transactions/use-fetch-transactions';

export default function OverduePayments({
  payments,
}: {
  payments: UpcomingPayment[];
}) {
  const { refetch } = useFetchTransactions();
  const setActiveTab = useTransactionTabs(state => state.setActiveTab);

  return (
    <View className="flex-col gap-6 bg-white rounded-xl p-5 border border-gray-100">
      <View className="flex-col">
        <Text className="text-xl font-geist-bold">Pagos vencidos</Text>
        <Text className="text-gray-500 font-geist-regular">
          Pagos que no se han realizado en la fecha establecida
        </Text>
      </View>
      <View className="flex-col gap-3">
        {payments?.length === 0 && (
          <View className="items-center justify-center py-5">
            <Text className="text-gray-500">
              No hay pagos vencidos recientes
            </Text>
          </View>
        )}
        {payments?.map((payment, index) => (
          <Link
            href={`/transaction/${payment.transactionId}`}
            key={index}
            className="border border-gray-100 rounded-lg"
            asChild
          >
            <View
              key={index}
              className="flex-row justify-between items-start p-3 rounded-lg bg-red-50/50 active:bg-red-100"
            >
              <View className="flex-1">
                <Text className="font-geist-semibold text-gray-800">
                  {payment.clientName}
                </Text>
                <Text className="font-geist-regular text-gray-500">
                  Vencido:{' '}
                  <Text className="font-geist-medium text-black">
                    {payment.paymentDate}
                  </Text>
                </Text>
              </View>
              <View className="items-end">
                <View className="flex-row items-center gap-2">
                  <Text className="text-lg font-geist-semibold">
                    {formatCurrency(payment.amount)}
                  </Text>
                  <Bell size={16} color="#ef4444" />
                </View>
                <Text className="text-red-500 font-geist-regular text-sm">
                  Vencido
                </Text>
              </View>
            </View>
          </Link>
        ))}
      </View>
      <Link
        href="/(tabs)/transactions"
        className="p-4 bg-black rounded-lg mt-auto"
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
