import { View } from 'react-native';
import RecentTransactions from './recent-transactions';
import UpcomingPayments from './upcoming-payments';

const transactionsData = [
  {
    name: 'John Smith',
    type: 'payment_received' as const,
    amount: 500,
    date: 'Today',
  },
  {
    name: 'Sarah Johnson',
    type: 'new_loan' as const,
    amount: 1200,
    date: 'Yesterday',
  },
  {
    name: 'Michael Brown',
    type: 'payment_received' as const,
    amount: 350,
    date: 'Mar 15, 2025',
  },
  {
    name: 'Emily Davis',
    type: 'new_loan' as const,
    amount: 800,
    date: 'Mar 12, 2025',
  },
];

const paymentsData = [
  {
    name: 'Robert Wilson',
    amount: 250,
    dueDate: 'Tomorrow',
    status: 'on_time' as const,
  },
  {
    name: 'Jennifer Lee',
    amount: 420,
    dueDate: 'Mar 19, 2025',
    status: 'on_time' as const,
  },
  {
    name: 'David Miller',
    amount: 600,
    dueDate: 'Mar 20, 2025',
    status: 'at_risk' as const,
  },
  {
    name: 'Lisa Taylor',
    amount: 180,
    dueDate: 'Mar 22, 2025',
    status: 'on_time' as const,
  },
];

export default function TransactionsSection() {
  return (
    <View className="flex-col">
      <RecentTransactions transactions={transactionsData} />
      <UpcomingPayments payments={paymentsData} />
    </View>
  );
}
