import { View, Text } from 'react-native';
import { formatCurrency } from '@/utils';
import {
  getTransactionTypeStyle,
  getTransactionTypeText,
} from '@/utils/transactions';
import { getPaymentMethodText } from '@/utils/loans';
import DynamicIcon from '@/components/ui/dynamic-icon';
import { TransactionDetail } from '@/types/transactions';

export default function TransactionInfo({
  transaction,
}: {
  transaction: TransactionDetail;
}) {
  return (
    <View className="sm:flex-1 flex-col gap-6 bg-white p-5 border border-gray-100 rounded-xl">
      <Text className="text-xl font-geist-bold">
        Detalles de la transacción
      </Text>
      <View className="flex-col gap-4">
        <View className="flex-row justify-between items-center">
          <View className="flex items-start">
            <Text className="text-gray-500 font-geist-medium text-lg">
              Tipo
            </Text>
            <View>
              <Text
                className={`px-3 py-1 rounded-full text-xs font-geist-medium ${getTransactionTypeStyle(
                  transaction?.type
                )}`}
              >
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
              <DynamicIcon
                name={
                  transaction?.payment.method === 'cash'
                    ? 'Banknote'
                    : transaction?.payment.method === 'transfer'
                    ? 'Landmark'
                    : 'Ellipsis'
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
