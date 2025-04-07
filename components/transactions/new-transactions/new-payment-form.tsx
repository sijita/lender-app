import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import useHandleNewPayments from '@/actions/payments/new-payments/use-handle-new-payments';
import { formatCurrency } from '@/utils';
import SearchableSelect from '@/components/ui/searchable-select';
import ActionButtons from '@/components/ui/action-buttons';

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
  } = useHandleNewPayments();

  const renderOptionItem = ({ item }: { item: any }) => {
    if (!item.metadata.client) {
      return (
        <View className="py-4 items-center justify-center">
          <Text className="text-gray-500">No se encontraron resultados</Text>
        </View>
      );
    }

    return (
      <View className="p-5 border-b border-gray-100">
        <Text className="font-geist-medium">{item?.label}</Text>
        {item?.metadata && (
          <View className="flex-row justify-between mt-1">
            <Text className="text-gray-600">
              CC: {item.metadata.client?.document_number}
            </Text>
            <Text className="text-gray-600">
              Saldo: {formatCurrency(item.metadata?.outstanding)}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View className="flex-col gap-5">
      <Text className="text-xl font-geist-bold mb-2">Registrar pago</Text>
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
          renderItem={renderOptionItem}
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
              {formatCurrency(formData.outstanding)}
            </Text>
          </View>
        )}
      </View>
      <View className="flex-col gap-2">
        <Text className="font-geist-medium">
          Monto del pago<Text className="text-red-500">*</Text>
        </Text>
        <View className="border border-gray-200 rounded-lg flex-row items-center">
          <Text className="text-gray-500 pl-3 pr-1">$</Text>
          <TextInput
            placeholder="0"
            keyboardType="decimal-pad"
            className="flex-1 p-3"
            value={formattedAmount}
            onChangeText={handleAmountChange}
          />
        </View>
        {errors.amount && (
          <Text className="text-red-500 text-sm">{errors.amount}</Text>
        )}
      </View>
      <View className="flex-col gap-2">
        <Text className="font-geist-medium">Cuotas pagadas</Text>
        <View
          className={`border ${
            errors.quotas ? 'border-red-500' : 'border-gray-200'
          } rounded-lg flex-row items-center`}
        >
          <TextInput
            placeholder="1"
            keyboardType="number-pad"
            className="flex-1 p-3"
            value={formData.quotas?.toString() ?? ''}
            onChangeText={(text) => handleChange('quotas', text)}
          />
          <View className="flex-col gap-0">
            <TouchableOpacity
              className="px-3 py-1"
              onPress={() => {
                const currentTerm = Number(formData.quotas) || 0;
                if (currentTerm < 60) {
                  handleChange('quotas', String(currentTerm + 1));
                }
              }}
            >
              <Ionicons name="chevron-up-outline" size={20} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity
              className="px-3 py-1"
              onPress={() => {
                const currentTerm = Number(formData.quotas) || 0;
                if (currentTerm > 1) {
                  handleChange('quotas', String(currentTerm - 1));
                }
              }}
            >
              <Ionicons name="chevron-down-outline" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>
        {errors.quotas && (
          <Text className="text-red-500 text-sm">{errors.quotas}</Text>
        )}
      </View>
      <View className="flex-col gap-2">
        <Text className="font-geist-medium">Fecha</Text>
        <TouchableOpacity
          className="border border-gray-200 rounded-lg p-3 flex-row justify-between items-center"
          onPress={() => setShowDatePicker(true)}
        >
          <Text className={formData.date ? 'text-black' : 'text-gray-500'}>
            {formData.date
              ? format(formData.date, 'dd/MM/yyyy', { locale: es })
              : 'dd / mm / aaaa'}
          </Text>
          <Ionicons name="calendar-outline" size={20} color="#6B7280" />
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
              <Ionicons name="cash-outline" size={18} color="#000" />
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
              <Ionicons name="card-outline" size={18} color="#000" />
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
              <Ionicons name="ellipsis-horizontal" size={18} color="#000" />
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
