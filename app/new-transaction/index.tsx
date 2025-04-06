import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import NewLoanForm from '@/components/transactions/new-transactions/new-loan-form';
import NewPaymentForm from '@/components/transactions/new-transactions/new-payment-form';

type TabType = 'new-loan' | 'receive-payment';

export default function NewTransaction() {
  const [activeTab, setActiveTab] = useState<TabType>('new-loan');
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-row gap-5 items-center px-4 py-6 bg-white border-b border-gray-200">
        <TouchableOpacity
          className="flex-row items-center gap-1 bg-black px-5 py-1 rounded-full"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <Text className="text-2xl font-geist-bold">Nueva transacción</Text>
      </View>
      <View className="p-5 flex-col gap-5">
        <View className="flex-row bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
          <TouchableOpacity
            className={`flex-1 py-3 px-4 ${
              activeTab === 'new-loan' ? 'bg-black' : ''
            }`}
            onPress={() => setActiveTab('new-loan')}
          >
            <Text
              className={`text-center font-geist-semibold ${
                activeTab === 'new-loan' ? 'text-white' : 'text-gray-500'
              }`}
            >
              Préstamo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 px-4 ${
              activeTab === 'receive-payment' ? 'bg-black' : ''
            }`}
            onPress={() => setActiveTab('receive-payment')}
          >
            <Text
              className={`text-center font-geist-semibold ${
                activeTab === 'receive-payment' ? 'text-white' : 'text-gray-500'
              }`}
            >
              Pago
            </Text>
          </TouchableOpacity>
        </View>
        <View className="bg-white rounded-lg p-5 border border-gray-100">
          {activeTab === 'new-loan' ? <NewLoanForm /> : <NewPaymentForm />}
        </View>
      </View>
    </ScrollView>
  );
}
