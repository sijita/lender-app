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
              <Text className="text-gray-500 font-geist-medium text-sm w-20 text-left">
                ID
              </Text>
              <Text className="text-gray-500 font-geist-medium text-sm flex-1">
                Monto
              </Text>
              <Text className="text-gray-500 font-geist-medium text-sm w-24 text-right flex-1">
                Estado
              </Text>
              <Text className="text-gray-500 font-geist-medium text-sm w-20 text-right">
                Fecha
              </Text>
            </View>
            {payments.map((payment) => (
              <View
                key={payment.id}
                className="flex-row justify-between items-center p-2 border-b border-gray-100"
              >
                <Text className="text-gray-800 font-geist-medium text-sm w-20 text-left">
                  #{payment.id}
                </Text>
                <Text className="text-gray-800 font-geist-medium text-sm flex-1">
                  {formatCurrency(payment.amount)}
                </Text>
                <View className="w-24 items-end flex-1">
                  <Text
                    className={`px-2 py-1 rounded-full text-xs font-geist-medium ${
                      payment.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : payment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {payment.status === 'completed'
                      ? 'Completado'
                      : payment.status === 'pending'
                      ? 'Pendiente'
                      : 'Fallido'}
                  </Text>
                </View>
                <Text className="text-gray-800 font-geist-medium text-sm w-20 text-right">
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
          <View className="py-4 items-center">
            <Text className="text-gray-500">No hay pagos registrados</Text>
          </View>
        )}
      </View>
    </View>
  );
}
