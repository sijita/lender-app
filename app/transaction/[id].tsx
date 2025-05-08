import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
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
      <View className="p-5 flex-col gap-5">
        <View className="p-5 border-b border-gray-200">
          <Text className="text-gray-500 font-geist-medium text-lg">
            {formattedDate}
          </Text>
        </View>
        {transaction?.loan?.client && (
          <ClientInfo client={transaction.loan.client} />
        )}
        <TransactionInfo transaction={transaction} />
        {transaction?.loan && <LoanInfo loan={transaction.loan} />}
        <QuickActions loanId={transaction?.loan?.id} />
      </View>
    </CustomSafeScreen>
  );
}
