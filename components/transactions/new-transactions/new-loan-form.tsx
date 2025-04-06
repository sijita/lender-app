import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useHandleNewLoans } from '@/actions/loans/new-loans/use-handle-new-loans';
import useFetchClients from '@/actions/clients/use-fetch-clients';
import Select from '@/components/ui/select';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatCurrency } from '@/utils';
import ActionButtons from '@/components/ui/action-buttons';
import { frequencyOptions } from '@/constants/loans';

const NewLoanForm = () => {
  const {
    formData,
    showDatePicker,
    errors,
    isSubmitting,
    calculatedValues,
    formattedAmount,
    handleAmountChange,
    handleChange,
    handleDateSelect,
    setShowDatePicker,
    saveLoan,
    selectClient,
  } = useHandleNewLoans();
  const { clients } = useFetchClients();

  return (
    <View className="flex-col gap-5">
      <Text className="text-xl font-geist-bold">Registrar nuevo préstamo</Text>
      <View className="flex-col gap-2">
        <Select
          label="Cliente"
          placeholder="Seleccionar cliente"
          options={clients?.map((client) => ({
            id: client.id?.toString() ?? '',
            label: client.name,
          }))}
          value={formData.clientId?.toString() ?? ''}
          onChange={(value) => selectClient(Number(value))}
          error={errors.clientId}
          required
        />
      </View>
      <View className="flex-col gap-2">
        <Text className="font-geist-medium">
          Monto del préstamo <Text className="text-red-500">*</Text>
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
        <Text className="font-geist-medium">
          Fecha de inicio <Text className="text-red-500">*</Text>
        </Text>
        <TouchableOpacity
          className={`border ${
            errors.startDate ? 'border-red-500' : 'border-gray-200'
          } rounded-lg p-3 flex-row justify-between items-center`}
          onPress={() => setShowDatePicker('start')}
        >
          <Text className={formData.startDate ? 'text-black' : 'text-gray-500'}>
            {formData.startDate
              ? format(formData.startDate, 'dd/MM/yyyy', { locale: es })
              : 'dd / mm / aaaa'}
          </Text>
          <Ionicons name="calendar-outline" size={20} color="#6B7280" />
        </TouchableOpacity>
        {errors.startDate && (
          <Text className="text-red-500 text-sm">{errors.startDate}</Text>
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
          } rounded-lg p-3`}
          value={formData.interestRate}
          onChangeText={(text) => handleChange('interestRate', text)}
        />
        {errors.interestRate && (
          <Text className="text-red-500 text-sm">{errors.interestRate}</Text>
        )}
      </View>
      <View className="flex-col gap-2">
        <Text className="font-geist-medium">
          Frecuencia de pago <Text className="text-red-500">*</Text>
        </Text>
        <Select
          placeholder="Seleccionar frecuencia"
          options={frequencyOptions}
          value={formData.paymentFrequency || 'weekly'}
          onChange={(value) => handleChange('paymentFrequency', value)}
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
          ) <Text className="text-red-500">*</Text>
        </Text>
        <View
          className={`border ${
            errors.term ? 'border-red-500' : 'border-gray-200'
          } rounded-lg flex-row items-center`}
        >
          <TextInput
            placeholder="12"
            keyboardType="number-pad"
            className="flex-1 p-3"
            value={formData.term}
            onChangeText={(text) => handleChange('term', text)}
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
              <Ionicons name="chevron-up-outline" size={20} color="#6B7280" />
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
              <Ionicons name="chevron-down-outline" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>
        {errors.term && (
          <Text className="text-red-500 text-sm">{errors.term}</Text>
        )}
      </View>
      <View className="flex-col gap-2">
        <Text className="font-geist-medium">
          Fecha de pago <Text className="text-red-500">*</Text>
        </Text>
        <TouchableOpacity
          className={`border ${
            errors.paymentDate ? 'border-red-500' : 'border-gray-200'
          } rounded-lg p-3 flex-row justify-between items-center`}
          onPress={() => setShowDatePicker('payment')}
        >
          <Text
            className={formData.paymentDate ? 'text-black' : 'text-gray-500'}
          >
            {formData.paymentDate
              ? format(formData.paymentDate, 'dd/MM/yyyy', { locale: es })
              : 'dd / mm / aaaa'}
          </Text>
          <Ionicons name="calendar-outline" size={20} color="#6B7280" />
        </TouchableOpacity>
        {errors.paymentDate && (
          <Text className="text-red-500 text-sm">{errors.paymentDate}</Text>
        )}
      </View>
      {Number(formData.amount) > 0 && Number(formData.term) > 0 && (
        <View className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <Text className="font-geist-medium mb-2">Resumen del préstamo</Text>
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
          className="border border-gray-200 rounded-lg p-3 h-24 text-base"
          textAlignVertical="top"
          value={formData.notes}
          onChangeText={(text) => handleChange('notes', text)}
        />
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
