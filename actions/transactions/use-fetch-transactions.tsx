import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Transaction } from '@/types/transactions';
import { useDebounce } from 'use-debounce';
import { useRouter } from 'expo-router';
import useTransactionTabs from '@/store/use-transaction-tabs';
import useFetchUpcomingPayments from '../payments/use-fetch-upcoming-payments';
import useFetchOverduePayments from '../payments/use-fetch-overdue-payments';
import { format } from '@formkit/tempo';

export type TransactionType = 'loan_disbursement' | 'payment' | 'all';
export type PaymentStatus = 'completed' | 'upcoming' | 'overdue';

export type TransactionParams = {
  type?: TransactionType;
  searchQuery?: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  paymentStatus?: PaymentStatus;
  startDate?: Date | null;
  endDate?: Date | null;
};

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
  const [paymentStatus, setPaymentStatus] =
    useState<PaymentStatus>('completed');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<'start' | 'end' | null>(
    null
  );

  const { upcomingPayments } = useFetchUpcomingPayments({
    startDate: startDate,
    endDate: endDate,
  });
  const { overduePayments } = useFetchOverduePayments({
    startDate: startDate,
    endDate: endDate,
  });

  const fetchTransactions = async (queryParams?: {
    type?: TransactionType;
    searchQuery?: string;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
    startDate?: Date | null;
    endDate?: Date | null;
    paymentStatus?: PaymentStatus;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const activeParams = queryParams || {};
      const {
        type,
        searchQuery,
        orderBy,
        orderDirection,
        startDate,
        endDate,
        paymentStatus,
      } = activeParams;

      // Si se proporciona un estado de pago, actualizar el estado local
      if (paymentStatus) {
        setPaymentStatus(paymentStatus);
      }

      // Construir la consulta base según el tipo de transacción
      let query = supabase.from('transactions').select(`
          *,
          loan:loan_id (
            id,
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

      // Filtrar por fecha según el tipo de transacción
      if (startDate) {
        query = query.gte(
          'created_at',
          format({
            date: startDate,
            format: 'YYYY-MM-DD',
            tz: 'America/Bogota',
          })
        );
      }

      if (endDate) {
        // Añadir un día a la fecha final para incluir todo el día
        const nextDay = new Date(endDate);
        console.log('nextDay', nextDay); // Agrega este console.log para depurar el valor de nextDay
        nextDay.setDate(nextDay.getDate() + 1);

        console.log('nextDay + 1', nextDay); // Agrega este console.log para depurar el valor de nextDay

        console.log('nextDay.toISOString()'); // Agrega este console.log para depurar el valor de nextDay.toISOString()

        query = query.lt(
          'created_at',
          format({
            date: nextDay,
            format: 'YYYY-MM-DD',
            tz: 'America/Bogota',
          })
        );
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

  // Efecto inicial para cargar las transacciones al montar el componente
  useEffect(() => {
    fetchTransactions({
      type: activeTab === 'loan' ? 'loan_disbursement' : 'payment',
    });
  }, []);

  // Efecto para actualizar las transacciones cuando cambia la pestaña activa
  useEffect(() => {
    fetchTransactions({
      type: activeTab === 'loan' ? 'loan_disbursement' : 'payment',
    });
  }, [activeTab]);

  useEffect(() => {
    fetchTransactions({
      type: activeTab === 'loan' ? 'loan_disbursement' : 'payment',
      searchQuery: debouncedSearchQuery,
    });
  }, [debouncedSearchQuery, activeTab]);

  // Efecto para refrescar cuando cambian las fechas
  useEffect(() => {
    fetchTransactions({
      type: activeTab === 'loan' ? 'loan_disbursement' : 'payment',
      startDate,
      endDate,
    });
  }, [startDate, endDate, activeTab]);

  return {
    transactions:
      activeTab === 'payment' && paymentStatus === 'upcoming'
        ? upcomingPayments
        : activeTab === 'payment' && paymentStatus === 'overdue'
        ? overduePayments
        : transactions,
    loading,
    error,
    router,
    activeTab,
    searchQuery,
    orderBy,
    orderDirection,
    paymentStatus,
    startDate,
    endDate,
    showDatePicker,
    setStartDate,
    setEndDate,
    setShowDatePicker,
    setOrderDirection,
    setOrderBy,
    setActiveTab,
    setSearchQuery,
    setPaymentStatus,
    refetch: fetchTransactions,
  };
}
