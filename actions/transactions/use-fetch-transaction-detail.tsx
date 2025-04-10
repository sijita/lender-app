import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Transaction } from '@/types/transactions';

interface TransactionDetail extends Transaction {
  loan: {
    id: number;
    amount: number;
    interest_rate: number;
    term: number;
    due_date: string;
    payment_frequency: string;
    status: string;
    total_amount: number;
    outstanding: number;
    paid_amount: number;
    pending_quotas: number;
    quota: number;
    payment_date: string;
    client: {
      id: number;
      name: string;
      last_name: string;
      email: string;
      phone: string;
      address: string;
      sub_address?: string;
      document_type: string;
      document_number: number;
      created_at: string;
    };
  };
  payment?: {
    id: number;
    amount: number;
    date: string;
    method: string;
  };
}

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

  useEffect(() => {
    if (transactionId) {
      fetchTransactionDetail();
    }
  }, [transactionId]);

  return { transaction, loading, error, refetch: fetchTransactionDetail };
}
