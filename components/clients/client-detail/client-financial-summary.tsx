import { View, Text } from 'react-native';
import { formatCurrency } from '@/utils';
import { ClientDetail } from '@/actions/clients/use-fetch-client-detail';
import NextPayment from '@/components/transactions/transaction-detail/next-payment';

export default function ClientFinancialSummary({
  client,
}: {
  client: ClientDetail;
}) {
  return (
    <View className="flex-col gap-6 h-full">
      <Text className="text-xl font-geist-bold">Resumen financiero</Text>
      <View className="flex-col gap-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-lg text-gray-500 font-geist-medium">
            Pagos a tiempo
          </Text>
          <Text className="text-xl text-green-600 font-geist-bold">
            {client?.profile?.on_time_payments}%
          </Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-lg text-gray-500 font-geist-medium">
            Pagos con retraso
          </Text>
          <Text className="text-xl text-yellow-600 font-geist-bold">
            {client?.profile?.late_payments}%
          </Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-lg text-gray-500 font-geist-medium">
            Pagos no realizados
          </Text>
          <Text className="text-xl text-red-600 font-geist-bold">
            {client?.profile?.missed_payments}%
          </Text>
        </View>
      </View>
      <View className="flex-row justify-between items-center">
        <View className="flex-col gap-1">
          <Text className="text-lg text-gray-500 font-geist-medium">
            Préstamos activos
          </Text>
          <Text className="text-xl font-geist-bold">
            {client.financial_summary.active_loans}
          </Text>
        </View>
        <View className="flex-col gap-1 items-start">
          <Text className="text-lg text-gray-500 font-geist-medium">
            Total préstamos
          </Text>
          <Text className="text-xl font-geist-bold">
            {client.financial_summary.total_loans}
          </Text>
        </View>
      </View>
      <View className="flex-row justify-between items-center">
        <View className="flex-col gap-1">
          <Text className="text-lg text-gray-500 font-geist-medium">
            Saldo pendiente
          </Text>
          <Text className="text-xl text-red-600 font-geist-bold">
            {formatCurrency(client.financial_summary.pending_amount)}
          </Text>
        </View>
        <View className="flex-col gap-1 items-start">
          <Text className="text-lg text-gray-500 font-geist-medium">
            Total préstamos
          </Text>
          <Text className="text-xl font-geist-bold">
            {formatCurrency(client.financial_summary.total_amount)}
          </Text>
        </View>
      </View>
      {client.financial_summary.next_payment && (
        <NextPayment
          nextPaymentDate={client.financial_summary.next_payment.date}
          amount={client.financial_summary.next_payment.amount}
        />
      )}
    </View>
  );
}
