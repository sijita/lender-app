import useTransactionTabs from '@/store/use-transaction-tabs';
import { Link } from 'expo-router';
import { BanknoteArrowDown } from 'lucide-react-native';
import { TouchableOpacity, Text } from 'react-native';

export default function NewPaymentButton() {
  const setActiveTab = useTransactionTabs(state => state.setActiveTab);

  return (
    <Link
      href="/new-transaction"
      className="px-3 py-4 bg-black rounded-lg w-full flex-1"
      asChild
    >
      <TouchableOpacity
        onPress={() => setActiveTab('payment')}
        className="flex-row items-center justify-center gap-2"
      >
        <Text className="text-white text-center font-geist-medium">
          Nuevo pago
        </Text>
        <BanknoteArrowDown size={15} color="#fff" />
      </TouchableOpacity>
    </Link>
  );
}
