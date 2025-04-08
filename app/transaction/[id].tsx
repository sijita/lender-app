import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import useFetchTransactionDetail from '@/actions/transactions/use-fetch-transaction-detail';
import Error from '@/components/ui/error';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import BackButton from '@/components/ui/back-button';
import ClientInfo from '@/components/transactions/transaction-detail/client-info';
import TransactionInfo from '@/components/transactions/transaction-detail/transaction-info';
import LoanInfo from '@/components/transactions/transaction-detail/loan-info';
import LoanPayments from '@/components/transactions/transaction-detail/loan-payments';
import QuickActions from '@/components/transactions/transaction-detail/quick-actions';

export default function TransactionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { transaction, loading, error, refetch } = useFetchTransactionDetail(
    Number(id)
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-2 text-gray-500">Cargando detalles...</Text>
      </View>
    );
  }

  if (error) {
    return <Error error={error} refetch={refetch} />;
  }

  if (!transaction) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-lg font-geist-medium text-gray-800">
          Transacción no encontrada
        </Text>
        <TouchableOpacity
          className="mt-4 flex-row items-center gap-2 bg-black px-4 py-2 rounded-full"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={16} color="white" />
          <Text className="text-white font-geist-medium">Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formattedDate = transaction?.created_at
    ? format(new Date(transaction?.created_at), "dd 'de' MMMM, yyyy", {
        locale: es,
      })
    : 'Fecha desconocida';

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />
      <BackButton title={`Transacción #${transaction?.id}`} />
      <View className="p-5 flex-col gap-5">
        <View className="p-5 border-b border-gray-200">
          <Text className="text-gray-500 font-geist-medium text-lg">
            {formattedDate}
          </Text>
        </View>
        {transaction?.loan?.client && (
          <ClientInfo
            client={transaction.loan.client}
            loanStatus={transaction.loan.status}
          />
        )}
        <TransactionInfo transaction={transaction} />
        {transaction?.loan && (
          <>
            <LoanInfo loan={transaction.loan} />
            <LoanPayments loanId={transaction.loan.id} />
          </>
        )}
        <QuickActions />
      </View>
    </ScrollView>
  );
}
