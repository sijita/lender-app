import {
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import useHandleNewPayments from '@/actions/payments/new-payments/use-handle-new-payments';
import { formatCurrency } from '@/utils';
import SearchableSelect from '@/components/ui/searchable-select';
import ActionButtons from '@/components/ui/action-buttons';
import { format } from '@formkit/tempo';
import { Banknote, Calendar, Ellipsis, Landmark } from 'lucide-react-native';
import PaymentReceipt from '@/components/transactions/payment-receipt';

const NewPaymentForm = () => {
  const {
    formData,
    errors,
    isSubmitting,
    showDatePicker,
    isSearching,
    formattedAmount,
    formattedSearchResults,
    handleChange,
    handleDateSelect,
    setShowDatePicker,
    searchClients,
    savePayment,
    handleClientSelect,
    handleAmountChange,
    getPaymentStatus,
    getQuotasCovered,
    // Estados y funciones del recibo
    showReceipt,
    receiptData,
    closeReceipt,
  } = useHandleNewPayments();

  const renderOptionItem = ({ item }: { item: any }) => {
    if (!item || !item.label || !item.metadata || !item.metadata.client) {
      return null;
    }

    return (
      <View className="p-5 border-b border-gray-100">
        <Text className="font-geist-medium">{item.label}</Text>
        <View className="flex-row justify-between mt-1">
          <Text className="text-gray-600">
            CC: {item.metadata.client.document_number || 'N/A'}
          </Text>
          <Text className="text-gray-600">
            Saldo: {formatCurrency(item.metadata.outstanding || 0)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <>
      {showReceipt && receiptData && (
        <PaymentReceipt receiptData={receiptData} onClose={closeReceipt} />
      )}
      {!showReceipt && (
        <View className="flex-col gap-6 sm:w-[800px] sm:m-auto mt-5">
          <Text className="text-xl font-geist-bold">Registrar pago</Text>
          <View className="flex-col gap-6 p-5 bg-white rounded-xl border border-gray-200">
            <View className="flex-col gap-2">
              <SearchableSelect
                label="Cliente"
                placeholder="Seleccionar cliente"
                searchPlaceholder="Buscar cliente..."
                options={[]}
                value={formData?.clientId?.toString() ?? null}
                onChange={handleClientSelect}
                onSearch={searchClients}
                isSearching={isSearching}
                searchResults={formattedSearchResults}
                error={errors?.clientId}
                renderItem={renderOptionItem as any}
                maxHeight={250}
                required
              />
              {formData?.clientId && (
                <View className="flex-col justify-between items-center p-3 mt-2 bg-gray-50 rounded-xl border border-gray-200">
                  <Text className="text-lg font-geist-medium">
                    {formData?.name} {formData?.lastName}
                  </Text>
                  <Text className="text-gray-600 font-geist-regular">
                    CC: {formData?.documentNumber}
                  </Text>
                  <Text className="mt-2 text-lg font-geist-medium">
                    Saldo pendiente: {formatCurrency(formData.outstanding)}
                  </Text>
                  <View className="flex-col items-center mt-2">
                    <Text className="text-sm font-geist-regular">
                      Cuota: {formatCurrency(formData.quota)}
                    </Text>
                    <Text className="text-sm font-geist-regular">
                      Progreso cuota actual:{' '}
                      {formatCurrency(formData.partialQuota ?? 0)} /{' '}
                      {formatCurrency(formData.quota)}
                    </Text>
                  </View>
                </View>
              )}
            </View>
            {formData?.clientId && (
              <>
                <View className="flex-col gap-2">
                  <Text className="font-geist-medium">
                    Monto del pago<Text className="text-red-500">*</Text>
                  </Text>
                  <View className="flex-row gap-3 items-center">
                    <View className="flex-row flex-1 items-center rounded-xl border border-gray-200">
                      <Text className="pr-1 pl-3 text-gray-500">$</Text>
                      <TextInput
                        placeholder="0"
                        keyboardType="decimal-pad"
                        className="flex-1 p-3"
                        value={formattedAmount}
                        onChangeText={handleAmountChange}
                      />
                    </View>
                    {formData.clientId && (
                      <TouchableOpacity
                        className="px-4 py-3 bg-black rounded-xl"
                        onPress={() => {
                          if (formData.outstanding) {
                            handleAmountChange(formData.outstanding.toString());
                          }
                        }}
                      >
                        <Text className="text-sm text-white font-geist-medium">
                          Pago total
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  {errors.amount && (
                    <Text className="text-sm text-red-500">
                      {errors.amount}
                    </Text>
                  )}
                  {formData.amount && (
                    <Text
                      className={`text-sm ${
                        getPaymentStatus() === 'partial'
                          ? 'text-yellow-500'
                          : 'text-green-500'
                      }`}
                    >
                      Este pago será registrado como{' '}
                      {getPaymentStatus() === 'partial'
                        ? 'parcial'
                        : 'completo'}
                      .
                      {getPaymentStatus() === 'completed' &&
                        getQuotasCovered() > 0 && (
                          <> Cubre {getQuotasCovered()} cuota(s).</>
                        )}
                      {getPaymentStatus() === 'partial' && (
                        <>
                          {' '}
                          Se necesita{' '}
                          {formatCurrency(
                            formData.quota -
                              (Number(formData.amount) +
                                (formData.partialQuota ?? 0))
                          )}{' '}
                          más para completar una cuota.
                        </>
                      )}
                    </Text>
                  )}
                </View>
                <View className="flex-col gap-2">
                  <Text className="font-geist-medium">Fecha</Text>
                  {Platform.OS === 'web' ? (
                    <input
                      type="date"
                      value={
                        formData.date ? format(formData.date, 'YYYY-MM-DD') : ''
                      }
                      onChange={e => {
                        const [year, month, day] = e.target.value
                          .split('-')
                          .map(Number);
                        const selectedDate = new Date(year, month - 1, day);
                        handleChange('date', selectedDate);
                      }}
                      className={`border ${
                        errors.date ? 'border-red-500' : 'border-gray-200'
                      } rounded-xl p-3 w-full`}
                      style={{
                        fontFamily: 'GeistMedium',
                        fontSize: 16,
                        outline: 'none',
                      }}
                    />
                  ) : (
                    <TouchableOpacity
                      className="flex-row justify-between items-center p-3 rounded-xl border border-gray-200"
                      onPress={() => setShowDatePicker(true)}
                    >
                      <Text
                        className={
                          formData.date ? 'text-black' : 'text-gray-500'
                        }
                      >
                        {formData.date
                          ? format(formData.date, 'DD/MM/YYYY', 'es')
                          : 'dd / mm / aaaa'}
                      </Text>
                      <Calendar size={20} color="#6B7280" />
                    </TouchableOpacity>
                  )}
                  {showDatePicker && (
                    <DateTimePicker
                      value={formData?.date ?? new Date()}
                      mode="date"
                      display="default"
                      onChange={handleDateSelect}
                    />
                  )}
                </View>
                <View className="flex-col gap-5">
                  <Text className="font-geist-medium">Método de pago</Text>
                  <View className="flex-col gap-4">
                    <TouchableOpacity
                      className="flex-row gap-3 items-center"
                      onPress={() => handleChange('method', 'cash')}
                    >
                      <View className="flex justify-center items-center w-5 h-5 rounded-full border border-gray-300">
                        {formData.method === 'cash' && (
                          <View className="w-3 h-3 bg-black rounded-full" />
                        )}
                      </View>
                      <View className="flex-row gap-2 items-center">
                        <Banknote size={18} color="#000" />
                        <Text>Efectivo</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-row gap-3 items-center"
                      onPress={() => handleChange('method', 'transfer')}
                    >
                      <View className="flex justify-center items-center w-5 h-5 rounded-full border border-gray-300">
                        {formData.method === 'transfer' && (
                          <View className="w-3 h-3 bg-black rounded-full" />
                        )}
                      </View>
                      <View className="flex-row gap-2 items-center">
                        <Landmark size={18} color="#000" />
                        <Text>Transferencia</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-row gap-3 items-center"
                      onPress={() => handleChange('method', 'other')}
                    >
                      <View className="flex justify-center items-center w-5 h-5 rounded-full border border-gray-300">
                        {formData.method === 'other' && (
                          <View className="w-3 h-3 bg-black rounded-full" />
                        )}
                      </View>
                      <View className="flex-row gap-2 items-center">
                        <Ellipsis size={18} color="#000" />
                        <Text>Otro</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                <View className="flex-col gap-2">
                  <Text className="font-geist-medium">Notas</Text>
                  <TextInput
                    placeholder="Añadir cualquier detalle adicional sobre este pago..."
                    multiline
                    numberOfLines={4}
                    className="p-3 h-24 text-base rounded-xl border border-gray-200"
                    textAlignVertical="top"
                    value={formData.notes}
                    onChangeText={text => handleChange('notes', text)}
                  />
                </View>
              </>
            )}
          </View>
          <ActionButtons
            submitLabel="Registrar pago"
            onCancel={() => router.back()}
            onSubmit={savePayment}
            isSubmitting={isSubmitting}
          />
        </View>
      )}
    </>
  );
};

export default NewPaymentForm;
