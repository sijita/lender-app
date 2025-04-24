import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import useFetchTransactions, {
  TransactionType,
} from '@/actions/transactions/use-fetch-transactions';
import Error from '@/components/ui/error';
import { formatCurrency } from '@/utils';
import {
  getTransactionTypeStyle,
  getTransactionTypeText,
} from '@/utils/transactions';
import TransactionTabs from './new-transactions/transaction-tabs';
import { format } from '@formkit/tempo';

export default function TransactionList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'loans' | 'payments'>('loans');
  const [orderBy, setOrderBy] = useState('created_at');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('desc');

  const transactionParams = {
    type:
      activeTab === 'loans'
        ? 'loan_disbursement'
        : ('payment' as TransactionType),
    searchQuery: searchQuery,
    orderBy: orderBy,
    orderDirection: orderDirection,
  };

  const { transactions, loading, error, refetch } = useFetchTransactions({
    type:
      activeTab === 'loans'
        ? 'loan_disbursement'
        : ('payment' as TransactionType),
    searchQuery,
    orderBy,
    orderDirection,
  });

  useEffect(() => {
    refetch({
      type: activeTab === 'loans' ? 'loan_disbursement' : ('payment' as const),
      searchQuery,
      orderBy,
      orderDirection,
    });
  }, [activeTab]);

  useEffect(() => {
    const timer = setTimeout(() => {
      refetch({
        type: transactionParams.type,
        searchQuery: searchQuery,
        orderBy: orderBy,
        orderDirection: orderDirection,
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchQuery]);

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

  if (error) return <Error error={error} refetch={refetch} />;

  console.log(transactions[0].created_at);
  console.log(
    format({
      date: new Date(transactions[0].created_at),
      format: 'DD/MM/YYYY',
      tz: 'America/Bogota',
    })
  );

  return (
    <View className="p-5 flex-col gap-5">
      <TransactionTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={[
          { id: 'loans', label: 'Préstamos' },
          { id: 'payments', label: 'Pagos' },
        ]}
      />
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
        <TouchableOpacity
          className="flex-row items-center gap-1 bg-white rounded-lg px-4 py-2 border border-gray-100"
          onPress={() => {
            const newOrderBy =
              orderBy === 'created_at' ? 'amount' : 'created_at';
            setOrderBy(newOrderBy);
            refetch({
              type: transactionParams.type,
              searchQuery,
              orderBy: newOrderBy,
              orderDirection,
            });
          }}
        >
          <Text className="text-black font-geist-medium">
            {orderBy === 'created_at' ? 'Fecha' : 'Monto'}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-white rounded-lg px-[8px] py-[8px] border border-gray-100"
          onPress={() => {
            const newDirection = orderDirection === 'desc' ? 'asc' : 'desc';
            setOrderDirection(newDirection);
            refetch({
              type: transactionParams.type,
              searchQuery,
              orderBy,
              orderDirection: newDirection,
            });
          }}
        >
          <Ionicons
            name={
              orderDirection === 'desc'
                ? 'arrow-down-outline'
                : 'arrow-up-outline'
            }
            size={15}
            color="#000"
          />
        </TouchableOpacity>
      </View>
      <ScrollView horizontal className="w-full">
        <View className="bg-white rounded-xl p-4 border border-gray-100">
          <View className="flex-row px-4 pb-4 border-b border-gray-200">
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
          {transactions.length === 0 ? (
            <View className="py-8 items-center">
              <Text className="text-gray-500">
                No se encontraron transacciones
              </Text>
            </View>
          ) : (
            transactions.map((transaction) => {
              if (
                !transaction.loan ||
                !transaction.loan.client ||
                !transaction.loan.client.name
              ) {
                return null;
              }

              return (
                <TouchableOpacity
                  key={transaction.id}
                  onPress={() => router.push(`/transaction/${transaction.id}`)}
                  className="flex-row items-center px-4 py-3 border-b border-gray-100"
                >
                  <Text className="w-36 font-geist-regular text-gray-600">
                    {format({
                      date: new Date(transaction.created_at),
                      format: 'DD/MM/YYYY',
                      tz: 'America/Bogota',
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
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#9CA3AF"
                    />
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}
