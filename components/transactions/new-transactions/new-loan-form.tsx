import {
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useHandleNewLoans } from '@/actions/loans/new-loans/use-handle-new-loans';
import Select from '@/components/ui/select';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatCurrency } from '@/utils';
import ActionButtons from '@/components/ui/action-buttons';
import { frequencyOptions } from '@/constants/loans';
import SearchableSelect from '@/components/ui/searchable-select';
import { format } from '@formkit/tempo';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react-native';

const NewLoanForm = () => {
  const {
    formData,
    showDatePicker,
    errors,
    isSubmitting,
    calculatedValues,
    formattedAmount,
    isSearching,
    formattedSearchResults,
    handleAmountChange,
    handleChange,
    handleDateSelect,
    setShowDatePicker,
    saveLoan,
    handleClientSelect,
    searchClients,
  } = useHandleNewLoans();

  const renderOptionItem = ({ item }: { item: any }) => {
    if (!item.documentNumber) {
      return (
        <View className="justify-center items-center py-4">
          <Text className="text-gray-500">No se encontraron resultados</Text>
        </View>
      );
    }

    return (
      <View className="flex-col p-5 border-b border-gray-100">
        <Text className="font-geist-medium">{item?.label}</Text>
        <Text className="text-gray-600">CC: {item?.documentNumber}</Text>
      </View>
    );
  };

  return (
    <View className="flex-col gap-6 sm:w-[800px] sm:m-auto">
      <Text className="text-xl font-geist-bold">Registrar nuevo préstamo</Text>
      <View className="flex-col gap-6 p-5 bg-white rounded-xl border border-gray-100">
        <View className="flex-col gap-2">
          <Text className="font-geist-medium">
            Fecha de inicio<Text className="text-red-500">*</Text>
          </Text>
          {Platform.OS === 'web' ? (
            <input
              type="date"
              value={
                formData.startDate
                  ? format(formData.startDate, 'YYYY-MM-DD')
                  : ''
              }
              onChange={e => {
                const [year, month, day] = e.target.value
                  .split('-')
                  .map(Number);
                const selectedDate = new Date(year, month - 1, day);
                handleChange('startDate', selectedDate);
              }}
              className={`border ${
                errors.startDate ? 'border-red-500' : 'border-gray-200'
              } rounded-xl p-3 w-full`}
              style={{
                fontFamily: 'GeistMedium',
                fontSize: 16,
                outline: 'none',
              }}
            />
          ) : (
            <TouchableOpacity
              className={`border ${
                errors.startDate ? 'border-red-500' : 'border-gray-200'
              } rounded-xl p-3 flex-row justify-between items-center`}
              onPress={() => setShowDatePicker('start')}
            >
              <Text
                className={formData.startDate ? 'text-black' : 'text-gray-500'}
              >
                {formData.startDate
                  ? format(formData.startDate, 'DD/MM/YYYY')
                  : 'dd / mm / aaaa'}
              </Text>
              <Calendar size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
          {errors.startDate && (
            <Text className="text-sm text-red-500">{errors.startDate}</Text>
          )}
        </View>
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
            <View className="flex-col justify-between items-center p-3 mt-2 bg-gray-50 rounded-xl border border-gray-200">
              <Text className="text-lg font-geist-medium">
                {formData?.name} {formData?.lastName}
              </Text>
              <Text className="text-gray-600 font-geist-regular">
                CC: {formData?.documentNumber}
              </Text>
            </View>
          )}
        </View>
        <View className="flex-col gap-2">
          <Text className="font-geist-medium">
            Monto del préstamo<Text className="text-red-500">*</Text>
          </Text>
          <View className="flex-row items-center rounded-xl border border-gray-200">
            <Text className="pr-1 pl-3 text-gray-500">$</Text>
            <TextInput
              placeholder="0"
              keyboardType="decimal-pad"
              className="flex-1 p-3"
              value={formattedAmount}
              onChangeText={handleAmountChange}
            />
          </View>
          {errors.amount && (
            <Text className="text-sm text-red-500">{errors.amount}</Text>
          )}
        </View>
        <View className="flex-col gap-2">
          <Text className="font-geist-medium">
            Tasa de interes (%)<Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            placeholder="0.0"
            keyboardType="decimal-pad"
            className={`border ${
              errors.interestRate ? 'border-red-500' : 'border-gray-200'
            } rounded-xl p-3`}
            value={formData.interestRate}
            onChangeText={text => handleChange('interestRate', text)}
          />
          {errors.interestRate && (
            <Text className="text-sm text-red-500">{errors.interestRate}</Text>
          )}
        </View>
        <View className="flex-col gap-2">
          <Text className="font-geist-medium">
            Frecuencia de pago<Text className="text-red-500">*</Text>
          </Text>
          <Select
            placeholder="Seleccionar frecuencia"
            options={frequencyOptions}
            value={formData.paymentFrequency || 'weekly'}
            onChange={value => handleChange('paymentFrequency', value)}
            error={errors.paymentFrequency}
            required
          />
        </View>
        <View className="flex-col gap-2">
          <Text className="font-geist-medium">
            Plazo (
            {formData.paymentFrequency === 'monthly'
              ? 'Meses'
              : formData.paymentFrequency === 'biweekly'
                ? 'Quincenas'
                : formData.paymentFrequency === 'daily'
                  ? 'Días'
                  : 'Semanas'}
            )<Text className="text-red-500">*</Text>
          </Text>
          <View
            className={`border ${
              errors.term ? 'border-red-500' : 'border-gray-200'
            } rounded-xl flex-row items-center`}
          >
            <TextInput
              placeholder="12"
              keyboardType="number-pad"
              className="flex-1 p-3"
              value={formData.term}
              onChangeText={text => handleChange('term', text)}
            />
            <View className="flex-col gap-0">
              <TouchableOpacity
                className="px-3 py-1"
                onPress={() => {
                  const currentTerm = Number(formData.term) || 0;
                  if (currentTerm < 60) {
                    handleChange('term', String(currentTerm + 1));
                  }
                }}
              >
                <ChevronUp size={20} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity
                className="px-3 py-1"
                onPress={() => {
                  const currentTerm = Number(formData.term) || 0;
                  if (currentTerm > 1) {
                    handleChange('term', String(currentTerm - 1));
                  }
                }}
              >
                <ChevronDown size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
          {errors.term && (
            <Text className="text-sm text-red-500">{errors.term}</Text>
          )}
        </View>
        <View className="flex-col gap-2">
          <Text className="font-geist-medium">
            Fecha de pago<Text className="text-red-500">*</Text>
          </Text>
          {Platform.OS === 'web' ? (
            <input
              type="date"
              value={
                formData.paymentDate
                  ? format(formData.paymentDate, 'YYYY-MM-DD')
                  : ''
              }
              onChange={e => {
                const [year, month, day] = e.target.value
                  .split('-')
                  .map(Number);
                const selectedDate = new Date(year, month - 1, day);
                handleChange('paymentDate', selectedDate);
              }}
              className={`border ${
                errors.paymentDate ? 'border-red-500' : 'border-gray-200'
              } rounded-xl p-3 w-full`}
              style={{
                fontFamily: 'GeistMedium',
                fontSize: 16,
                outline: 'none',
              }}
            />
          ) : (
            <TouchableOpacity
              className={`border ${
                errors.paymentDate ? 'border-red-500' : 'border-gray-200'
              } rounded-xl p-3 flex-row justify-between items-center`}
              onPress={() => setShowDatePicker('payment')}
            >
              <Text
                className={
                  formData.paymentDate ? 'text-black' : 'text-gray-500'
                }
              >
                {formData.paymentDate
                  ? format(formData.paymentDate, 'DD/MM/YYYY', 'es')
                  : 'dd / mm / aaaa'}
              </Text>
              <Calendar size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
          {errors.paymentDate && (
            <Text className="text-sm text-red-500">{errors.paymentDate}</Text>
          )}
        </View>
        {Number(formData.amount) > 0 && Number(formData.term) > 0 && (
          <View className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <Text className="mb-2 font-geist-medium">Resumen del préstamo</Text>
            <View className="flex-row justify-between mb-1">
              <Text className="text-gray-600">
                Cuota{' '}
                {formData.paymentFrequency === 'monthly'
                  ? 'mensual'
                  : formData.paymentFrequency === 'biweekly'
                    ? 'quincenal'
                    : formData.paymentFrequency === 'daily'
                      ? 'diaria'
                      : 'semanal'}
                :
              </Text>
              <Text className="font-geist-medium">
                {formatCurrency(calculatedValues.monthlyPayment)}
              </Text>
            </View>
            <View className="flex-row justify-between mb-1">
              <Text className="text-gray-600">Interés total:</Text>
              <Text className="font-geist-medium">
                {formatCurrency(calculatedValues.totalInterest)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Monto total a pagar:</Text>
              <Text className="font-geist-medium">
                {formatCurrency(calculatedValues.totalPayment)}
              </Text>
            </View>
          </View>
        )}
        <View className="flex-col gap-2">
          <Text className="font-geist-medium">Notas</Text>
          <TextInput
            placeholder="Añadir cualquier detalle adicional sobre este préstamo..."
            multiline
            numberOfLines={4}
            className="p-3 h-24 text-base rounded-xl border border-gray-200"
            textAlignVertical="top"
            value={formData.notes}
            onChangeText={text => handleChange('notes', text)}
          />
        </View>
      </View>
      <ActionButtons
        submitLabel="Registrar préstamo"
        onCancel={() => router.back()}
        onSubmit={saveLoan}
        isSubmitting={isSubmitting}
      />
      {showDatePicker && (
        <DateTimePicker
          value={
            showDatePicker === 'start' && formData.startDate
              ? formData.startDate
              : showDatePicker === 'payment' && formData.paymentDate
                ? formData.paymentDate
                : new Date()
          }
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            if (event.type === 'set' && selectedDate) {
              handleDateSelect(selectedDate, showDatePicker);
            } else {
              setShowDatePicker(null);
            }
          }}
        />
      )}
    </View>
  );
};

export default NewLoanForm;
