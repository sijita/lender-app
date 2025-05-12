import { TransactionType } from '@/actions/transactions/use-fetch-transactions';
import { Text, TouchableOpacity, View } from 'react-native';

type TransactionParams = {
  type?: TransactionType;
  searchQuery?: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  paymentStatus?: 'all' | 'completed' | 'upcoming' | 'overdue';
};

export default function TransactionTabs({
  activeTab,
  setActiveTab,
  tabs,
  transactionParams,
  refetch,
}: {
  activeTab: string;
  setActiveTab: (tab: 'loan' | 'payment') => void;
  tabs: { id: string; label: string }[];
  transactionParams?: TransactionParams;
  refetch?: (queryParams?: TransactionParams) => Promise<void>;
}) {
  return (
    <View className="w-full border-b border-gray-200">
      <View className="flex-row">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            className={`flex-1 items-center px-5 py-4 ${
              activeTab === tab.id ? 'border-b-2 border-black' : ''
            }`}
            onPress={() => {
              const newTabId = tab.id as 'loan' | 'payment';
              setActiveTab(newTabId);
              const newTransactionType =
                newTabId === 'loan' ? 'loan_disbursement' : 'payment';
              if (refetch) {
                refetch({
                  ...transactionParams,
                  type: newTransactionType,
                });
              }
            }}
          >
            <Text
              className={`font-geist-semibold ${
                activeTab === tab.id ? 'text-black' : 'text-gray-500'
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
