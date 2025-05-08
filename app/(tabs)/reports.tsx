import { Text, View } from 'react-native';
import PeriodSelector from '@/components/reports/period-selector';
import { BarChart3, PieChart, LineChart } from 'lucide-react-native';
import ReportCard from '@/components/reports/report-card';
import SummaryCard from '@/components/reports/summary-card';
import useReports from '@/hooks/use-reports';
import CustomSafeScreen from '@/components/ui/custom-safe-screen';

const Reports = () => {
  const { loading, reportData, handlePeriodChange, handleDownloadReport } =
    useReports();

  return (
    <CustomSafeScreen>
      <View className="flex-row justify-between items-center px-4 py-6 bg-white border-b border-gray-200">
        <Text className="text-2xl font-geist-bold">Reportes</Text>
      </View>
      <View className="flex-col gap-5 p-5">
        <SummaryCard
          reportData={reportData}
          loading={loading}
          handleDownloadReport={handleDownloadReport}
        />
        <PeriodSelector onPeriodChange={handlePeriodChange} />
        <ReportCard
          title="Resumen de Ingresos"
          subtitle="Ingresos mensuales por pagos"
          icon={<BarChart3 size={24} color="#6366F1" />}
          loading={loading}
          onDownload={handleDownloadReport}
        />
        <ReportCard
          title="Préstamos Pendientes"
          subtitle="Total pendiente por cliente"
          icon={<PieChart size={24} color="#F59E0B" />}
          loading={loading}
          onDownload={handleDownloadReport}
        />
        <ReportCard
          title="Tendencias de Pago"
          subtitle="Historial de pagos por tiempo"
          icon={<LineChart size={24} color="#10B981" />}
          loading={loading}
          onDownload={handleDownloadReport}
        />
      </View>
    </CustomSafeScreen>
  );
};

export default Reports;
