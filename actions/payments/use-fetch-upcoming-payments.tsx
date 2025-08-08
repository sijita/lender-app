import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UpcomingPayment } from '@/types/payments';
import { format, tzDate } from '@formkit/tempo';

interface FetchUpcomingPaymentsParams {
  startDate?: Date | null;
  endDate?: Date | null;
}

// Constantes para mejorar la legibilidad
const TIMEZONE = 'America/Bogota';
const DATE_FORMAT = 'YYYY-MM-DD';
const DISPLAY_FORMAT = 'medium';

export default function useFetchUpcomingPayments(
  params?: FetchUpcomingPaymentsParams
) {
  const [upcomingPayments, setUpcomingPayments] = useState<UpcomingPayment[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para formatear fechas con zona horaria consistente
  const formatDateToString = (
    date: Date | string,
    formatter: string = DATE_FORMAT
  ) => {
    return formatter === DATE_FORMAT
      ? format({
          date,
          format: DATE_FORMAT,
          tz: TIMEZONE,
        })
      : format({
          date,
          format: formatter,
          tz: TIMEZONE,
        });
  };

  // Función para calcular días entre fechas normalizadas
  const calculateDaysDifference = (date1: string, date2: string) => {
    const normalizedDate1 = tzDate(date1, TIMEZONE);
    const normalizedDate2 = tzDate(date2, TIMEZONE);

    return Math.ceil(
      (normalizedDate1.getTime() - normalizedDate2.getTime()) /
        (1000 * 60 * 60 * 24)
    );
  };

  // Función para formatear la fecha de vencimiento en texto amigable
  const formatDueDate = (daysUntilPayment: number, paymentDate: string) => {
    if (daysUntilPayment === 0) return 'Hoy';
    if (daysUntilPayment === 1) return 'Mañana';
    if (daysUntilPayment < 0) return `Hace ${Math.abs(daysUntilPayment)} días`;

    return formatDateToString(paymentDate, DISPLAY_FORMAT);
  };

  // Función para determinar el estado del pago
  const getPaymentStatus = (
    daysUntilPayment: number
  ): 'on_time' | 'at_risk' | 'overdue' => {
    if (daysUntilPayment < 0) return 'overdue';
    if (daysUntilPayment <= 2) return 'at_risk';
    return 'on_time';
  };

  const fetchUpcomingPayments = async () => {
    const activeParams = params || {};

    try {
      setLoading(true);
      setError(null);

      // Obtener préstamos activos con sus clientes
      let query = supabase
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
        .eq('status', 'active');

      // Aplicar filtros de fecha si están presentes
      if (activeParams.startDate) {
        query = query.gte(
          'payment_date',
          formatDateToString(activeParams.startDate)
        );
      }

      if (activeParams.endDate) {
        // Añadir un día a la fecha final para incluir todo el día
        const nextDay = new Date(activeParams.endDate);
        nextDay.setDate(nextDay.getDate() + 1);
        query = query.lt('payment_date', formatDateToString(nextDay));
      }

      // Ordenar por fecha de pago
      query = query.order('payment_date', { ascending: true });

      const { data: loans, error: loansError } = await query;

      if (loansError) {
        throw loansError;
      }

      // Calcular la fecha límite (7 días desde hoy)
      const todayFormatted = formatDateToString(new Date());
      const oneWeekFromNow = new Date();
      oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

      // Filtrar préstamos con pagos próximos (dentro de los próximos 7 días)
      const upcomingLoans = loans.filter(loan => {
        const paymentDateFormatted = formatDateToString(loan.payment_date);
        const daysUntilPayment = calculateDaysDifference(
          paymentDateFormatted,
          todayFormatted
        );

        // Incluir pagos vencidos y los que vencen en los próximos 7 días
        return daysUntilPayment <= 7;
      });

      const formattedPayments = upcomingLoans.map(loan => {
        const paymentDateFormatted = formatDateToString(loan.payment_date);
        const todayFormatted = formatDateToString(new Date());

        const daysUntilPayment = calculateDaysDifference(
          paymentDateFormatted,
          todayFormatted
        );

        // Determinar el estado del pago
        const status = getPaymentStatus(daysUntilPayment);

        // Formatear la fecha de vencimiento
        const formattedDueDate = formatDueDate(
          daysUntilPayment,
          loan.payment_date
        );

        // Construir el nombre completo del cliente
        const clientName = loan.clients //@ts-ignore
          ? `${loan.clients?.name} ${loan.clients?.last_name}`
          : 'Cliente desconocido';

        return {
          clientName,
          amount: loan.quota,
          paymentDate: formattedDueDate,
          transactionId: loan.transactions?.[0]?.id,
          status,
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
  }, [params?.startDate, params?.endDate]);

  return { upcomingPayments, loading, error, refetch: fetchUpcomingPayments };
}
