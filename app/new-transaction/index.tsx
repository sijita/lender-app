import { View } from 'react-native';
import { Stack } from 'expo-router';
import NewLoanForm from '@/components/transactions/new-transactions/new-loan-form';
import NewPaymentForm from '@/components/transactions/new-transactions/new-payment-form';
import BackButton from '@/components/ui/back-button';
import TransactionTabs from '@/components/transactions/new-transactions/transaction-tabs';
import useTransactionTabs from '@/store/use-transaction-tabs';
import CustomSafeScreen from '@/components/ui/custom-safe-screen';

export type TabType = 'new-loan' | 'receive-payment';

export default function NewTransaction() {
  const activeTab = useTransactionTabs((state) => state.activeTab);
  const setActiveTab = useTransactionTabs((state) => state.setActiveTab);

  return (
    <CustomSafeScreen>
      <Stack.Screen options={{ headerShown: false }} />
      <BackButton title="Nueva transacción" />
      <View className="p-5 flex-col gap-5">
        <TransactionTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={[
            { id: 'loan', label: 'Nuevo préstamo' },
            { id: 'payment', label: 'Nuevo pago' },
          ]}
        />
        <View className="bg-white rounded-lg p-5 border border-gray-100">
          {activeTab === 'loan' ? <NewLoanForm /> : <NewPaymentForm />}
        </View>
      </View>
    </CustomSafeScreen>
  );
}
