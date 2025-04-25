import { View, Text, TouchableOpacity } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { BanknoteArrowDown, BanknoteArrowUp, Trash } from 'lucide-react-native';
import NewLoanButton from '@/components/ui/new-loan-button';
import NewPaymentButton from '@/components/ui/new-payment-button';

export default function ClientQuickActions() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View className="flex-col gap-6 rounded-xl bg-white p-5 border border-gray-100">
      <Text className="text-xl font-geist-bold">Acciones rápidas</Text>
      <View className="flex-row gap-3">
        <NewLoanButton />
        <NewPaymentButton />
      </View>
      <TouchableOpacity className="flex-row items-center justify-center gap-2 bg-red-500 py-4 rounded-lg">
        <Text className="text-white text-center font-geist-medium">
          Eliminar cliente
        </Text>
        <Trash size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
