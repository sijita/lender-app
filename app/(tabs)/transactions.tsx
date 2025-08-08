import { View, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import TransactionList from '@/components/transactions/transaction-list';
import { Plus } from 'lucide-react-native';
import CustomSafeScreen from '@/components/ui/custom-safe-screen';
import { useSidebar } from '@/hooks/use-sidebar';
import ToggleButton from '@/components/home/toggle-button';

export default function Transactions() {
  const router = useRouter();
  const isOpen = useSidebar(state => state.isOpen);

  return (
    <CustomSafeScreen>
      <View className="flex-row justify-between items-center px-4 py-6 bg-white border-b border-gray-200">
        {!isOpen && <ToggleButton />}
        <Text className="text-2xl font-geist-bold">Transacciones</Text>
        <TouchableOpacity
          className="flex-row items-center gap-1 bg-black px-4 py-2 rounded-full"
          onPress={() => router.push('/new-transaction')}
        >
          <Text className="text-white font-geist-medium">
            Nueva transacción
          </Text>
          <Plus size={18} color="white" />
        </TouchableOpacity>
      </View>
      <TransactionList />
    </CustomSafeScreen>
  );
}
