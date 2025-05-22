import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { useState } from 'react';
import useFetchTransactions, {
  PaymentStatus,
} from '@/actions/transactions/use-fetch-transactions';
import Error from '@/components/ui/error';
import { formatCurrency } from '@/utils';
import {
  getTransactionTypeStyle,
  getTransactionTypeText,
} from '@/utils/transactions';
import TransactionTabs from './new-transactions/transaction-tabs';
import { format } from '@formkit/tempo';
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Search,
  X,
} from 'lucide-react-native';
import DynamicIcon from '@/components/ui/dynamic-icon';
import Loading from '@/components/ui/loading';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function TransactionList() {
  const {
    transactions,
    loading,
    error,
    activeTab,
    searchQuery,
    orderBy,
    orderDirection,
    router,
    paymentStatus,
    startDate,
    endDate,
    showDatePicker,
    setShowDatePicker,
    setStartDate,
    setEndDate,
    setPaymentStatus,
    setOrderDirection,
    setOrderBy,
    setSearchQuery,
    setActiveTab,
    refetch,
  } = useFetchTransactions();

  const transactionType =
    activeTab === 'loan' ? 'loan_disbursement' : 'payment';

  if (loading) {
    return <Loading loadingText="Cargando transacciones..." />;
  }

  if (error) {
    return <Error error={error} refetch={refetch} />;
  }

  return (
    <>
      <View className="p-5 flex-col gap-5">
        <TransactionTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={[
            { id: 'loan', label: 'Préstamos' },
            { id: 'payment', label: 'Pagos' },
          ]}
          transactionParams={{
            searchQuery,
            orderBy,
            orderDirection,
            type: transactionType,
            startDate,
            endDate,
          }}
          refetch={refetch}
        />
        {activeTab === 'payment' && (
          <View className="flex-row items-center justify-between bg-gray-50 rounded-lg p-1">
            {['completed', 'upcoming', 'overdue'].map((status) => (
              <TouchableOpacity
                key={status}
                className={`w-full flex-1 py-2 px-3 rounded-lg ${
                  paymentStatus === status ? 'bg-white shadow-sm' : ''
                }`}
                onPress={() => {
                  setPaymentStatus(status as PaymentStatus);
                  refetch({
                    type: transactionType,
                    searchQuery,
                    orderBy,
                    orderDirection,
                  });
                }}
              >
                <Text
                  className={`text-center font-geist-medium ${
                    paymentStatus === status ? 'text-black' : 'text-gray-500'
                  }`}
                >
                  {status === 'completed' && 'Completados'}
                  {status === 'upcoming' && 'Próximos'}
                  {status === 'overdue' && 'Vencidos'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View className="flex-col gap-3">
          <View className="flex-row items-center gap-2">
            <View className="flex-row items-center gap-1 flex-1 bg-white rounded-lg px-3 border border-gray-100">
              <Search size={20} color="#6B7280" />
              <TextInput
                placeholder="Buscar transacciones..."
                className="flex-1 text-base placeholder:font-geist-light sm:p-2"
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
                  type: transactionType,
                  searchQuery,
                  orderBy: newOrderBy,
                  orderDirection,
                });
              }}
            >
              <Text className="text-black font-geist-medium">
                {orderBy === 'created_at' ? 'Fecha' : 'Monto'}
              </Text>
              <ChevronDown size={16} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-white rounded-lg px-[8px] py-[8px] border border-gray-100"
              onPress={() => {
                const newDirection = orderDirection === 'desc' ? 'asc' : 'desc';
                setOrderDirection(newDirection);
                refetch({
                  type: transactionType,
                  searchQuery,
                  orderBy,
                  orderDirection: newDirection,
                });
              }}
            >
              <DynamicIcon
                name={orderDirection === 'desc' ? 'ArrowDown' : 'ArrowUp'}
                size={15}
                color="#000"
              />
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              className="flex-row items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-100 flex-1"
              onPress={() => setShowDatePicker('start')}
            >
              <Calendar size={16} color="#6B7280" />
              <Text className={startDate ? 'text-black' : 'text-gray-500'}>
                {startDate ? format(startDate, 'short', 'es') : 'Fecha inicial'}
              </Text>
              {startDate && (
                <TouchableOpacity
                  className="ml-auto"
                  onPress={() => {
                    setStartDate(null);
                    refetch({
                      type: transactionType,
                      searchQuery,
                      orderBy,
                      orderDirection,
                      paymentStatus:
                        activeTab === 'payment' ? paymentStatus : undefined,
                    });
                  }}
                >
                  <X size={16} color="#6B7280" />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-100 flex-1"
              onPress={() => setShowDatePicker('end')}
            >
              <Calendar size={16} color="#6B7280" />
              <Text className={endDate ? 'text-black' : 'text-gray-500'}>
                {endDate ? format(endDate, 'short', 'es') : 'Fecha final'}
              </Text>
              {endDate && (
                <TouchableOpacity
                  className="ml-auto"
                  onPress={() => {
                    setEndDate(null);
                    refetch({
                      type: transactionType,
                      searchQuery,
                      orderBy,
                      orderDirection,
                      paymentStatus:
                        activeTab === 'payment' ? paymentStatus : undefined,
                    });
                  }}
                >
                  <X size={16} color="#6B7280" />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          className="w-full"
          contentContainerClassName="sm:w-full"
          horizontal
        >
          <View className="w-full bg-white rounded-xl p-4 border border-gray-100">
            <View className="flex-row px-4 pb-4 border-b border-gray-200">
              <Text className="w-36 sm:flex-1 font-geist-medium text-gray-500">
                Fecha
              </Text>
              <Text className="w-40 sm:flex-1 font-geist-medium text-gray-500">
                Cliente
              </Text>
              <Text className="w-40 sm:flex-1 font-geist-medium text-gray-500 text-right">
                Monto
              </Text>
              <Text className="w-40 sm:flex-1 font-geist-medium text-gray-500 text-right">
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
              transactions.map((transaction, index) => {
                if (
                  'loan' in transaction &&
                  transaction.loan &&
                  transaction.loan.client &&
                  transaction.loan.client.name
                ) {
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() =>
                        router.push(`/transaction/${transaction.id}`)
                      }
                      className="flex-row items-center px-4 py-3 border-b border-gray-100"
                    >
                      <Text className="w-36 sm:flex-1 font-geist-regular text-gray-600">
                        {format({
                          date: new Date(transaction.created_at),
                          format: 'medium',
                          locale: 'es',
                          tz: 'UTC',
                        })}
                      </Text>
                      <Text className="w-40 sm:flex-1 font-geist-medium">
                        {`${transaction.loan.client.name} ${transaction.loan.client.last_name}` ||
                          'Cliente desconocido'}
                      </Text>
                      <View className="w-40 sm:flex-1 text-right flex-row items-center justify-end gap-1">
                        <Text className="font-geist-semibold">
                          {formatCurrency(Number(transaction.amount))}
                        </Text>
                        <DynamicIcon
                          name={
                            transaction.type === 'payment'
                              ? 'ArrowDown'
                              : 'ArrowUp'
                          }
                          size={15}
                          color={
                            transaction.type === 'payment'
                              ? '#16a34a'
                              : '#2563eb'
                          }
                        />
                      </View>
                      <View className="w-40 sm:flex-1 items-end shrink-0">
                        <Text
                          className={`px-3 py-1 rounded-full text-xs font-geist-medium ${getTransactionTypeStyle(
                            transaction.type
                          )}`}
                        >
                          {getTransactionTypeText(transaction.type)}
                        </Text>
                      </View>
                      <View className="w-16 items-end">
                        <ChevronRight size={20} color="#9CA3AF" />
                      </View>
                    </TouchableOpacity>
                  );
                }
                if (
                  'transactionId' in transaction &&
                  'clientName' in transaction
                ) {
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() =>
                        router.push(`/transaction/${transaction.transactionId}`)
                      }
                      className={`flex-row items-center px-4 py-3 border-b border-gray-100 ${
                        paymentStatus === 'upcoming'
                          ? 'bg-yellow-50'
                          : paymentStatus === 'overdue' && 'bg-red-50'
                      }`}
                    >
                      <Text className="w-36 sm:flex-1 font-geist-regular text-gray-600">
                        {transaction.paymentDate}
                      </Text>
                      <Text className="w-40 sm:flex-1 font-geist-medium">
                        {transaction.clientName}
                      </Text>
                      <View className="w-40 sm:flex-1 text-right flex-row items-center justify-end gap-1">
                        <Text className="font-geist-semibold">
                          {formatCurrency(Number(transaction.amount))}
                        </Text>
                        <DynamicIcon
                          name={'ArrowDown'}
                          size={15}
                          color={'#f59e42'}
                        />
                      </View>
                      <View className="w-40 sm:flex-1 items-end shrink-0">
                        <Text
                          className={`px-3 py-1 rounded-full text-xs font-geist-medium ${
                            paymentStatus === 'upcoming'
                              ? 'bg-yellow-200 text-yellow-800'
                              : paymentStatus === 'overdue' &&
                                'bg-red-200 text-red-800'
                          }`}
                        >
                          {paymentStatus === 'upcoming'
                            ? 'Próximo'
                            : paymentStatus === 'overdue'
                            ? 'Vencido'
                            : 'Pendiente'}
                        </Text>
                      </View>
                      <View className="w-16 items-end">
                        <ChevronRight size={20} color="#9CA3AF" />
                      </View>
                    </TouchableOpacity>
                  );
                }
                return null;
              })
            )}
          </View>
        </ScrollView>
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={
            showDatePicker === 'start'
              ? startDate || new Date()
              : endDate || new Date()
          }
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            console.log('selectedDate', selectedDate);
            if (event.type === 'set' && selectedDate) {
              if (showDatePicker === 'start') {
                setStartDate(selectedDate);
              } else {
                setEndDate(selectedDate);
              }
            }
            setShowDatePicker(null);
          }}
        />
      )}
    </>
  );
}
