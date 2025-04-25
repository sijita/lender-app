import { View, Text } from 'react-native';
import { formatCurrency } from '@/utils';
import { ClientDetail } from '@/actions/clients/use-fetch-client-detail';
import { format } from '@formkit/tempo';
import { Calendar } from 'lucide-react-native';

export default function ClientFinancialSummary({
  client,
}: {
  client: ClientDetail;
}) {
  return (
    <View className="flex-col gap-6">
      <Text className="text-xl font-geist-bold">Resumen Financiero</Text>
      <View className="flex-col gap-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-500 font-geist-medium text-lg">
            Pagos a tiempo
          </Text>
          <Text className="font-geist-bold text-green-600 text-xl">
            {client?.profile?.on_time_payments}%
          </Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-500 font-geist-medium text-lg">
            Pagos con retraso
          </Text>
          <Text className="font-geist-bold text-yellow-600 text-xl">
            {client?.profile?.late_payments}%
          </Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-500 font-geist-medium text-lg">
            Pagos no realizados
          </Text>
          <Text className="font-geist-bold text-red-600 text-xl">
            {client?.profile?.missed_payments}%
          </Text>
        </View>
      </View>
      <View className="flex-row justify-between items-center">
        <View className="flex-col gap-1">
          <Text className="text-gray-500 font-geist-medium text-lg">
            Préstamos activos
          </Text>
          <Text className="font-geist-bold text-xl">
            {client.financial_summary.total_loans}
          </Text>
        </View>
        <View className="flex-col gap-1 items-start">
          <Text className="text-gray-500 font-geist-medium text-lg">
            Total préstamos
          </Text>
          <Text className="font-geist-bold text-xl">
            {client.financial_summary.active_loans}
          </Text>
        </View>
      </View>
      <View className="flex-row justify-between items-center">
        <View className="flex-col gap-1">
          <Text className="text-gray-500 font-geist-medium text-lg">
            Saldo pendiente
          </Text>
          <Text className="font-geist-bold text-xl text-red-600">
            {formatCurrency(client.financial_summary.pending_amount)}
          </Text>
        </View>
        <View className="flex-col gap-1 items-start">
          <Text className="text-gray-500 font-geist-medium text-lg">
            Total préstamos
          </Text>
          <Text className="font-geist-bold text-xl">
            {formatCurrency(client.financial_summary.total_amount)}
          </Text>
        </View>
      </View>
      {client.financial_summary.next_payment && (
        <View className="flex-row justify-between items-center p-4 bg-yellow-50 rounded-lg border border-yellow-100">
          <View className="flex-row items-center gap-3">
            <Calendar size={20} color="#000" />
            <View className="flex-col">
              <Text className="font-geist-bold text-lg">Próximo pago</Text>
              <Text className="text-gray-700">
                {format(
                  new Date(client.financial_summary.next_payment.date),
                  'full',
                  'es'
                )}
              </Text>
            </View>
          </View>
          <View className="flex-row justify-between">
            <Text className="font-geist-bold text-xl">
              {formatCurrency(client.financial_summary.next_payment.amount)}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
