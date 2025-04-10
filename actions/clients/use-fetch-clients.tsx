import { supabase } from '@/lib/supabase';
import { Client } from '@/schemas/clients/client-schema';
import { useEffect, useState } from 'react';

export default function useFetchClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      setLoading(true);

      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*');

      if (clientsError) throw clientsError;

      const clientsWithLoans = await Promise.all(
        clientsData.map(async (client) => {
          const { data: loans, error: loansError } = await supabase
            .from('loans')
            .select('status, outstanding')
            .eq('client_id', client.id);

          if (loansError) throw loansError;

          const outstanding = loans.reduce(
            (total, loan) => total + parseFloat(loan.outstanding),
            0
          );

          const hasActiveLoansWithoutDefaulted = loans.some(
            (loan) => loan.status === 'active'
          );
          const hasActiveLoansWithDefaulted = loans.some(
            (loan) => loan.status === 'defaulted'
          );

          return {
            ...client,
            outstanding,
            status: hasActiveLoansWithoutDefaulted
              ? 'pendiente'
              : hasActiveLoansWithDefaulted
              ? 'defaulted'
              : 'completed',
          };
        })
      );

      // Transform snake_case to camelCase for client properties
      setClients(
        clientsWithLoans.map((client) => ({
          id: client.id,
          name: client.name,
          lastName: client.last_name,
          email: client.email,
          phone: client.phone,
          address: client.address,
          subAddress: client.sub_address,
          documentType: client.document_type,
          documentNumber: client.document_number,
          notes: client.notes,
          outstanding: client.outstanding,
          status: client.status,
        }))
      );
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
