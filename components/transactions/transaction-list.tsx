import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
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
  Receipt,
} from 'lucide-react-native';
import DynamicIcon from '@/components/ui/dynamic-icon';
import Loading from '@/components/ui/loading';
import DateTimePicker from '@react-native-community/datetimepicker';
import PaginationButtons from '../ui/pagination-buttons';
import { Platform } from 'react-native';
import usePaymentReceipt from '@/hooks/use-payment-receipt';
import PaymentReceipt from './payment-receipt';

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
    page,
    setPage,
    pageSize,
    totalTransactions,
  } = useFetchTransactions();

  const {
    showReceipt,
    receiptData,
    generateReceiptFromPaymentId,
    closeReceipt,
  } = usePaymentReceipt();

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
      <View className="flex-col gap-5 p-5">
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
          <View className="flex-row justify-between items-center p-1 bg-gray-50 rounded-xl">
            {['completed', 'upcoming', 'overdue'].map(status => (
              <TouchableOpacity
                key={status}
                className={`w-full flex-1 py-2 px-3 rounded-xl ${
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
          <View className="flex-row gap-2 items-center">
            <View className="flex-row flex-1 gap-1 items-center px-3 bg-white rounded-xl border border-gray-100">
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
              className="flex-row gap-1 items-center px-4 py-2 bg-white rounded-xl border border-gray-100"
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
              className="bg-white rounded-xl px-[8px] py-[8px] border border-gray-100"
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
          <View className="flex-row gap-2 items-center">
            {Platform.OS === 'web' ? (
              <input
                type="date"
                value={
                  showDatePicker === 'start'
                    ? format(startDate || new Date(), 'YYYY-MM-DD')
                    : format(endDate || new Date(), 'YYYY-MM-DD')
                }
                onChange={e => {
                  const [year, month, day] = e.target.value
                    .split('-')
                    .map(Number);
                  const selectedDate = new Date(year, month - 1, day);
                  if (selectedDate) {
                    if (showDatePicker === 'start') {
                      setStartDate(selectedDate);
                    } else {
                      setEndDate(selectedDate);
                    }
                  }
                }}
                className={`flex-1 p-3 rounded-xl border border-gray-200`}
                style={{
                  fontFamily: 'GeistMedium',
                  fontSize: 16,
                  outline: 'none',
                }}
              />
            ) : (
              <TouchableOpacity
                className="flex-row flex-1 gap-2 items-center px-3 py-2 bg-white rounded-xl border border-gray-100"
                onPress={() => setShowDatePicker('start')}
              >
                <Calendar size={16} color="#6B7280" />
                <Text className={startDate ? 'text-black' : 'text-gray-500'}>
                  {startDate
                    ? format(startDate, 'short', 'es')
                    : 'Fecha inicial'}
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
            )}
            {Platform.OS === 'web' ? (
              <input
                type="date"
                value={
                  showDatePicker === 'end'
                    ? format(endDate || new Date(), 'YYYY-MM-DD')
                    : format(startDate || new Date(), 'YYYY-MM-DD')
                }
                onChange={e => {
                  const [year, month, day] = e.target.value
                    .split('-')
                    .map(Number);
                  const selectedDate = new Date(year, month - 1, day);
                  if (selectedDate) {
                    if (showDatePicker === 'end') {
                      setEndDate(selectedDate);
                    } else {
                      setStartDate(selectedDate);
                    }
                  }
                }}
                className={`flex-1 p-3 rounded-xl border border-gray-200`}
                style={{
                  fontFamily: 'GeistMedium',
                  fontSize: 16,
                  outline: 'none',
                }}
              />
            ) : (
              <TouchableOpacity
                className="flex-row flex-1 gap-2 items-center px-3 py-2 bg-white rounded-xl border border-gray-100"
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
            )}
          </View>
        </View>
        <ScrollView
          className="w-full"
          contentContainerClassName="sm:w-full"
          horizontal
        >
          <View className="p-4 w-full bg-white rounded-xl border border-gray-100">
            <View className="flex-row px-4 pb-4 border-b border-gray-200">
              <Text className="w-36 text-gray-500 sm:flex-1 font-geist-medium">
                Fecha
              </Text>
              <Text className="w-40 text-gray-500 sm:flex-1 font-geist-medium">
                Cliente
              </Text>
              <Text className="w-40 text-right text-gray-500 sm:flex-1 font-geist-medium">
                Monto
              </Text>
              <Text className="w-40 text-right text-gray-500 sm:flex-1 font-geist-medium">
                Tipo
              </Text>
              {activeTab === 'payment' && (
                <Text className="w-20 text-center text-gray-500 font-geist-medium">
                  Recibo
                </Text>
              )}
              <View className="w-16" />
            </View>
            {transactions.length === 0 ? (
              <View className="items-center py-8">
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
                      <Text className="w-36 text-gray-600 sm:flex-1 font-geist-regular">
                        {format({
                          date: new Date(transaction.created_at),
                          format: 'medium',
                          locale: 'es',
                          tz: 'America/Bogota',
                        })}
                      </Text>
                      <Text className="w-40 sm:flex-1 font-geist-medium">
                        {`${transaction.loan.client.name} ${transaction.loan.client.last_name}` ||
                          'Cliente desconocido'}
                      </Text>
                      <View className="flex-row gap-1 justify-end items-center w-40 text-right sm:flex-1">
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
                      <View className="items-end w-40 sm:flex-1 shrink-0">
                        <Text
                          className={`px-3 py-1 rounded-full text-xs font-geist-medium ${getTransactionTypeStyle(
                            transaction.type
                          )}`}
                        >
                          {getTransactionTypeText(transaction.type)}
                        </Text>
                      </View>
                      {activeTab === 'payment' &&
                        transaction.type === 'payment' && (
                          <TouchableOpacity
                            className="w-20 items-center"
                            onPress={e => {
                              e.stopPropagation();
                              // Solo generar recibo si existe payment_id
                              if (transaction.payment_id) {
                                generateReceiptFromPaymentId(
                                  transaction.payment_id
                                );
                              }
                            }}
                          >
                            <Receipt size={16} color="#3B82F6" />
                          </TouchableOpacity>
                        )}
                      <View className="items-end w-16">
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
                      <Text className="w-36 text-gray-600 sm:flex-1 font-geist-regular">
                        {transaction.paymentDate}
                      </Text>
                      <Text className="w-40 sm:flex-1 font-geist-medium">
                        {transaction.clientName}
                      </Text>
                      <View className="flex-row gap-1 justify-end items-center w-40 text-right sm:flex-1">
                        <Text className="font-geist-semibold">
                          {formatCurrency(Number(transaction.amount))}
                        </Text>
                        <DynamicIcon
                          name={'ArrowDown'}
                          size={15}
                          color={'#f59e42'}
                        />
                      </View>
                      <View className="items-end w-40 sm:flex-1 shrink-0">
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
                      {paymentStatus === 'completed' && (
                        <TouchableOpacity
                          className="w-20 items-center"
                          onPress={e => {
                            e.stopPropagation();
                            // Solo generar recibo si existe transactionId (que es el payment_id en este contexto)
                            if (transaction.transactionId) {
                              generateReceiptFromPaymentId(
                                transaction.transactionId
                              );
                            }
                          }}
                        >
                          <Receipt size={16} color="#3B82F6" />
                        </TouchableOpacity>
                      )}
                      {paymentStatus !== 'completed' && (
                        <View className="w-20" />
                      )}
                      <View className="items-end w-16">
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
        <PaginationButtons
          page={page}
          setPage={setPage}
          totalClients={totalTransactions}
          pageSize={pageSize}
        />
      </View>
      {showReceipt && receiptData && (
        <PaymentReceipt receiptData={receiptData} onClose={closeReceipt} />
      )}
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
