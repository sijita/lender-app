import { View, Text } from 'react-native';
import RecentTransactions from './recent-transactions';
import UpcomingPayments from './upcoming-payments';
import useFetchRecentTransactions from '@/actions/transactions/use-fetch-recent-transactions';
import useFetchUpcomingPayments from '@/actions/payments/use-fetch-upcoming-payments';
import Loading from '@/components/ui/loading';

export default function TransactionsSection() {
  const {
    recentTransactions,
    loading: loadingTransactions,
    error: transactionsError,
  } = useFetchRecentTransactions();
  const {
    upcomingPayments,
    loading: loadingPayments,
    error: paymentsError,
  } = useFetchUpcomingPayments();

  if (loadingTransactions || loadingPayments) {
    return <Loading loadingText="Cargando datos..." />;
  }

  if (transactionsError || paymentsError) {
    return (
      <View className="flex-col">
        {transactionsError && (
          <Text className="text-red-500 p-4">
            Error al cargar transacciones: {transactionsError}
          </Text>
        )}
        {paymentsError && (
          <Text className="text-red-500 p-4">
            Error al cargar pagos: {paymentsError}
          </Text>
        )}
      </View>
    );
  }

  if (!recentTransactions.length && !upcomingPayments.length) {
    return (
      <View className="flex-col items-center justify-center py-10 bg-white rounded-xl border border-gray-100">
        <Text className="text-gray-500 font-geist-medium">
          No hay transacciones recientes
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-col gap-5">
      <Text className="text-2xl font-geist-bold">Transacciones recientes</Text>
      <RecentTransactions transactions={recentTransactions} />
      <UpcomingPayments payments={upcomingPayments} />
    </View>
  );
}
