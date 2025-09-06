import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { SquarePen } from 'lucide-react-native';
import NewLoanButton from '@/components/ui/new-loan-button';
import NewPaymentButton from '@/components/ui/new-payment-button';

export default function QuickActions({
  loanId,
  clientId,
}: {
  loanId: number;
  clientId?: string;
}) {
  return (
    <View className="flex-col gap-6 p-5 bg-white rounded-xl border border-gray-100">
      <Text className="text-xl font-geist-bold">Acciones rápidas</Text>
      <Link
        href={`/edit-loan/${loanId}`}
        className="py-4 bg-amber-500 rounded-xl"
        asChild
      >
        <TouchableOpacity className="flex-row gap-2 justify-center items-center">
          <Text className="text-center text-white font-geist-medium">
            Editar préstamo
          </Text>
          <SquarePen size={16} color="#fff" />
        </TouchableOpacity>
      </Link>
      <View className="flex-row gap-3">
        <NewLoanButton clientId={clientId} />
        <NewPaymentButton clientId={clientId} />
      </View>
    </View>
  );
}
