import { supabase } from '@/lib/supabase';
import { Client } from '@/schemas/clients/client-schema';
import { LoanWithCalculatedFields } from '@/schemas/loans/loan-schema';
import { useEffect, useState } from 'react';

export default function useFetchLoans() {
  const [loans, setLoans] = useState<
    (LoanWithCalculatedFields & { client: Client | null })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLoans = async () => {
    try {
      setLoading(true);

      const { data: loansData, error: loansError } = await supabase
        .from('loans')
        .select(
          `
          *,
          clients (
            id,
            name,
            last_name
          )
        `
        )
        .order('created_at', { ascending: false });

      if (loansError) throw loansError;

      // Transform the data to match your schema
      const transformedLoans = loansData.map(loan => ({
        id: loan.id,
        clientId: loan.client_id,
        amount: loan.amount.toString(),
        interestRate: loan.interest_rate.toString(),
        term: loan.pending_quotas.toString(),
        startDate: new Date(loan.due_date),
        paymentDate: new Date(loan.payment_date),
        paymentFrequency: loan.payment_frequency,
        status: loan.status,
        notes: loan.notes || '',
        // Calculated fields
        interest: loan.interest,
        quota: loan.quota,
        pendingQuotas: loan.pending_quotas,
        totalAmount: loan.total_amount,
        outstanding: loan.outstanding,
        paidAmount: loan.paid_amount || 0,
        // Add client information
        client: loan.clients
          ? {
              id: loan.clients.id,
              name: `${loan.clients.name} ${loan.clients.last_name}`,
            }
          : null,
      }));

      setLoans(
        transformedLoans as (LoanWithCalculatedFields & {
          client: Client | null;
        })[]
      );
    } catch (err: any) {
      console.error('Error fetching loans:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  return { loans, loading, error, refetch: fetchLoans };
}
