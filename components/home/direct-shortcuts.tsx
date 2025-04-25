import useTransactionTabs from '@/store/use-transaction-tabs';
import { Link } from 'expo-router';
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  UserRoundPlus,
} from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

export default function DirectShortcuts() {
  const setActiveTab = useTransactionTabs((state) => state.setActiveTab);

  return (
    <View className="flex-row gap-2">
      <Link
        href="/new-client"
        className="px-4 py-5 bg-black rounded-xl flex-1"
        asChild
      >
        <TouchableOpacity className="flex-col-reverse items-center justify-center gap-2">
          <Text className="text-white font-geist-medium text-center">
            Nuevo cliente
          </Text>
          <UserRoundPlus size={18} color="white" />
        </TouchableOpacity>
      </Link>
      <Link
        href="/new-transaction"
        className="px-4 py-5 bg-black rounded-xl flex-1"
        asChild
      >
        <TouchableOpacity
          onPress={() => setActiveTab('loan')}
          className="flex-col-reverse items-center justify-center gap-2"
        >
          <Text className="text-white font-geist-medium text-center">
            Nuevo préstamo
          </Text>
          <BanknoteArrowUp size={18} color="white" />
        </TouchableOpacity>
      </Link>
      <Link
        href="/new-transaction"
        className="px-4 py-5 bg-black rounded-xl flex-1"
        asChild
      >
        <TouchableOpacity
          onPress={() => setActiveTab('payment')}
          className="flex-col-reverse items-center justify-center gap-2"
        >
          <Text className="text-white font-geist-medium text-center">
            Nuevo pago
          </Text>
          <BanknoteArrowDown size={18} color="white" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}
