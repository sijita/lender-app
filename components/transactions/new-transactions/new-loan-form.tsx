import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const NewLoanForm = () => {
  return (
    <View className="flex-col gap-5">
      <Text className="text-xl font-geist-bold mb-2">
        Registrar nuevo préstamo
      </Text>
      <View className="flex-col gap-2">
        <Text className="font-geist-medium">Cliente</Text>
        <TouchableOpacity className="border border-gray-200 rounded-lg p-3 flex-row justify-between items-center">
          <Text className="text-gray-500">Seleccionar cliente</Text>
          <Ionicons name="chevron-down" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>
      <View className="flex-col gap-2">
        <Text className="font-geist-medium">Loan Amount</Text>
        <View className="border border-gray-200 rounded-lg flex-row items-center">
          <Text className="text-gray-500 pl-3 pr-1">$</Text>
          <TextInput
            placeholder="0.00"
            keyboardType="decimal-pad"
            className="flex-1 p-3"
          />
        </View>
      </View>
      <View className="flex-col gap-2">
        <Text className="font-geist-medium">Fecha</Text>
        <TouchableOpacity className="border border-gray-200 rounded-lg p-3 flex-row justify-between items-center">
          <Text className="text-gray-500">dd / mm / aaaa</Text>
          <Ionicons name="calendar-outline" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>
      <View className="flex-col gap-2">
        <Text className="font-geist-medium">Interes (%)</Text>
        <TextInput
          placeholder="0.0"
          keyboardType="decimal-pad"
          className="border border-gray-200 rounded-lg p-3"
        />
      </View>
      <View className="flex-col gap-2">
        <Text className="font-geist-medium">Cuotas (Meses)</Text>
        <View className="border border-gray-200 rounded-lg flex-row items-center">
          <TextInput
            placeholder="12"
            keyboardType="number-pad"
            className="flex-1 p-3"
          />
          <TouchableOpacity className="px-3">
            <Ionicons name="chevron-up-outline" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex-col gap-2">
        <Text className="font-geist-medium">Fecha de pago</Text>
        <TouchableOpacity className="border border-gray-200 rounded-lg p-3 flex-row justify-between items-center">
          <Text className="text-gray-500">dd / mm / aaaa</Text>
          <Ionicons name="chevron-down" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>
      <View className="flex-col gap-2">
        <Text className="font-geist-medium">Notas</Text>
        <TextInput
          placeholder="Añadir cualquier detalle adicional sobre este préstamo..."
          multiline
          numberOfLines={4}
          className="border border-gray-200 rounded-lg p-3 h-24 text-base"
          textAlignVertical="top"
        />
      </View>
      <View className="flex-row justify-between mt-4">
        <TouchableOpacity
          className="py-3 px-6 border border-gray-200 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="font-geist-medium">Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity className="py-3 px-6 bg-black rounded-lg">
          <Text className="font-geist-medium text-white">
            Registrar préstamo
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NewLoanForm;

const styles = StyleSheet.create({});
