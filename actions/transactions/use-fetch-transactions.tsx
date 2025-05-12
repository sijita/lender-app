import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Transaction } from '@/types/transactions';
import { useDebounce } from 'use-debounce';
import { useRouter } from 'expo-router';
import useTransactionTabs from '@/store/use-transaction-tabs';
import useFetchUpcomingPayments from '../payments/use-fetch-upcoming-payments';
import useFetchOverduePayments from '../payments/use-fetch-overdue-payments';

export type TransactionType = 'loan_disbursement' | 'payment' | 'all';
export type PaymentStatus = 'all' | 'completed' | 'upcoming' | 'overdue';

export default function useFetchTransactions() {
  const router = useRouter();
  const activeTab = useTransactionTabs((state) => state.activeTab);
  const setActiveTab = useTransactionTabs((state) => state.setActiveTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 1000);
  const [orderBy, setOrderBy] = useState('created_at');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('desc');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('all');

  const { upcomingPayments } = useFetchUpcomingPayments();
  const { overduePayments } = useFetchOverduePayments();

  console.log('activeTab', activeTab);
  console.log('paymentStatus', paymentStatus);

  const fetchTransactions = async (queryParams?: {
    type?: TransactionType;
    searchQuery?: string;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
  }) => {
    try {
      setLoading(true);
      setError(null);

      const activeParams = queryParams || {};
      const { type, searchQuery, orderBy, orderDirection } = activeParams;

      let query = supabase.from('transactions').select(`
          *,
          loan:loan_id (
            client:client_id (
              name,
              last_name
            )
          )
        `);

      if (type) {
        query = query.eq('type', type);
      }

      if (searchQuery && searchQuery.trim() !== '') {
        const isNumeric = /^\d+$/.test(searchQuery);
        let clientIds: string[] = [];
        const { data: clients, error: clientError } = await supabase
          .from('clients')
          .select('id')
          .or(
            isNumeric
              ? `document_number.eq.${searchQuery}`
              : `name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`
          );

        if (clientError) throw clientError;

        if (clients && clients.length > 0) {
          clientIds = clients.map((c) => c.id);
        }

        if (clientIds.length > 0) {
          query = query.in('loan.client_id', clientIds);
        }

        if (isNumeric) {
          query = query.or(`amount.eq.${searchQuery}`);
        }
      }

      if (orderBy) {
        query = query.order(orderBy, { ascending: orderDirection === 'asc' });
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return setTransactions(data || []);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las transacciones');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions({
      type: activeTab === 'loan' ? 'loan_disbursement' : 'payment',
    });
  }, [activeTab]);

  useEffect(() => {
    fetchTransactions({
      searchQuery: debouncedSearchQuery,
    });
  }, [debouncedSearchQuery]);

  return {
    transactions:
      activeTab === 'payment' && paymentStatus === 'upcoming'
        ? upcomingPayments
        : activeTab === 'payment' && paymentStatus === 'overdue'
        ? overduePayments
        : activeTab === 'payment' && paymentStatus === 'all'
        ? [...transactions, ...upcomingPayments, ...overduePayments]
        : transactions,
    loading,
    error,
    router,
    activeTab,
    searchQuery,
    orderBy,
    orderDirection,
    paymentStatus,
    setOrderDirection,
    setOrderBy,
    setActiveTab,
    setSearchQuery,
    setPaymentStatus,
    refetch: fetchTransactions,
  };
}
