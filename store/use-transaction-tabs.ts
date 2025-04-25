import { create } from 'zustand';

interface TransactionTabsState {
  activeTab: 'loan' | 'payment';
  setActiveTab: (tab: 'loan' | 'payment') => void;
}

const useTransactionTabs = create<TransactionTabsState>((set) => ({
  activeTab: 'loan',
  setActiveTab: (tab: 'loan' | 'payment') => set({ activeTab: tab }),
}));

export default useTransactionTabs;
