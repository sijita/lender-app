import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import TransactionList from '@/components/transactions/transaction-list';

const mockTransactions = [
  {
    date: 'Mar 17, 2025',
    client: 'Sarah Johnson',
    description: 'New loan agreement',
    amount: 1200.0,
    type: 'loan' as const,
    balance: 12450.0,
  },
  {
    date: 'Mar 17, 2025',
    client: 'John Smith',
    description: 'Monthly payment',
    amount: 500.0,
    type: 'payment' as const,
    balance: 11250.0,
  },
  {
    date: 'Mar 15, 2025',
    client: 'Michael Brown',
    description: 'Partial payment',
    amount: 350.0,
    type: 'payment' as const,
    balance: 11750.0,
  },
  {
    date: 'Mar 12, 2025',
    client: 'Emily Davis',
    description: 'New loan agreement',
    amount: 800.0,
    type: 'loan' as const,
    balance: 12100.0,
  },
  {
    date: 'Mar 10, 2025',
    client: 'David Miller',
    description: 'Late payment fee',
    amount: 25.0,
    type: 'fee' as const,
    balance: 11300.0,
  },
  {
    date: 'Mar 8, 2025',
    client: 'Jennifer Lee',
    description: 'Monthly payment',
    amount: 420.0,
    type: 'payment' as const,
    balance: 11275.0,
  },
  {
    date: 'Mar 5, 2025',
    client: 'Robert Wilson',
    description: 'New loan agreement',
    amount: 750.0,
    type: 'loan' as const,
    balance: 11695.0,
  },
  {
    date: 'Mar 3, 2025',
    client: 'Lisa Taylor',
    description: 'Monthly payment',
    amount: 180.0,
    type: 'payment' as const,
    balance: 10945.0,
  },
];

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
      <TransactionList transactions={mockTransactions} />
    </View>
  );
}
