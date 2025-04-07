import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Transaction } from '@/types/transactions';

interface RecentTransaction {
  name: string;
  type: 'payment_received' | 'new_loan';
  amount: number;
  date: string;
}

export default function useFetchRecentTransactions() {
  const [recentTransactions, setRecentTransactions] = useState<
    RecentTransaction[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener las transacciones más recientes
      const { data, error } = await supabase
        .from('transactions')
        .select(
          `
          *,
          loan:loan_id (
            client:client_id (
              name,
              last_name
            )
          )
        `
        )
        .order('created_at', { ascending: false })
        .limit(5); // Limitar a las 5 transacciones más recientes

      if (error) {
        throw error;
      }

      // Transformar los datos al formato requerido por el componente
      const formattedTransactions = data.map((transaction: Transaction) => {
        // Determinar el tipo de transacción
        const transactionType =
          transaction.type === 'payment' ? 'payment_received' : 'new_loan';

        // Formatear la fecha
        const transactionDate = new Date(transaction.created_at);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        let formattedDate = '';
        if (transactionDate.toDateString() === today.toDateString()) {
          formattedDate = 'Hoy';
        } else if (
          transactionDate.toDateString() === yesterday.toDateString()
        ) {
          formattedDate = 'Ayer';
        } else {
          formattedDate = transactionDate.toLocaleDateString('es-CO', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          });
        }

        // Construir el nombre completo del cliente
        const clientName = transaction.loan?.client
          ? `${transaction.loan.client.name} ${transaction.loan.client.last_name}`
          : 'Cliente desconocido';

        return {
          name: clientName,
          type: transactionType as 'payment_received' | 'new_loan',
          amount: transaction.amount,
          date: formattedDate,
        };
      });

      setRecentTransactions(formattedTransactions);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las transacciones recientes');
      console.error('Error fetching recent transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentTransactions();
  }, []);

  return {
    recentTransactions,
    loading,
    error,
    refetch: fetchRecentTransactions,
  };
}
