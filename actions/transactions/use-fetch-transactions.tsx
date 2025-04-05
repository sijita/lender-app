import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Transaction } from '@/types/transactions';

export default function useFetchTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('transactions')
        .select(
          `
          *,
          loan:loan_id (
            client:client_id (
              name
            )
          )
        `
        )
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setTransactions(data || []);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las transacciones');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return { transactions, loading, error, refetch: fetchTransactions };
}
