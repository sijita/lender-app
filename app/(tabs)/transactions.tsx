import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import TransactionList from '@/components/transactions/transaction-list';

export default function Transactions() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-row justify-between items-center px-4 py-6 bg-white border-b border-gray-200">
        <Text className="text-2xl font-geist-bold">Transacciones</Text>
        <TouchableOpacity
          className="flex-row items-center gap-1 bg-black px-4 py-2 rounded-full"
          onPress={() => router.push('/new-transaction')}
        >
          <Text className="text-white font-geist-medium">
            Nueva transacción
          </Text>
          <Ionicons name="add" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <TransactionList />
    </View>
  );
}
