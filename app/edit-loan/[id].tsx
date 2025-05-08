import { View, ScrollView } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import BackButton from '@/components/ui/back-button';
import EditLoanForm from '@/components/transactions/edit-loan/edit-loan-form';
import CustomSafeScreen from '@/components/ui/custom-safe-screen';

export default function EditLoan() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const loanId = Number(id);

  return (
    <CustomSafeScreen>
      <Stack.Screen options={{ headerShown: false }} />
      <BackButton title="Editar préstamo" />
      <EditLoanForm loanId={loanId} />
    </CustomSafeScreen>
  );
}
