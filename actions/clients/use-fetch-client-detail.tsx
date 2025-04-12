import { supabase } from '@/lib/supabase';
import { Loan } from '@/schemas/loans/loan-schema';
import { useState, useEffect } from 'react';

export interface ClientDetail {
  id: number;
  name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  sub_address?: string;
  document_type: string;
  document_number: number;
  notes?: string;
  created_at: string;
  financial_summary: {
    total_loans: number;
    active_loans: number;
    total_amount: number;
    pending_amount: number;
    next_payment?: {
      date: string;
      amount: number;
    };
  };
  payment_history: Array<{
    id: number;
    date: string;
    amount: number;
    status: string;
    method?: string;
    notes?: string;
  }>;
  activity_history: Array<{
    id: number;
    type: string;
    description: string;
    date: string;
    amount?: number;
  }>;
  loans_history: {
    id: number;
    amount: number;
    status: Loan['status'];
    created_at: Date;
  }[];
  profile: {
    loans_count: number;
    on_time_payments: number;
    late_payments: number;
    missed_payments: number;
    client_name?: string;
    client_since?: string;
  };
}

export default function useFetchClientDetail(clientId: number) {
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClientDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Obtener datos básicos del cliente
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();

      if (clientError) throw clientError;
      if (!clientData) throw new Error('Cliente no encontrado');

      // 2. Obtener préstamos del cliente
      const { data: loansData, error: loansError } = await supabase
        .from('loans')
        .select('*')
        .eq('client_id', clientId);

      if (loansError) throw loansError;

      // 3. Obtener pagos relacionados con los préstamos del cliente
      const loanIds = loansData.map((loan) => loan.id);
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .in('loan_id', loanIds)
        .order('created_at', { ascending: false });

      if (paymentsError) throw paymentsError;

      // 4. Obtener transacciones relacionadas con los préstamos del cliente
      const { data: transactionsData, error: transactionsError } =
        await supabase
          .from('transactions')
          .select('*')
          .in('loan_id', loanIds)
          .order('created_at', { ascending: false });

      if (transactionsError) throw transactionsError;

      // Calcular resumen financiero
      const activeLoans = loansData.filter(
        (loan) => loan.status === 'active' || loan.status === 'defaulted'
      );

      const totalAmount = loansData.reduce(
        (sum, loan) => sum + parseFloat(loan.total_amount),
        0
      );

      const pendingAmount = activeLoans.reduce(
        (sum, loan) => sum + parseFloat(loan.outstanding),
        0
      );

      // Encontrar el próximo pago
      const today = new Date();
      const upcomingPayments = activeLoans
        .filter((loan) => new Date(loan.due_date) > today)
        .sort(
          (a, b) =>
            new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
        );

      const nextPayment =
        upcomingPayments.length > 0
          ? {
              date: upcomingPayments[0].payment_date,
              amount: parseFloat(upcomingPayments[0].quota),
            }
          : undefined;

      // Calcular estadísticas de pagos
      const totalPayments = paymentsData.length;
      const onTimePayments = paymentsData.filter(
        (payment) => payment.status === 'completed'
      ).length;
      const latePayments = paymentsData.filter(
        (payment) => payment.status === 'late'
      ).length;
      const missedPayments = paymentsData.filter(
        (payment) => payment.status === 'missed'
      ).length;

      // Calcular porcentajes
      const onTimePercentage =
        totalPayments > 0
          ? Math.round((onTimePayments / totalPayments) * 100)
          : 0;
      const latePercentage =
        totalPayments > 0
          ? Math.round((latePayments / totalPayments) * 100)
          : 0;
      const missedPercentage =
        totalPayments > 0
          ? Math.round((missedPayments / totalPayments) * 100)
          : 0;

      // Formatear historial de pagos
      const paymentHistory = paymentsData.map((payment) => ({
        id: payment.id,
        date: payment.created_at,
        amount: parseFloat(payment.amount),
        status: payment.status,
        method: payment.method,
        notes: payment.notes,
      }));

      // Formatear historial de actividades (combinando transacciones y pagos)
      const activityHistory = [
        ...transactionsData.map((transaction) => ({
          id: transaction.id,
          type: transaction.type,
          description:
            transaction.type === 'loan_disbursement'
              ? 'Préstamo otorgado'
              : transaction.type === 'payment'
              ? 'Pago recibido'
              : 'Transacción',
          date: transaction.created_at,
          amount: parseFloat(transaction.amount),
        })),
        ...paymentsData.map((payment) => ({
          id: payment.id + 10000, // Evitar colisiones de ID
          type: 'payment',
          description: `Pago ${
            payment.status === 'completed'
              ? 'completado'
              : payment.status === 'late'
              ? 'con retraso'
              : 'pendiente'
          }`,
          date: payment.created_at,
          amount: parseFloat(payment.amount),
        })),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      // Construir objeto de cliente detallado
      const clientDetail: ClientDetail = {
        id: clientData.id,
        name: clientData.name,
        last_name: clientData.last_name,
        email: clientData.email,
        phone: clientData.phone,
        address: clientData.address,
        sub_address: clientData.sub_address,
        document_type: clientData.document_type,
        document_number: clientData.document_number,
        notes: clientData.notes,
        created_at: clientData.created_at,
        financial_summary: {
          total_loans: loansData.length,
          active_loans: activeLoans.length,
          total_amount: totalAmount,
          pending_amount: pendingAmount,
          next_payment: nextPayment,
        },
        payment_history: paymentHistory,
        loans_history: loansData,
        activity_history: activityHistory,
        profile: {
          loans_count: loansData.length,
          on_time_payments: onTimePercentage,
          late_payments: latePercentage,
          missed_payments: missedPercentage,
          client_name: `${clientData.name} ${clientData.last_name}`,
          client_since: new Date(clientData.created_at).toLocaleDateString(
            'es-ES',
            {
              month: 'long',
              year: 'numeric',
            }
          ),
        },
      };

      setClient(clientDetail);
    } catch (err: any) {
      console.error('Error fetching client details:', err);
      setError(err.message || 'Error al cargar los datos del cliente');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientDetail();
  }, [clientId]);

  return { client, loading, error, refetch: fetchClientDetail };
}
