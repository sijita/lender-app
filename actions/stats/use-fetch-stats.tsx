import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface StatsData {
  totalOutstanding: number;
  activeClients: number;
  newClientsThisMonth: number;
  upcomingPayments: number;
  monthlyIncome: number;
  monthlyIncomeChange: number;
  outstandingChange: number;
  monthlyLoanedAmount: number;
  monthlyLoanedAmountChange: number;
}

export default function useFetchStats() {
  const [stats, setStats] = useState<StatsData>({
    totalOutstanding: 0,
    activeClients: 0,
    newClientsThisMonth: 0,
    upcomingPayments: 0,
    monthlyIncome: 0,
    monthlyIncomeChange: 0,
    outstandingChange: 0,
    monthlyLoanedAmount: 0,
    monthlyLoanedAmountChange: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current date info for calculations
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const previousMonthYear =
        currentMonth === 0 ? currentYear - 1 : currentYear;

      const firstDayOfMonth = new Date(
        currentYear,
        currentMonth,
        1
      ).toISOString();
      const firstDayOfPreviousMonth = new Date(
        previousMonthYear,
        previousMonth,
        1
      ).toISOString();
      const lastDayOfPreviousMonth = new Date(
        currentYear,
        currentMonth,
        0
      ).toISOString();

      // Calculate one week from now for upcoming payments
      const oneWeekFromNow = new Date();
      oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

      // 1. Get total outstanding amount from active loans
      const { data: loansData, error: loansError } = await supabase
        .from('loans')
        .select('outstanding, created_at')
        .eq('status', 'active');

      if (loansError) throw loansError;

      // Calculate total outstanding
      const totalOutstanding = loansData.reduce(
        (sum, loan) => sum + parseFloat(loan.outstanding),
        0
      );

      // Calculate previous month's total outstanding for comparison
      const previousMonthLoans = await supabase
        .from('loans')
        .select('outstanding')
        .eq('status', 'active')
        .lt('created_at', lastDayOfPreviousMonth);

      const previousMonthOutstanding =
        previousMonthLoans.data?.reduce(
          (sum, loan) => sum + parseFloat(loan.outstanding),
          0
        ) || 0;

      // Calculate percentage change in outstanding amount
      const outstandingChange =
        previousMonthOutstanding > 0
          ? ((totalOutstanding - previousMonthOutstanding) /
              previousMonthOutstanding) *
            100
          : 0;

      // 2. Get active clients count
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('id, created_at');

      if (clientsError) throw clientsError;

      // Get active clients (clients with active loans)
      const { data: activeClientsData, error: activeClientsError } =
        await supabase
          .from('loans')
          .select('client_id')
          .eq('status', 'active')
          .order('client_id');

      if (activeClientsError) throw activeClientsError;

      // Get unique client IDs with active loans
      const uniqueClientIds = [
        ...new Set(activeClientsData.map((loan) => loan.client_id)),
      ];
      const activeClients = uniqueClientIds.length;

      // Count new clients this month
      const newClientsThisMonth = clientsData.filter((client) => {
        const clientDate = new Date(client.created_at);
        return clientDate >= new Date(firstDayOfMonth);
      }).length;

      // 3. Get upcoming payments count (due within the next 7 days)
      const { data: upcomingPaymentsData, error: upcomingPaymentsError } =
        await supabase
          .from('loans')
          .select('id, payment_date')
          .eq('status', 'active');

      if (upcomingPaymentsError) throw upcomingPaymentsError;

      // Count loans with payments due in the next 7 days
      const upcomingPayments = upcomingPaymentsData.filter((loan) => {
        const paymentDate = new Date(loan.payment_date);
        return paymentDate <= oneWeekFromNow && paymentDate >= now;
      }).length;

      // 4. Get monthly income (sum of payments received this month)
      const { data: currentMonthPayments, error: paymentsError } =
        await supabase
          .from('payments')
          .select('amount')
          .eq('status', 'completed')
          .gte('created_at', firstDayOfMonth);

      if (paymentsError) throw paymentsError;

      const monthlyIncome = currentMonthPayments.reduce(
        (sum, payment) => sum + parseFloat(payment.amount),
        0
      );

      // Get previous month's income for comparison
      const { data: previousMonthPayments } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'completed')
        .gte('created_at', firstDayOfPreviousMonth)
        .lt('created_at', firstDayOfMonth);

      const previousMonthIncome =
        previousMonthPayments?.reduce(
          (sum, payment) => sum + parseFloat(payment.amount),
          0
        ) || 0;

      // Calculate percentage change in monthly income
      const monthlyIncomeChange =
        previousMonthIncome > 0
          ? ((monthlyIncome - previousMonthIncome) / previousMonthIncome) * 100
          : 0;

      // 5. Get monthly loaned amount (sum of loan amounts created this month)
      const { data: currentMonthLoans, error: currentMonthLoansError } =
        await supabase
          .from('loans')
          .select('amount')
          .gte('created_at', firstDayOfMonth);

      if (currentMonthLoansError) throw currentMonthLoansError;

      const monthlyLoanedAmount = currentMonthLoans.reduce(
        (sum, loan) => sum + parseFloat(loan.amount),
        0
      );

      // Get previous month's loaned amount for comparison
      const { data: previousMonthLoanedData, error: previousMonthLoansError } =
        await supabase
          .from('loans')
          .select('amount')
          .gte('created_at', firstDayOfPreviousMonth)
          .lt('created_at', firstDayOfMonth);

      if (previousMonthLoansError) throw previousMonthLoansError;

      const previousMonthLoanedAmount = previousMonthLoanedData.reduce(
        (sum, loan) => sum + parseFloat(loan.amount),
        0
      );

      // Calculate percentage change in monthly loaned amount
      const monthlyLoanedAmountChange =
        previousMonthLoanedAmount > 0
          ? ((monthlyLoanedAmount - previousMonthLoanedAmount) /
              previousMonthLoanedAmount) *
            100
          : 0;

      setStats({
        totalOutstanding,
        activeClients,
        newClientsThisMonth,
        upcomingPayments,
        monthlyIncome,
        monthlyIncomeChange,
        outstandingChange,
        monthlyLoanedAmount,
        monthlyLoanedAmountChange,
      });
    } catch (err: any) {
      console.error('Error fetching stats:', err);
      setError(err.message || 'Error al cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refetch: fetchStats };
}
