import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Transaction } from '@/types/transactions';

export type TransactionType = 'loan_disbursement' | 'payment' | 'all';

interface FetchTransactionsParams {
  type?: TransactionType;
  searchQuery?: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export default function useFetchTransactions(params?: FetchTransactionsParams) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async (queryParams?: FetchTransactionsParams) => {
    try {
      setLoading(true);
      setError(null);

      // Usar los parámetros pasados a la función o los parámetros iniciales
      const activeParams = queryParams || params || {};
      const {
        type,
        searchQuery,
        orderBy = 'created_at',
        orderDirection = 'desc',
      } = activeParams;

      // Iniciar la consulta base
      let query = supabase.from('transactions').select(`
          *,
          loan:loan_id (
            client:client_id (
              name,
              last_name
            )
          )
        `);

      // Aplicar filtro por tipo de transacción si se especifica
      if (type) {
        // Aplicar el filtro directamente por el tipo especificado
        query = query.eq('type', type);
      }

      // Aplicar búsqueda si se proporciona un término
      if (searchQuery && searchQuery.trim() !== '') {
        const isNumeric = /^\d+$/.test(searchQuery);
        let clientIds: string[] = [];
        // Buscar en la tabla de transacciones
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
          // Buscar en transacciones que tengan esos client_ids vía loan
          query = query.in('loan.client_id', clientIds);
        }

        // Si el término es numérico, buscar también por amount
        if (isNumeric) {
          query = query.or(`amount.eq.${searchQuery}`);
        }
      }

      // Aplicar ordenamiento
      query = query.order(orderBy, { ascending: orderDirection === 'asc' });

      const { data, error } = await query;

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
