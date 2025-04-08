import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency } from '@/utils';
import { getTransactionTypeText } from '@/utils/transactions';

interface TransactionInfoProps {
  transaction: {
    type: string;
    amount: number;
    payment?: {
      method: string;
    };
  };
}

export default function TransactionInfo({ transaction }: TransactionInfoProps) {
  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'cash':
        return 'Efectivo';
      case 'transfer':
        return 'Transferencia';
      case 'other':
        return 'Otro';
      default:
        return method;
    }
  };

  return (
    <View className="flex-col gap-6 bg-white p-5 border border-gray-100 rounded-xl">
      <Text className="text-xl font-geist-bold">
        Detalles de la transacción
      </Text>
      <View className="flex-col gap-4">
        <View className="flex-row justify-between items-center">
          <View className="flex items-start">
            <Text className="text-gray-500 font-geist-medium text-lg">
              Tipo
            </Text>
            <View className="px-3 py-1 rounded-full bg-gray-100">
              <Text className="font-geist-medium text-sm">
                {getTransactionTypeText(transaction?.type)}
              </Text>
            </View>
          </View>
          <View className="flex-col justify-between items-start">
            <Text className="text-gray-500 font-geist-medium text-lg">
              Monto
            </Text>
            <Text className="font-geist-bold text-lg">
              {formatCurrency(transaction?.amount)}
            </Text>
          </View>
        </View>
        {transaction?.payment && (
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-500 font-geist-medium text-lg">
              Método
            </Text>
            <View className="flex-row items-center gap-1">
              <Text className="font-geist-medium text-lg">
                {getPaymentMethodText(transaction?.payment.method)}
              </Text>
              <Ionicons
                name={
                  transaction?.payment.method === 'cash'
                    ? 'cash-outline'
                    : transaction?.payment.method === 'transfer'
                    ? 'card-outline'
                    : 'ellipsis-horizontal'
                }
                size={15}
                color="#6B7280"
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
