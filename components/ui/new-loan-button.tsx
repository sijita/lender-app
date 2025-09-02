import useTransactionTabs from '@/store/use-transaction-tabs';
import { Link } from 'expo-router';
import { BanknoteArrowUp } from 'lucide-react-native';
import { TouchableOpacity, Text } from 'react-native';

export default function NewLoanButton() {
  const setActiveTab = useTransactionTabs(state => state.setActiveTab);

  return (
    <Link
      href="/new-transaction"
      className="px-3 py-4 border border-gray-200 rounded-xl w-full flex-1"
      asChild
    >
      <TouchableOpacity
        onPress={() => setActiveTab('loan')}
        className="flex-row items-center justify-center gap-2"
      >
        <Text className="text-center font-geist-medium">Nuevo préstamo</Text>
        <BanknoteArrowUp size={15} color="#6B7280" />
      </TouchableOpacity>
    </Link>
  );
}
