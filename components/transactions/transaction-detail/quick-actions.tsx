import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { SquarePen } from 'lucide-react-native';
import NewLoanButton from '@/components/ui/new-loan-button';
import NewPaymentButton from '@/components/ui/new-payment-button';

export default function QuickActions({ loanId }: { loanId: number }) {
  return (
    <View className="flex-col gap-6 rounded-xl bg-white p-5 border border-gray-100">
      <Text className="text-xl font-geist-bold">Acciones rápidas</Text>
      <Link
        href={`/edit-loan/${loanId}`}
        className="bg-gray-800 py-4 rounded-lg"
        asChild
      >
        <TouchableOpacity className="flex-row items-center justify-center gap-2">
          <Text className="text-white text-center font-geist-medium">
            Editar préstamo
          </Text>
          <SquarePen size={16} color="#fff" />
        </TouchableOpacity>
      </Link>
      <View className="flex-row gap-3">
        <NewLoanButton />
        <NewPaymentButton />
      </View>
    </View>
  );
}
