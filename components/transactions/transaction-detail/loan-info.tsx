import { View, Text } from 'react-native';
import { formatCurrency } from '@/utils';
import LoanPayments from './loan-payments';
import NextPayment from './next-payment';
import { getPaymentFrequencyText } from '@/utils/loans';

export default function LoanInfo({
  loan,
}: {
  loan: {
    id: number;
    amount: number;
    interest_rate: number;
    term: number;
    payment_frequency: string;
    total_amount: number;
    outstanding: number;
    paid_amount: number;
    pending_quotas: number;
    status: string;
    due_date: string;
    quota: number;
    payment_date: string;
  };
}) {
  const progressPercentage =
    loan?.total_amount && loan?.paid_amount
      ? Math.round((loan.paid_amount / loan.total_amount) * 100)
      : 0;

  return (
    <View className="sm:flex-1 flex-col gap-8 bg-white p-5 border border-gray-100 rounded-xl">
      <View className="flex-row justify-between items-center">
        <Text className="text-xl font-geist-bold">Detalles del préstamo</Text>
        <View className="flex items-end shrink-0">
          <Text
            className={`px-2 py-1 rounded-full text-xs font-geist-medium ${
              loan.status === 'completed'
                ? 'bg-green-100 text-green-800'
                : loan.status === 'defaulted'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {loan.status === 'completed'
              ? 'Libre'
              : loan.status === 'defaulted'
              ? 'En Mora'
              : 'Pendiente'}
          </Text>
        </View>
      </View>
      <View className="flex-row justify-between items-center">
        <Text className="text-gray-500 font-geist-medium text-lg">
          Total a Pagar
        </Text>
        <Text className="font-geist-bold text-xl">
          {formatCurrency(loan?.total_amount)}
        </Text>
      </View>
      <View className="flex-row gap-1 justify-between items-center flex-wrap">
        <View className="flex-col gap-6 items-start">
          <View className="flex-col gap-1 items-start">
            <Text className="text-gray-500 font-geist-medium text-lg">
              Monto del Préstamo
            </Text>
            <Text className="font-geist-bold text-xl">
              {formatCurrency(loan?.amount)}
            </Text>
          </View>
          <View className="flex-col items-start gap-1">
            <Text className="text-gray-500 font-geist-medium text-lg">
              Plazo
            </Text>
            <Text className="font-geist-medium text-lg">
              {loan?.term} Cuotas
            </Text>
          </View>
          <View className="flex-col items-start gap-1">
            <Text className="text-gray-500 font-geist-medium text-lg">
              Cuotas pendientes
            </Text>
            <Text className="font-geist-medium text-lg">
              {loan?.pending_quotas}
            </Text>
          </View>
        </View>
        <View className="flex-col gap-6 items-start">
          <View className="flex-col gap-1 items-start">
            <Text className="text-gray-500 font-geist-medium text-lg">
              Tasa de Interés
            </Text>
            <Text className="font-geist-bold text-xl">
              {loan?.interest_rate}%
            </Text>
          </View>
          <View className="flex-col items-start">
            <Text className="text-gray-500 font-geist-medium text-lg">
              Frecuencia
            </Text>
            <Text className="font-geist-medium text-lg">
              {getPaymentFrequencyText(loan?.payment_frequency)}
            </Text>
          </View>
          <View className="flex-col items-start">
            <Text className="text-gray-500 font-geist-medium text-lg">
              Cuotas pagadas
            </Text>
            <Text className="font-geist-medium text-lg">
              {loan?.term - loan?.pending_quotas}
            </Text>
          </View>
        </View>
      </View>
      <View className="flex-col gap-3">
        <View className="flex-col gap-2">
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-500 font-geist-medium text-lg">
              Progreso del Préstamo
            </Text>
            <Text className="font-geist-bold text-xl">
              {progressPercentage}%
            </Text>
          </View>
          <View className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
            <View
              className="h-full bg-green-500 rounded-full"
              style={{
                width: `${progressPercentage}%`,
              }}
            />
          </View>
        </View>
        <View className="flex-row gap-1 items-center justify-between flex-wrap">
          <View className="flex-col justify-between items-start">
            <Text className="text-gray-500 font-geist-medium text-lg">
              Saldo Pendiente
            </Text>
            <Text className="font-geist-bold text-red-600 text-xl">
              {formatCurrency(loan?.outstanding)}
            </Text>
          </View>
          <View className="flex-col justify-between items-end">
            <Text className="text-gray-500 font-geist-medium text-lg">
              Pagado
            </Text>
            <Text className="font-geist-bold text-green-600 text-xl">
              {formatCurrency(loan?.paid_amount)}
            </Text>
          </View>
        </View>
      </View>
      {loan?.status !== 'completed' && (
        <NextPayment
          nextPaymentDate={loan?.payment_date}
          amount={loan?.quota}
        />
      )}
      <LoanPayments loanId={loan.id} />
    </View>
  );
}
