import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router, Stack } from 'expo-router';
import useHandleEditClientForm from '@/actions/clients/edit-client/use-handle-edit-client-form';
import { documentTypes } from '@/constants/clients';
import Select from '@/components/ui/select';
import Loading from '@/components/ui/loading';

interface EditClientFormProps {
  clientId: number;
}

const EditClientForm = ({ clientId }: EditClientFormProps) => {
  const {
    isLoading,
    isSubmitting,
    errors,
    formData,
    handleChange,
    updateClient,
  } = useHandleEditClientForm(clientId);

  if (isLoading) {
    return <Loading loadingText="Cargando información del cliente..." />;
  }

  return (
    <View className="flex-col gap-5 p-5">
      <Text className="text-xl font-geist-bold">
        Editar Información del Cliente
      </Text>
      <Select
        label="Tipo de Documento"
        placeholder="Seleccionar tipo"
        options={documentTypes}
        value={formData.documentType}
        onChange={(value) => handleChange('documentType', value)}
        error={errors.documentType}
        required
      />
      <View className="flex-col gap-2">
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
          <Text className="text-red-500 text-sm">{errors.documentNumber}</Text>
        )}
      </View>
      <View className="flex-col gap-2">
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
      <View className="flex-col gap-2">
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
      <Text className="text-xl font-geist-bold mt-2">Dirección</Text>
      <View className="flex-col gap-2">
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
      <View className="flex-col gap-2">
        <Text className="font-geist-medium">Secundaria</Text>
        <TextInput
          placeholder="Calle 01 #1A - 11"
          className="border border-gray-200 rounded-lg p-3"
          value={formData.subAddress}
          onChangeText={(text) => handleChange('subAddress', text)}
        />
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
      <View className="flex-row justify-between mt-4">
        <TouchableOpacity
          className="py-3 px-6 border border-gray-200 rounded-lg"
          onPress={() => router.back()}
          disabled={isSubmitting}
        >
          <Text className="font-geist-medium">Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`py-3 px-6 rounded-lg flex-row items-center justify-center ${
            isSubmitting ? 'bg-gray-200 text-black' : 'bg-black'
          }`}
          onPress={updateClient}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <ActivityIndicator size="small" color="white" />
              <Text className="font-geist-medium text-white ml-2">
                Actualizando...
              </Text>
            </>
          ) : (
            <Text className="font-geist-medium text-white">
              Actualizar Cliente
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditClientForm;
