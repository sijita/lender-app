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
      ? Math.min(Math.round((loan.paid_amount / loan.total_amount) * 100), 100)
      : 0;

  return (
    <View className="flex-col gap-8 p-5 bg-white rounded-xl border border-gray-100 sm:flex-1">
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
        <Text className="text-lg text-gray-500 font-geist-medium">
          Total a Pagar
        </Text>
        <Text className="text-xl font-geist-bold">
          {formatCurrency(loan?.total_amount)}
        </Text>
      </View>
      <View className="flex-row flex-wrap gap-1 justify-between items-center">
        <View className="flex-col gap-6 items-start">
          <View className="flex-col gap-1 items-start">
            <Text className="text-lg text-gray-500 font-geist-medium">
              Monto del Préstamo
            </Text>
            <Text className="text-xl font-geist-bold">
              {formatCurrency(loan?.amount)}
            </Text>
          </View>
          <View className="flex-col gap-1 items-start">
            <Text className="text-lg text-gray-500 font-geist-medium">
              Plazo
            </Text>
            <Text className="text-lg font-geist-medium">
              {loan?.term} Cuotas
            </Text>
          </View>
          <View className="flex-col gap-1 items-start">
            <Text className="text-lg text-gray-500 font-geist-medium">
              Cuotas pendientes
            </Text>
            <Text className="text-lg font-geist-medium">
              {loan?.pending_quotas}
            </Text>
          </View>
        </View>
        <View className="flex-col gap-6 items-start">
          <View className="flex-col gap-1 items-start">
            <Text className="text-lg text-gray-500 font-geist-medium">
              Tasa de Interés
            </Text>
            <Text className="text-xl font-geist-bold">
              {loan?.interest_rate}%
            </Text>
          </View>
          <View className="flex-col items-start">
            <Text className="text-lg text-gray-500 font-geist-medium">
              Frecuencia
            </Text>
            <Text className="text-lg font-geist-medium">
              {getPaymentFrequencyText(loan?.payment_frequency)}
            </Text>
          </View>
          <View className="flex-col items-start">
            <Text className="text-lg text-gray-500 font-geist-medium">
              Cuotas pagadas
            </Text>
            <Text className="text-lg font-geist-medium">
              {loan?.term - loan?.pending_quotas}
            </Text>
          </View>
        </View>
      </View>
      <View className="flex-col gap-3">
        <View className="flex-col gap-2">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg text-gray-500 font-geist-medium">
              Progreso del Préstamo
            </Text>
            <Text className="text-xl font-geist-bold">
              {progressPercentage}%
            </Text>
          </View>
          <View className="overflow-hidden w-full h-3 bg-gray-200 rounded-full">
            <View
              className="h-full bg-green-500 rounded-full"
              style={{
                width: `${progressPercentage}%`,
              }}
            />
          </View>
        </View>
        <View className="flex-row flex-wrap gap-1 justify-between items-center">
          <View className="flex-col justify-between items-start">
            <Text className="text-lg text-gray-500 font-geist-medium">
              Saldo Pendiente
            </Text>
            <Text className="text-xl text-red-600 font-geist-bold">
              {formatCurrency(loan?.outstanding)}
            </Text>
          </View>
          <View className="flex-col justify-between items-end">
            <Text className="text-lg text-gray-500 font-geist-medium">
              Pagado
            </Text>
            <Text className="text-xl text-green-600 font-geist-bold">
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
