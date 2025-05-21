import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UpcomingPayment } from '@/types/payments';
import { format, tzDate } from '@formkit/tempo';

interface FetchOverduePaymentsParams {
  startDate?: Date | null;
  endDate?: Date | null;
}

// Constantes para mejorar la legibilidad
const TIMEZONE = 'America/Bogota';
const DATE_FORMAT = 'YYYY-MM-DD';
const DISPLAY_FORMAT = 'medium';

export default function useFetchOverduePayments(
  params?: FetchOverduePaymentsParams
) {
  const [overduePayments, setOverduePayments] = useState<UpcomingPayment[]>([]);
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
  const formatDueDate = (daysOverdue: number, paymentDate: string) => {
    if (daysOverdue === 1) return 'Ayer';
    if (daysOverdue > 1) return `Hace ${daysOverdue} días`;

    return formatDateToString(paymentDate, DISPLAY_FORMAT);
  };

  const fetchOverduePayments = async (
    queryParams?: FetchOverduePaymentsParams
  ) => {
    const activeParams = queryParams || params || {};
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
        .eq('status', 'defaulted');

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
      query = query.order('payment_date', { ascending: false });

      const { data: loans, error: loansError } = await query;

      if (loansError) {
        throw loansError;
      }

      const todayFormatted = formatDateToString(new Date());

      const formattedPayments = loans.map((loan) => {
        const paymentDateFormatted = formatDateToString(loan.payment_date);

        // Calcular días de vencimiento usando fechas normalizadas
        const daysOverdue = Math.abs(
          calculateDaysDifference(todayFormatted, paymentDateFormatted)
        );

        // Formatear la fecha de vencimiento
        const formattedDueDate = formatDueDate(daysOverdue, loan.payment_date);

        // Construir el nombre completo del cliente
        const clientName = loan.clients
          ? `${loan.clients?.name} ${loan.clients?.last_name}`
          : 'Cliente desconocido';

        return {
          clientName,
          amount: loan.quota,
          paymentDate: formattedDueDate,
          transactionId: loan.transactions?.[0]?.id,
          status: 'overdue' as const,
        };
      });

      setOverduePayments(formattedPayments);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los pagos vencidos');
      console.error('Error fetching overdue payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverduePayments();
  }, [params?.startDate, params?.endDate]);

  return { overduePayments, loading, error, refetch: fetchOverduePayments };
}
