import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter } from 'expo-router';
import useFetchTransactions from '@/actions/transactions/use-fetch-transactions';
import Error from '@/components/ui/error';
import { formatCurrency } from '@/utils';
import {
  getTransactionTypeStyle,
  getTransactionTypeText,
} from '@/utils/transactions';

export default function TransactionList() {
  const router = useRouter();
  const { transactions, loading, error, refetch } = useFetchTransactions();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.loan?.client?.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.amount.toString().includes(searchQuery) ||
      transaction.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (transaction.notes &&
        transaction.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getTransactionIcon = (type: string) => {
    if (type === 'payment') {
      return <Ionicons name="arrow-down-outline" size={15} color="#16a34a" />;
    } else {
      return <Ionicons name="arrow-up-outline" size={15} color="#2563eb" />;
    }
  };

  if (loading) {
    return (
      <View className="min-h-screen flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-2 text-gray-500">Cargando transacciones...</Text>
      </View>
    );
  }

  if (error) <Error error={error} refetch={refetch} />;

  return (
    <View className="p-5 flex-col gap-5">
      <View className="flex-row items-center gap-2">
        <View className="flex-row items-center gap-1 flex-1 bg-white rounded-lg px-3 border border-gray-100">
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            placeholder="Buscar transacciones..."
            className="flex-1 text-base placeholder:font-geist-light"
            placeholderTextColor="#6B7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
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
            <Text className="w-40 font-geist-medium text-gray-500">
              Cliente
            </Text>
            <Text className="w-40 font-geist-medium text-gray-500 text-right">
              Monto
            </Text>
            <Text className="w-40 font-geist-medium text-gray-500 text-right">
              Tipo
            </Text>
            <View className="w-16" />
          </View>
          {filteredTransactions.length === 0 ? (
            <View className="py-8 items-center">
              <Text className="text-gray-500">
                No se encontraron transacciones
              </Text>
            </View>
          ) : (
            filteredTransactions.map((transaction) => (
              <TouchableOpacity
                key={transaction.id}
                onPress={() => router.push(`/transaction/${transaction.id}`)}
                className="flex-row items-center px-4 py-3 border-b border-gray-100"
              >
                <Text className="w-36 font-geist-regular text-gray-600">
                  {format(new Date(transaction.created_at), 'dd/MM/yyyy', {
                    locale: es,
                  })}
                </Text>
                <Text className="w-40 font-geist-medium">
                  {`${transaction.loan?.client?.name} ${transaction?.loan?.client?.last_name}` ||
                    'Cliente desconocido'}
                </Text>
                <View className="w-40 text-right flex-row items-center justify-end gap-1">
                  <Text className="font-geist-semibold">
                    {formatCurrency(Number(transaction.amount))}
                  </Text>
                  {getTransactionIcon(transaction.type)}
                </View>
                <View className="w-40 items-end shrink-0">
                  <Text
                    className={`px-3 py-1 rounded-full text-xs font-geist-medium ${getTransactionTypeStyle(
                      transaction.type
                    )}`}
                  >
                    {getTransactionTypeText(transaction.type)}
                  </Text>
                </View>
                <View className="w-16 items-end">
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
