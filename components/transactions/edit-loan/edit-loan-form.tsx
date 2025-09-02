import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router, Stack } from 'expo-router';
import useHandleEditLoan from '@/actions/loans/edit-loan/use-handle-edit-loan';
import Select from '@/components/ui/select';
import { formatCurrency } from '@/utils';
import { frequencyOptions } from '@/constants/loans';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, parse } from '@formkit/tempo';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react-native';
import Loading from '@/components/ui/loading';
import ActionButtons from '@/components/ui/action-buttons';

interface EditLoanFormProps {
  loanId: number;
}

const EditLoanForm = ({ loanId }: EditLoanFormProps) => {
  const {
    isLoading,
    isSubmitting,
    loan,
    errors,
    formData,
    calculatedValues,
    showDatePicker,
    formattedAmount,
    handleAmountChange,
    handleChange,
    updateLoan,
    handleDateSelect,
    setShowDatePicker,
  } = useHandleEditLoan(loanId);

  if (isLoading) {
    return <Loading loadingText="Cargando información del préstamo..." />;
  }

  return (
    <View className="flex-col gap-6 p-5 sm:w-[800px] sm:m-auto">
      {loan && (
        <View className="flex-col gap-6">
          <View className="flex-col items-center mb-5">
            <Text className="text-gray-500 font-geist-medium text-lg">
              Cliente:
            </Text>
            <Text className="font-geist-bold text-xl">
              {loan.clients?.name} {loan.clients?.last_name}
            </Text>
          </View>
          <View className="flex-col gap-6 bg-white rounded-xl p-5 border border-gray-100">
            <View className="flex-col gap-2">
              <Text className="font-geist-medium">
                Fecha de inicio<Text className="text-red-500">*</Text>
              </Text>
              <TouchableOpacity
                className={`border ${
                  errors.startDate ? 'border-red-500' : 'border-gray-200'
                } rounded-xl p-3 flex-row justify-between items-center`}
                onPress={() => setShowDatePicker('start')}
              >
                <Text
                  className={
                    formData.startDate ? 'text-black' : 'text-gray-500'
                  }
                >
                  {formData.startDate
                    ? format(formData.startDate, 'DD/MM/YYYY')
                    : 'dd / mm / aaaa'}
                </Text>
                <Calendar size={20} color="#6B7280" />
              </TouchableOpacity>
              {errors.startDate && (
                <Text className="text-red-500 text-sm">{errors.startDate}</Text>
              )}
            </View>
            <View className="flex-col gap-2">
              <Text className="font-geist-medium">
                Monto del préstamo<Text className="text-red-500">*</Text>
              </Text>
              <View className="border border-gray-200 rounded-xl flex-row items-center">
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
                Plazo<Text className="text-red-500">*</Text>
              </Text>
              <View className="border border-gray-200 rounded-xl flex-row items-center">
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
                <Text className="text-red-500 text-sm">{errors.term}</Text>
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
                Tasa de Interés<Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                placeholder="5"
                className={`border ${
                  errors.interestRate ? 'border-red-500' : 'border-gray-200'
                } rounded-xl p-3`}
                value={formData.interestRate}
                onChangeText={text => handleChange('interestRate', text)}
                keyboardType="numeric"
              />
              {errors.interestRate && (
                <Text className="text-red-500 text-sm">
                  {errors.interestRate}
                </Text>
              )}
            </View>
            <Select
              label="Estado del Préstamo"
              options={[
                { id: 'active', label: 'Activo' },
                { id: 'completed', label: 'Completado' },
                { id: 'defaulted', label: 'En Mora' },
              ]}
              value={formData.status || 'active'}
              onChange={value => handleChange('status', value)}
              error={errors.status}
              required
            />
            {Number(formData.amount) > 0 && Number(formData.term) > 0 && (
              <View className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <Text className="font-geist-medium mb-2">
                  Resumen del préstamo
                </Text>
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
              <Text className="font-geist-medium">
                Fecha de pago<Text className="text-red-500">*</Text>
              </Text>
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
                    ? format(formData.paymentDate, 'DD/MM/YYYY')
                    : 'dd / mm / aaaa'}
                </Text>
                <Calendar size={20} color="#6B7280" />
              </TouchableOpacity>
              {errors.paymentDate && (
                <Text className="text-red-500 text-sm">
                  {errors.paymentDate}
                </Text>
              )}
            </View>
            <View className="flex-col gap-2">
              <Text className="font-geist-medium">Notas</Text>
              <TextInput
                placeholder="Añadir cualquier detalle adicional sobre este préstamo..."
                multiline
                numberOfLines={4}
                className="border border-gray-200 rounded-xl p-3 h-24 text-base"
                textAlignVertical="top"
                value={formData.notes}
                onChangeText={text => handleChange('notes', text)}
              />
            </View>
          </View>
        </View>
      )}
      <ActionButtons
        submitLabel="Actualizar préstamo"
        onSubmit={updateLoan}
        onCancel={() => router.back()}
        isSubmitting={isSubmitting}
      />
      {showDatePicker && (
        <DateTimePicker
          value={
            showDatePicker === 'start' && formData.startDate
              ? new Date(formData.startDate)
              : showDatePicker === 'payment' && formData.paymentDate
                ? parse(formData.paymentDate.toString(), 'YYYY-MM-DD')
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

export default EditLoanForm;
