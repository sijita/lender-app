import useTransactionTabs from '@/store/use-transaction-tabs';
import { Link } from 'expo-router';
import { BanknoteArrowDown } from 'lucide-react-native';
import { TouchableOpacity, Text } from 'react-native';

export default function NewPaymentButton() {
  const setActiveTab = useTransactionTabs(state => state.setActiveTab);

  return (
    <Link
      href="/new-transaction"
      className="flex-1 px-3 py-4 w-full bg-green-500 rounded-xl"
      asChild
    >
      <TouchableOpacity
        onPress={() => setActiveTab('payment')}
        className="flex-row gap-2 justify-center items-center"
      >
        <Text className="text-center text-white font-geist-medium">
          Nuevo pago
        </Text>
        <BanknoteArrowDown size={15} color="#fff" />
      </TouchableOpacity>
    </Link>
  );
}
