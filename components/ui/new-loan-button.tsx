import useTransactionTabs from '@/store/use-transaction-tabs';
import { Link } from 'expo-router';
import { BanknoteArrowUp } from 'lucide-react-native';
import { TouchableOpacity, Text } from 'react-native';

export default function NewLoanButton({ clientId }: { clientId?: string }) {
  const setActiveTab = useTransactionTabs(state => state.setActiveTab);

  return (
    <Link
      href={clientId ? { pathname: '/new-transaction', params: { clientId } } : '/new-transaction'}
      className="flex-1 px-3 py-4 w-full rounded-xl border border-gray-200"
      asChild
    >
      <TouchableOpacity
        onPress={() => {
          setActiveTab('loan');
        }}
        className="flex-row gap-2 justify-center items-center"
      >
        <Text className="text-center font-geist-medium">Nuevo préstamo</Text>
        <BanknoteArrowUp size={15} color="#6B7280" />
      </TouchableOpacity>
    </Link>
  );
}
