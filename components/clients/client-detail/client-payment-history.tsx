import { View, Text } from 'react-native';
import { formatCurrency } from '@/utils';

export default function ClientPaymentHistory({
  payments,
}: {
  payments: Array<{
    id: number;
    date: string;
    amount: number;
    status: string;
  }>;
}) {
  return (
    <View className="flex-col gap-6">
      <Text className="text-xl font-geist-bold">Historial de pagos</Text>
      <View className="flex-col gap-4">
        {payments.length > 0 ? (
          <View className="flex-col gap-3">
            <View className="flex-row px-4 pb-4 border-b border-gray-200">
              <Text className="w-20 text-sm text-left text-gray-500 font-geist-medium">
                ID
              </Text>
              <Text className="flex-1 text-sm text-gray-500 font-geist-medium">
                Monto
              </Text>
              <Text className="flex-1 w-24 text-sm text-right text-gray-500 font-geist-medium">
                Estado
              </Text>
              <Text className="w-20 text-sm text-right text-gray-500 font-geist-medium">
                Fecha
              </Text>
            </View>
            {payments.map((payment) => (
              <View
                key={payment.id}
                className="flex-row justify-between items-center p-2 border-b border-gray-100"
              >
                <Text className="w-20 text-sm text-left text-gray-800 font-geist-medium">
                  #{payment.id}
                </Text>
                <Text className="flex-1 text-sm text-gray-800 font-geist-medium">
                  {formatCurrency(payment.amount)}
                </Text>
                <View className="flex-1 items-end w-24">
                  <Text
                    className={`px-2 py-1 rounded-full text-xs font-geist-medium ${
                      payment.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : payment.status === 'partial'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {payment.status === 'completed'
                      ? 'Completado'
                      : payment.status === 'partial'
                      ? 'Parcial'
                      : 'Fallido'}
                  </Text>
                </View>
                <Text className="w-20 text-sm text-right text-gray-800 font-geist-medium">
                  {new Date(payment.date).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                  })}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <View className="items-center py-4">
            <Text className="text-gray-500">No hay pagos registrados</Text>
          </View>
        )}
      </View>
    </View>
  );
}
