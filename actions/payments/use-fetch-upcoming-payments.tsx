import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface UpcomingPayment {
  name: string;
  amount: number;
  dueDate: string;
  status: 'on_time' | 'at_risk' | 'overdue';
}

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
          *,
          clients:client_id (
            name,
            last_name
          )
        `
        )
        .eq('status', 'active')
        .order('payment_date', { ascending: true });

      if (loansError) {
        throw loansError;
      }

      // Obtener la fecha actual
      const today = new Date();

      // Calcular la fecha límite (7 días desde hoy)
      const oneWeekFromNow = new Date(today);
      oneWeekFromNow.setDate(today.getDate() + 7);

      // Filtrar préstamos con pagos próximos (dentro de los próximos 7 días)
      const upcomingLoans = loans.filter((loan) => {
        const paymentDate = new Date(loan.payment_date);
        return paymentDate <= oneWeekFromNow;
      });

      // Transformar los datos al formato requerido por el componente
      const formattedPayments = upcomingLoans.map((loan) => {
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
          formattedDueDate = paymentDate.toLocaleDateString('es-CO', {
            day: 'numeric',
            month: 'short',
          });
        }

        // Construir el nombre completo del cliente
        const clientName = loan.clients
          ? `${loan.clients.name} ${loan.clients.last_name}`
          : 'Cliente desconocido';

        return {
          name: clientName,
          amount: loan.quota,
          dueDate: formattedDueDate,
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
