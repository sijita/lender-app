import {
  ActivityIndicator,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import useHandleNewClientsForm from '@/actions/clients/new-clients/use-handle-new-clients-form';
import { documentTypes } from '@/constants/clients';
import Select from '@/components/ui/select';
import ActionButtons from '@/components/ui/action-buttons';

const NewClientForm = () => {
  const { isSubmitting, errors, formData, handleChange, saveClient } =
    useHandleNewClientsForm();

  return (
    <View className="flex-col gap-6 p-5 sm:w-[800px] sm:m-auto">
      <Text className="text-xl font-geist-bold">Información del cliente</Text>
      <View className="bg-white flex-col gap-6 p-5 rounded-lg border border-gray-100">
        <View className="flex-col gap-6 sm:flex-row">
          <Select
            label="Tipo de Documento"
            placeholder="Seleccionar tipo"
            options={documentTypes}
            value={formData.documentType}
            onChange={(value) => handleChange('documentType', value)}
            error={errors.documentType}
            required
          />
          <View className="flex-col gap-2 flex-1">
            <Text className="font-geist-medium">
              Número de Documento<Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              placeholder="12345678"
              className={`border ${
                errors.documentNumber ? 'border-red-500' : 'border-gray-200'
              } rounded-lg p-3`}
              value={formData.documentNumber.toString() ?? ''}
              onChangeText={(text) => handleChange('documentNumber', text)}
              keyboardType="number-pad"
            />
            {errors.documentNumber && (
              <Text className="text-red-500 text-sm">
                {errors.documentNumber}
              </Text>
            )}
          </View>
        </View>
        <View className="flex-col gap-6 sm:flex-row">
          <View className="flex-col gap-2 sm:flex-1">
            <Text className="font-geist-medium">
              Nombre
              <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              placeholder="Nombre del cliente"
              className={`border ${
                errors.name ? 'border-red-500' : 'border-gray-200'
              } rounded-lg p-3`}
              value={formData.name}
              onChangeText={(text) => handleChange('name', text)}
            />
            {errors.name && (
              <Text className="text-red-500 text-sm">{errors.name}</Text>
            )}
          </View>
          <View className="flex-col gap-2 sm:flex-1">
            <Text className="font-geist-medium">
              Apellido <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              placeholder="Apellido del cliente"
              className={`border ${
                errors.lastName ? 'border-red-500' : 'border-gray-200'
              } rounded-lg p-3`}
              value={formData.lastName}
              onChangeText={(text) => handleChange('lastName', text)}
            />
            {errors.lastName && (
              <Text className="text-red-500 text-sm">{errors.lastName}</Text>
            )}
          </View>
        </View>
        <View className="flex-col gap-2">
          <Text className="font-geist-medium">
            Correo Electrónico<Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            placeholder="correo@ejemplo.com"
            keyboardType="email-address"
            className={`border ${
              errors.email ? 'border-red-500' : 'border-gray-200'
            } rounded-lg p-3`}
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
            autoCapitalize="none"
          />
          {errors.email && (
            <Text className="text-red-500 text-sm">{errors.email}</Text>
          )}
        </View>
        <View className="flex-col gap-2">
          <Text className="font-geist-medium">
            Teléfono<Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            placeholder="3012345678"
            keyboardType="phone-pad"
            className={`border ${
              errors.phone ? 'border-red-500' : 'border-gray-200'
            } rounded-lg p-3`}
            value={formData.phone}
            onChangeText={(text) => handleChange('phone', text)}
            maxLength={10}
          />
          {errors.phone && (
            <Text className="text-red-500 text-sm">{errors.phone}</Text>
          )}
        </View>
      </View>
      <Text className="text-xl font-geist-bold mt-2">Dirección</Text>
      <View className="bg-white flex-col gap-6 p-5 rounded-lg">
        <View className="flex-col gap-6 sm:flex-row">
          <View className="flex-col gap-2 flex-1">
            <Text className="font-geist-medium">
              Principal<Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              placeholder="Calle 01 #1A - 11"
              className={`border ${
                errors.address ? 'border-red-500' : 'border-gray-200'
              } rounded-lg p-3`}
              value={formData.address}
              onChangeText={(text) => handleChange('address', text)}
            />
            {errors.address && (
              <Text className="text-red-500 text-sm">{errors.address}</Text>
            )}
          </View>
          <View className="flex-col gap-2 flex-1">
            <Text className="font-geist-medium">Secundaria</Text>
            <TextInput
              placeholder="Calle 01 #1A - 11"
              className="border border-gray-200 rounded-lg p-3"
              value={formData.subAddress}
              onChangeText={(text) => handleChange('subAddress', text)}
            />
          </View>
        </View>
        <View className="flex-col gap-2 ">
          <Text className="font-geist-medium">Notas</Text>
          <TextInput
            placeholder="Añadir cualquier detalle adicional sobre este cliente..."
            multiline
            numberOfLines={4}
            className="border border-gray-200 rounded-lg p-3 h-24 text-base"
            textAlignVertical="top"
            value={formData.notes}
            onChangeText={(text) => handleChange('notes', text)}
          />
        </View>
      </View>
      <ActionButtons
        submitLabel="Guardar cliente"
        onSubmit={saveClient}
        onCancel={router.back}
        isSubmitting={isSubmitting}
      />
    </View>
  );
};

export default NewClientForm;
