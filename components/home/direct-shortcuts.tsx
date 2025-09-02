import useTransactionTabs from '@/store/use-transaction-tabs';
import { Link } from 'expo-router';
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  UserRoundPlus,
} from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

export default function DirectShortcuts() {
  const setActiveTab = useTransactionTabs(state => state.setActiveTab);

  return (
    <View className="flex-row gap-2">
      <Link
        href="/new-client"
        className="flex-1 px-4 py-5 bg-black rounded-2xl"
        asChild
      >
        <TouchableOpacity className="flex-col-reverse gap-2 justify-center items-center">
          <Text className="text-center text-white font-geist-medium">
            Nuevo cliente
          </Text>
          <UserRoundPlus size={18} color="white" />
        </TouchableOpacity>
      </Link>
      <Link
        href="/new-transaction"
        className="flex-1 px-4 py-5 bg-black rounded-xl"
        asChild
      >
        <TouchableOpacity
          onPress={() => setActiveTab('loan')}
          className="flex-col-reverse gap-2 justify-center items-center"
        >
          <Text className="text-center text-white font-geist-medium">
            Nuevo préstamo
          </Text>
          <BanknoteArrowUp size={18} color="white" />
        </TouchableOpacity>
      </Link>
      <Link
        href="/new-transaction"
        className="flex-1 px-4 py-5 bg-black rounded-xl"
        asChild
      >
        <TouchableOpacity
          onPress={() => setActiveTab('payment')}
          className="flex-col-reverse gap-2 justify-center items-center"
        >
          <Text className="text-center text-white font-geist-medium">
            Nuevo pago
          </Text>
          <BanknoteArrowDown size={18} color="white" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}
