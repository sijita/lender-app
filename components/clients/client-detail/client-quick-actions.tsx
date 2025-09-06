import { View, Text, TouchableOpacity } from 'react-native';
import { Trash } from 'lucide-react-native';
import NewLoanButton from '@/components/ui/new-loan-button';
import NewPaymentButton from '@/components/ui/new-payment-button';

export default function ClientQuickActions({
  clientId,
}: {
  clientId?: string;
}) {
  return (
    <View className="flex-col gap-6 p-5 bg-white rounded-xl border border-gray-100">
      <Text className="text-xl font-geist-bold">Acciones rápidas</Text>
      <View className="flex-row gap-3">
        <NewLoanButton clientId={clientId} />
        <NewPaymentButton />
      </View>
      <TouchableOpacity className="flex-row gap-2 justify-center items-center py-4 bg-red-500 rounded-xl">
        <Text className="text-center text-white font-geist-medium">
          Eliminar cliente
        </Text>
        <Trash size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
