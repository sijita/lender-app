import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UpcomingPayment } from '@/types/payments';
import { format } from '@formkit/tempo';

export default function useFetchUpcomingPayments() {
  const [upcomingPayments, setUpcomingPayments] = useState<UpcomingPayment[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUpcomingPayments = async () => {
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
        .eq('status', 'active')
        .order('payment_date', { ascending: true });

      if (loansError) {
        throw loansError;
      }

      const today = new Date();

      // Calcular la fecha límite (7 días desde hoy)
      const oneWeekFromNow = new Date(today);
      oneWeekFromNow.setDate(today.getDate() + 7);

      // Filtrar préstamos con pagos próximos (dentro de los próximos 7 días)
      const upcomingPayments = loans.filter((loan) => {
        const paymentDate = new Date(loan.payment_date);
        return paymentDate <= oneWeekFromNow;
      });

      const formattedPayments = upcomingPayments.map((loan) => {
        const paymentDate = new Date(loan.payment_date);
        const daysUntilPayment = Math.ceil(
          (paymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Determinar el estado del pago
        let status: 'on_time' | 'at_risk' | 'overdue' = 'on_time';
        if (daysUntilPayment < 0) {
          status = 'overdue';
        } else if (daysUntilPayment <= 2) {
          status = 'at_risk';
        }

        // Formatear la fecha de vencimiento
        let formattedDueDate = '';
        if (daysUntilPayment === 0) {
          formattedDueDate = 'Hoy';
        } else if (daysUntilPayment === 1) {
          formattedDueDate = 'Mañana';
        } else if (daysUntilPayment < 0) {
          formattedDueDate = `Hace ${Math.abs(daysUntilPayment)} días`;
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
          status: status,
        };
      });

      setUpcomingPayments(formattedPayments);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los pagos próximos');
      console.error('Error fetching upcoming payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingPayments();
  }, []);

  return { upcomingPayments, loading, error, refetch: fetchUpcomingPayments };
}
