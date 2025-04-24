import { View, ScrollView } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import BackButton from '@/components/ui/back-button';
import EditLoanForm from '@/components/transactions/edit-loan/edit-loan-form';

export default function EditLoan() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const loanId = Number(id);

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />
      <BackButton title="Editar préstamo" />
      <View className="bg-white rounded-lg p-5 shadow-sm">
        <EditLoanForm loanId={loanId} />
      </View>
    </ScrollView>
  );
}
