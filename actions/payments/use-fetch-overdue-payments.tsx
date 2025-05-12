import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UpcomingPayment } from '@/types/payments';
import { format } from '@formkit/tempo';

export default function useFetchOverduePayments() {
  const [overduePayments, setOverduePayments] = useState<UpcomingPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverduePayments = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener préstamos activos con sus clientes
      const { data: loans, error: loansError } = await supabase
        .from('loans')
        .select(
          `
          id,
          amount,
          payment_date,
          quota,
          status,
          clients:client_id (
            name,
            last_name
          ),
          transactions (
            id
          )
        `
        )
        .eq('status', 'defaulted')
        .order('payment_date', { ascending: false });

      if (loansError) {
        throw loansError;
      }

      const today = new Date();

      const formattedPayments = loans.map((loan) => {
        const paymentDate = new Date(loan.payment_date);
        const daysOverdue = Math.ceil(
          (today.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        let formattedDueDate = '';
        if (daysOverdue === 1) {
          formattedDueDate = 'Ayer';
        } else if (daysOverdue > 1) {
          formattedDueDate = `Hace ${daysOverdue} días`;
        } else {
          formattedDueDate = format({
            date: paymentDate,
            format: 'medium',
            tz: 'America/Bogota',
          });
        }

        // Construir el nombre completo del cliente
        const clientName = loan.clients
          ? `${loan.clients?.name} ${loan.clients?.last_name}`
          : 'Cliente desconocido';

        return {
          clientName: clientName,
          amount: loan.quota,
          paymentDate: formattedDueDate,
          transactionId: loan.transactions?.[0]?.id,
          status: 'overdue',
        };
      });

      setOverduePayments(formattedPayments as UpcomingPayment[]);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los pagos vencidos');
      console.error('Error fetching overdue payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverduePayments();
  }, []);

  return { overduePayments, loading, error, refetch: fetchOverduePayments };
}
