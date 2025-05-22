import { View, Text, Platform } from 'react-native';
import RecentTransactions from './recent-transactions';
import UpcomingPayments from './upcoming-payments';
import useFetchUpcomingPayments from '@/actions/payments/use-fetch-upcoming-payments';
import Loading from '@/components/ui/loading';
import OverduePayments from './overdue-payments';
import useFetchOverduePayments from '@/actions/payments/use-fetch-overdue-payments';
import RecentPayments from './recent-payments';
import useFetchRecentLoans from '@/actions/transactions/use-fetch-recent-loans';
import useFetchRecentPayments from '@/actions/transactions/use-fetch-recent-payments';

export default function TransactionsSection() {
  const {
    recentLoans,
    loading: loadingTransactions,
    error: transactionsError,
  } = useFetchRecentLoans();
  const {
    recentPayments,
    loading: loadingRecentPayments,
    error: recentPaymentsError,
  } = useFetchRecentPayments();
  const {
    upcomingPayments,
    loading: loadingPayments,
    error: paymentsError,
  } = useFetchUpcomingPayments();
  const {
    overduePayments,
    loading: loadingOverdue,
    error: overdueError,
  } = useFetchOverduePayments();

  if (
    loadingTransactions ||
    loadingPayments ||
    loadingOverdue ||
    loadingRecentPayments
  ) {
    return <Loading loadingText="Cargando datos..." />;
  }

  if (
    transactionsError ||
    paymentsError ||
    overdueError ||
    recentPaymentsError
  ) {
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
        {overdueError && (
          <Text className="text-red-500 p-4">
            Error al cargar pagos vencidos: {overdueError}
          </Text>
        )}
        {recentPaymentsError && (
          <Text className="text-red-500 p-4">
            Error al cargar pagos recientes: {recentPaymentsError}
          </Text>
        )}
      </View>
    );
  }

  if (
    !recentLoans.length &&
    !upcomingPayments.length &&
    !overduePayments.length &&
    !recentPayments.length
  ) {
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
      {Platform.OS === 'web' ? (
        <View className="grid grid-cols-2 gap-5">
          <RecentTransactions transactions={recentLoans} />
          <RecentPayments payments={recentPayments} />
          <UpcomingPayments payments={upcomingPayments.slice(0, 5)} />
          <OverduePayments payments={overduePayments.slice(0, 5)} />
        </View>
      ) : (
        <>
          <RecentTransactions transactions={recentLoans} />
          <RecentPayments payments={recentPayments} />
          <UpcomingPayments payments={upcomingPayments.slice(0, 5)} />
          <OverduePayments payments={overduePayments.slice(0, 5)} />
        </>
      )}
    </View>
  );
}
