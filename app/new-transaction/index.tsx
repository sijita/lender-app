import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import NewLoanForm from '@/components/transactions/new-transactions/new-loan-form';
import NewPaymentForm from '@/components/transactions/new-transactions/new-payment-form';
import BackButton from '@/components/ui/back-button';

type TabType = 'new-loan' | 'receive-payment';

export default function NewTransaction() {
  const [activeTab, setActiveTab] = useState<TabType>('new-loan');

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />
      <BackButton title="Nueva transacción" />
      <View className="p-5 flex-col gap-5">
        <View className="flex-row bg-gray-100 rounded-lg p-1">
          <TouchableOpacity
            className={`flex-1 py-3 rounded-lg ${
              activeTab === 'new-loan' ? 'bg-white' : ''
            }`}
            onPress={() => setActiveTab('new-loan')}
          >
            <Text
              className={`text-center font-geist-semibold ${
                activeTab === 'new-loan' ? 'text-black' : 'text-gray-500'
              }`}
            >
              Préstamo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 rounded-lg ${
              activeTab === 'receive-payment' ? 'bg-white' : ''
            }`}
            onPress={() => setActiveTab('receive-payment')}
          >
            <Text
              className={`text-center font-geist-semibold ${
                activeTab === 'receive-payment' ? 'text-black' : 'text-gray-500'
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
