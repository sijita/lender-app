import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import useHandleNewPayments from '@/actions/payments/new-payments/use-handle-new-payments';
import { formatCurrency } from '@/utils';
import SearchableSelect from '@/components/ui/searchable-select';
import ActionButtons from '@/components/ui/action-buttons';
import { format } from '@formkit/tempo';
import { Banknote, Calendar, Ellipsis, Landmark } from 'lucide-react-native';

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
    <View className="flex-col gap-6 sm:w-[800px] sm:m-auto mt-5">
      <Text className="text-xl font-geist-bold">Registrar pago</Text>
      <View className="flex-col gap-6 bg-white rounded-lg p-5 border border-gray-200">
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
            <View className="flex-col items-center justify-between mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <Text className="font-geist-medium text-lg">
                {formData?.name} {formData?.lastName}
              </Text>
              <Text className="text-gray-600 font-geist-regular">
                CC: {formData?.documentNumber}
              </Text>
              <Text className="mt-2 font-geist-medium text-lg">
                Saldo pendiente: {formatCurrency(formData.outstanding)}
              </Text>
              <View className="mt-2 flex-col items-center">
                <Text className="font-geist-regular text-sm">
                  Cuota: {formatCurrency(formData.quota)}
                </Text>
                <Text className="font-geist-regular text-sm">
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
                <View className="flex-1 border border-gray-200 rounded-lg flex-row items-center">
                  <Text className="text-gray-500 pl-3 pr-1">$</Text>
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
                    className="bg-black py-3 px-4 rounded-lg"
                    onPress={() => {
                      if (formData.outstanding) {
                        handleAmountChange(formData.outstanding.toString());
                      }
                    }}
                  >
                    <Text className="font-geist-medium text-sm text-white">
                      Pago total
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              {errors.amount && (
                <Text className="text-red-500 text-sm">{errors.amount}</Text>
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
                  {getPaymentStatus() === 'partial' ? 'parcial' : 'completo'}.
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
              <TouchableOpacity
                className="border border-gray-200 rounded-lg p-3 flex-row justify-between items-center"
                onPress={() => setShowDatePicker(true)}
              >
                <Text
                  className={formData.date ? 'text-black' : 'text-gray-500'}
                >
                  {formData.date
                    ? format(formData.date, 'DD/MM/YYYY', 'es')
                    : 'dd / mm / aaaa'}
                </Text>
                <Calendar size={20} color="#6B7280" />
              </TouchableOpacity>
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
                  className="flex-row items-center gap-3"
                  onPress={() => handleChange('method', 'cash')}
                >
                  <View className="h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center">
                    {formData.method === 'cash' && (
                      <View className="h-3 w-3 rounded-full bg-black" />
                    )}
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Banknote size={18} color="#000" />
                    <Text>Efectivo</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-row items-center gap-3"
                  onPress={() => handleChange('method', 'transfer')}
                >
                  <View className="h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center">
                    {formData.method === 'transfer' && (
                      <View className="h-3 w-3 rounded-full bg-black" />
                    )}
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Landmark size={18} color="#000" />
                    <Text>Transferencia</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-row items-center gap-3"
                  onPress={() => handleChange('method', 'other')}
                >
                  <View className="h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center">
                    {formData.method === 'other' && (
                      <View className="h-3 w-3 rounded-full bg-black" />
                    )}
                  </View>
                  <View className="flex-row items-center gap-2">
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
                className="border border-gray-200 rounded-lg p-3 h-24 text-base"
                textAlignVertical="top"
                value={formData.notes}
                onChangeText={(text) => handleChange('notes', text)}
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
  );
};

export default NewPaymentForm;
