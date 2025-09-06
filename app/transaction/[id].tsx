import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import useFetchTransactionDetail from '@/actions/transactions/use-fetch-transaction-detail';
import Error from '@/components/ui/error';
import BackButton from '@/components/ui/back-button';
import ClientInfo from '@/components/transactions/transaction-detail/client-info';
import TransactionInfo from '@/components/transactions/transaction-detail/transaction-info';
import LoanInfo from '@/components/transactions/transaction-detail/loan-info';
import QuickActions from '@/components/transactions/transaction-detail/quick-actions';
import { format } from '@formkit/tempo';
import { ArrowLeft } from 'lucide-react-native';
import CustomSafeScreen from '@/components/ui/custom-safe-screen';
import Loading from '@/components/ui/loading';

export default function TransactionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { transaction, loading, error, refetch } = useFetchTransactionDetail(
    Number(id)
  );

  if (loading) {
    return <Loading loadingText="Cargando detalles de la transacción..." />;
  }

  if (error) {
    return <Error error={error} refetch={refetch} />;
  }

  if (!loading && !transaction) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-lg text-gray-800 font-geist-medium">
          Transacción no encontrada
        </Text>
        <TouchableOpacity
          className="flex-row gap-2 items-center px-4 py-2 mt-4 bg-black rounded-full"
          onPress={() => router.back()}
        >
          <ArrowLeft size={16} color="white" />
          <Text className="text-white font-geist-medium">Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formattedDate = transaction?.created_at
    ? format(new Date(transaction?.created_at), 'full', 'es')
    : 'Fecha desconocida';

  return (
    <CustomSafeScreen>
      <Stack.Screen options={{ headerShown: false }} />
      <BackButton title={`Transacción #${transaction?.id}`} />
      <View className="flex-col gap-5 p-5">
        <View className="p-5 border-b border-gray-200">
          <Text className="text-lg text-gray-500 font-geist-medium">
            {formattedDate}
          </Text>
        </View>
        {transaction && transaction?.loan?.client && (
          <View className="flex-col gap-5 sm:flex-row sm:gap-5">
            <View className="flex-col gap-5 sm:flex-col sm:gap-5">
              <ClientInfo client={transaction.loan.client} />
              <TransactionInfo transaction={transaction} />
              {Platform.OS === 'web' && (
                <QuickActions
                  loanId={transaction.loan.id}
                  clientId={transaction.loan.client.id.toString()}
                />
              )}
            </View>
            <LoanInfo loan={transaction.loan} />
            {Platform.OS !== 'web' && (
              <QuickActions
                loanId={transaction.loan.id}
                clientId={transaction.loan.client.id.toString()}
              />
            )}
          </View>
        )}
      </View>
    </CustomSafeScreen>
  );
}
