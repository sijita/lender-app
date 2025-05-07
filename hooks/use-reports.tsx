import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/toast-context';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

interface ReportData {
  incomeData: {
    total: number;
    byMonth: { month: string; amount: number }[];
  };
  outstandingLoans: {
    total: number;
    byClient: { client: string; amount: number }[];
  };
  paymentTrends: {
    onTime: number;
    late: number;
    missed: number;
  };
  summary: {
    totalOutstanding: number;
    totalCollected: number;
    newLoans: number;
    interestEarned: number;
  };
}

interface DateRange {
  startDate: Date;
  endDate: Date;
}

export default function useReports() {
  const { showToast } = useToast();
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(),
  });
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);

      // Formatear fechas para consultas
      const startDateStr = dateRange.startDate.toISOString();
      const endDateStr = dateRange.endDate.toISOString();

      // 1. Obtener datos de ingresos
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('amount, created_at')
        .eq('status', 'completed')
        .gte('created_at', startDateStr)
        .lte('created_at', endDateStr);

      if (paymentsError) throw paymentsError;

      // 2. Obtener préstamos pendientes
      const { data: loansData, error: loansError } = await supabase
        .from('loans')
        .select('outstanding, client_id, clients(name, last_name)')
        .eq('status', 'active')
        .gte('created_at', startDateStr)
        .lte('created_at', endDateStr);

      if (loansError) throw loansError;

      // 3. Obtener tendencias de pago
      const { data: paymentStatusData, error: statusError } = await supabase
        .from('payments')
        .select('status')
        .gte('created_at', startDateStr)
        .lte('created_at', endDateStr);

      if (statusError) throw statusError;

      // 4. Obtener nuevos préstamos
      const { data: newLoansData, error: newLoansError } = await supabase
        .from('loans')
        .select('amount')
        .gte('created_at', startDateStr)
        .lte('created_at', endDateStr);

      if (newLoansError) throw newLoansError;

      // Procesar datos para el reporte
      const totalIncome = paymentsData.reduce(
        (sum, payment) => sum + parseFloat(payment.amount),
        0
      );

      // Agrupar pagos por mes
      const incomeByMonth = paymentsData.reduce((acc, payment) => {
        const date = new Date(payment.created_at);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

        if (!acc[monthYear]) {
          acc[monthYear] = 0;
        }
        acc[monthYear] += parseFloat(payment.amount);
        return acc;
      }, {} as Record<string, number>);

      // Agrupar préstamos por cliente
      const loansByClient = loansData.reduce((acc, loan) => {
        const clientName = `${loan.clients?.name} ${loan.clients?.last_name}`;
        if (!acc[clientName]) {
          acc[clientName] = 0;
        }
        acc[clientName] += parseFloat(loan.outstanding);
        return acc;
      }, {} as Record<string, number>);

      // Calcular tendencias de pago
      const onTimePayments = paymentStatusData.filter(
        (p) => p.status === 'completed'
      ).length;
      const latePayments = paymentStatusData.filter(
        (p) => p.status === 'late'
      ).length;
      const missedPayments = paymentStatusData.filter(
        (p) => p.status === 'missed'
      ).length;

      // Calcular total de nuevos préstamos
      const totalNewLoans = newLoansData.reduce(
        (sum, loan) => sum + parseFloat(loan.amount),
        0
      );

      // Calcular interés ganado (estimado como 20% del total de pagos)
      const interestEarned = totalIncome * 0.2;

      // Preparar datos para el reporte
      setReportData({
        incomeData: {
          total: totalIncome,
          byMonth: Object.entries(incomeByMonth).map(([month, amount]) => ({
            month,
            amount,
          })),
        },
        outstandingLoans: {
          total: loansData.reduce(
            (sum, loan) => sum + parseFloat(loan.outstanding),
            0
          ),
          byClient: Object.entries(loansByClient).map(([client, amount]) => ({
            client,
            amount,
          })),
        },
        paymentTrends: {
          onTime: onTimePayments,
          late: latePayments,
          missed: missedPayments,
        },
        summary: {
          totalOutstanding: loansData.reduce(
            (sum, loan) => sum + parseFloat(loan.outstanding),
            0
          ),
          totalCollected: totalIncome,
          newLoans: totalNewLoans,
          interestEarned,
        },
      });
    } catch (error: any) {
      console.error('Error fetching report data:', error);
      showToast({
        message: 'Error al cargar los datos del reporte',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (range: DateRange) => {
    setDateRange(range);
  };

  const handleDownloadReport = async () => {
    try {
      if (!reportData) return;

      // Crear contenido CSV
      let csvContent = 'Reporte de Préstamos\n';
      csvContent += `Período: ${dateRange.startDate.toLocaleDateString()} - ${dateRange.endDate.toLocaleDateString()}\n\n`;

      // Sección de resumen
      csvContent += 'RESUMEN FINANCIERO\n';
      csvContent += `Total Pendiente,${reportData.summary.totalOutstanding}\n`;
      csvContent += `Total Cobrado,${reportData.summary.totalCollected}\n`;
      csvContent += `Nuevos Préstamos,${reportData.summary.newLoans}\n`;
      csvContent += `Interés Ganado,${reportData.summary.interestEarned}\n\n`;

      // Sección de préstamos pendientes por cliente
      csvContent += 'PRÉSTAMOS PENDIENTES POR CLIENTE\n';
      csvContent += 'Cliente,Monto Pendiente\n';
      reportData.outstandingLoans.byClient.forEach((item) => {
        csvContent += `${item.client},${item.amount}\n`;
      });
      csvContent += '\n';

      // Sección de ingresos por mes
      csvContent += 'INGRESOS POR MES\n';
      csvContent += 'Mes,Monto\n';
      reportData.incomeData.byMonth.forEach((item) => {
        csvContent += `${item.month},${item.amount}\n`;
      });
      csvContent += '\n';

      // Sección de tendencias de pago
      csvContent += 'TENDENCIAS DE PAGO\n';
      csvContent += `A tiempo,${reportData.paymentTrends.onTime}\n`;
      csvContent += `Con retraso,${reportData.paymentTrends.late}\n`;
      csvContent += `Perdidos,${reportData.paymentTrends.missed}\n`;

      // Generar nombre de archivo con fecha
      const date = new Date();
      const fileName = `reporte_prestamos_${date.getFullYear()}${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}.csv`;

      // Ruta del archivo en el dispositivo
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      // Escribir archivo
      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Compartir archivo
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: 'Descargar Reporte',
      });

      showToast({
        message: 'Reporte descargado correctamente',
        type: 'success',
      });
    } catch (error) {
      console.error('Error downloading report:', error);
      showToast({
        message: 'Error al descargar el reporte',
        type: 'error',
      });
    }
  };

  return {
    dateRange,
    loading,
    reportData,
    handlePeriodChange,
    handleDownloadReport,
  };
}
