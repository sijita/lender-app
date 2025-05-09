import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { TransactionDetail } from '@/types/transactions';
import { useFocusEffect } from 'expo-router';

export default function useFetchTransactionDetail(transactionId: number) {
  const [transaction, setTransaction] = useState<TransactionDetail | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactionDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener los detalles de la transacción con información relacionada
      const { data, error } = await supabase
        .from('transactions')
        .select(
          `
          *,
          loan:loan_id (
            *,
            client:client_id (*)
          ),
          payment:payment_id (*)
        `
        )
        .eq('id', transactionId)
        .single();

      if (error) {
        throw error;
      }

      setTransaction(data as TransactionDetail);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los detalles de la transacción');
      console.error('Error fetching transaction details:', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (transactionId) {
        fetchTransactionDetail();
      }
    }, [transactionId])
  );

  useEffect(() => {
    if (transactionId) {
      fetchTransactionDetail();
    }
  }, [transactionId]);

  return { transaction, loading, error, refetch: fetchTransactionDetail };
}
