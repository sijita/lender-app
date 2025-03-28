import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Transaction = {
  date: string;
  client: string;
  description: string;
  amount: number;
  type: 'loan' | 'payment' | 'fee';
  balance: number;
};

type TransactionListProps = {
  transactions: Transaction[];
};

export default function TransactionList({
  transactions,
}: TransactionListProps) {
  return (
    <View className="flex-1 p-5 flex-col gap-5">
      <View className="flex-row items-center gap-2">
        <View className="flex-row items-center gap-1 flex-1 bg-white rounded-lg px-3">
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            placeholder="Buscar transacciones..."
            className="flex-1 text-base"
            placeholderTextColor="#6B7280"
          />
        </View>
        <TouchableOpacity className="flex-row items-center gap-1 border border-gray-200 rounded-lg px-4 py-2">
          <Text className="text-black font-geist-medium">Tipo</Text>
          <Ionicons name="chevron-down" size={16} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity className="border border-gray-200 rounded-lg px-[8px] py-[8px]">
          <Ionicons name="calendar-number-outline" size={15} color="#000" />
        </TouchableOpacity>
      </View>
      <ScrollView horizontal className="w-full">
        <View>
          <View className="flex-row px-4 py-2 border-b border-gray-200">
            <Text className="w-36 font-geist-medium text-gray-500">Fecha</Text>
            <Text className="w-52 font-geist-medium text-gray-500">
              Cliente
            </Text>
            <Text className="w-40 font-geist-medium text-gray-500">
              Descripción
            </Text>
            <Text className="w-32 font-geist-medium text-gray-500 text-right">
              Monto
            </Text>
            <Text className="w-60 font-geist-medium text-gray-500 text-center">
              Tipo
            </Text>
            <Text className="w-28 font-geist-medium text-gray-500 text-right">
              Balance
            </Text>
          </View>
          {transactions.map((transaction, index) => (
            <View
              key={index}
              className="flex-row items-center px-4 py-3 border-b border-gray-100"
            >
              <Text className="w-36 font-geist-regular text-gray-600">
                {transaction.date}
              </Text>
              <Text className="w-52 font-geist-medium">
                {transaction.client}
              </Text>
              <Text className="w-40 text-gray-600">
                {transaction.description}
              </Text>
              <View className="w-32 flex-row items-center justify-end gap-1">
                <Text className="font-geist-semibold">
                  ${transaction.amount.toLocaleString()}
                </Text>
                <Ionicons
                  name="arrow-down-outline"
                  size={15}
                  color={
                    transaction.type === 'loan'
                      ? 'green'
                      : transaction.type === 'payment'
                      ? 'green'
                      : 'orange'
                  }
                />
              </View>
              <View className="w-60 items-center">
                <Text
                  className={`px-3 py-1 rounded-full text-xs font-geist-medium ${
                    transaction.type === 'loan'
                      ? 'bg-blue-100 text-blue-800'
                      : transaction.type === 'payment'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}
                >
                  {transaction.type === 'loan'
                    ? 'Préstamo'
                    : transaction.type === 'payment'
                    ? 'Pago'
                    : 'Cargo'}
                </Text>
              </View>
              <Text className="w-28 font-geist-semibold text-right">
                ${transaction.balance.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
