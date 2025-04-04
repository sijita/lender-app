import { supabase } from '@/lib/supabase';
import { Client } from '@/types/client';
import { useEffect, useState } from 'react';

export default function useFetchClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      setLoading(true);

      // First, fetch all clients
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*');

      if (clientsError) throw clientsError;

      // For each client, fetch their loans
      const clientsWithLoans = await Promise.all(
        clientsData.map(async (client) => {
          const { data: loans, error: loansError } = await supabase
            .from('loans')
            .select('status, outstanding')
            .eq('client_id', client.id);

          if (loansError) throw loansError;

          // Calculate total outstanding amount
          const outstanding = loans.reduce(
            (total, loan) => total + parseFloat(loan.outstanding),
            0
          );

          // Determine status based on loans
          const hasActiveLoans = loans.some(
            (loan) => loan.status === 'active' || loan.status === 'pending'
          );

          return {
            ...client,
            outstanding,
            status: hasActiveLoans ? 'pending' : 'free',
          };
        })
      );

      setClients(clientsWithLoans);
    } catch (err: any) {
      console.error('Error fetching clients:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return { clients, loading, error, refetch: fetchClients };
}
