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
    <View className="flex-col gap-6 p-5 bg-white rounded-xl border border-gray-100">
      <View className="flex-col">
        <Text className="text-xl font-geist-bold">Pagos vencidos</Text>
        <Text className="text-gray-500 font-geist-regular">
          Pagos que no se han realizado en la fecha establecida
        </Text>
      </View>
      <View className="flex-col gap-3">
        {payments?.length === 0 && (
          <View className="justify-center items-center py-5">
            <Text className="text-gray-500">
              No hay pagos vencidos recientes
            </Text>
          </View>
        )}
        {payments?.map((payment, index) => (
          <Link
            href={`/transaction/${payment.transactionId}`}
            key={index}
            className="rounded-xl border border-red-100"
            asChild
          >
            <View className="p-3 rounded-xl bg-red-50/50 active:bg-red-100">
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text className="text-gray-800 font-geist-semibold">
                    {payment.clientName}
                  </Text>
                </View>
                <View className="items-end">
                  <View className="flex-row gap-2 items-center">
                    <Text className="text-lg font-geist-semibold">
                      {formatCurrency(payment.amount)}
                    </Text>
                    <Bell size={16} color="#ef4444" />
                  </View>
                </View>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-500 font-geist-regular">
                  Vencido:{' '}
                  <Text className="text-black font-geist-medium">
                    {payment.paymentDate}
                  </Text>
                </Text>
                <Text className="text-sm text-red-500 font-geist-regular">
                  Vencido
                </Text>
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
