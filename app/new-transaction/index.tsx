import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import NewLoanForm from '@/components/transactions/new-transactions/new-loan-form';
import NewPaymentForm from '@/components/transactions/new-transactions/new-payment-form';
import BackButton from '@/components/ui/back-button';
import TransactionTabs from '@/components/transactions/new-transactions/transaction-tabs';

export type TabType = 'new-loan' | 'receive-payment';

export default function NewTransaction() {
  const [activeTab, setActiveTab] = useState<TabType>('new-loan');

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />
      <BackButton title="Nueva transacción" />
      <View className="p-5 flex-col gap-5">
        <TransactionTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={[
            { id: 'new-loan', label: 'Nuevo préstamo' },
            { id: 'receive-payment', label: 'Pago recibido' },
          ]}
        />
        <View className="bg-white rounded-lg p-5 border border-gray-100">
          {activeTab === 'new-loan' ? <NewLoanForm /> : <NewPaymentForm />}
        </View>
      </View>
    </ScrollView>
  );
}
