import { Text, View } from 'react-native';
import PeriodSelector from '@/components/reports/period-selector';
import { BarChart3, PieChart, LineChart } from 'lucide-react-native';
import ReportCard from '@/components/reports/report-card';
import SummaryCard from '@/components/reports/summary-card';
import useReports from '@/hooks/use-reports';
import CustomSafeScreen from '@/components/ui/custom-safe-screen';
import { useSidebar } from '@/hooks/use-sidebar';
import ToggleButton from '@/components/home/toggle-button';

const Reports = () => {
  const { loading, reportData, handlePeriodChange, handleDownloadReport } =
    useReports();
  const isOpen = useSidebar((state) => state.isOpen);

  return (
    <CustomSafeScreen>
      <View className="flex-row items-center px-4 py-6 bg-white border-b border-gray-200">
        {!isOpen && <ToggleButton />}
        <View className="flex-1 items-center justify-center">
          <Text className="text-2xl font-geist-bold">Reportes</Text>
        </View>
      </View>
      <View className="flex-col gap-5 p-5">
        <SummaryCard
          reportData={reportData}
          loading={loading}
          handleDownloadReport={handleDownloadReport}
        />
        <PeriodSelector onPeriodChange={handlePeriodChange} />
        <ReportCard
          title="Resumen de ingresos"
          subtitle="Ingresos mensuales por pagos"
          icon={<BarChart3 size={24} color="#6366F1" />}
          loading={loading}
          onDownload={handleDownloadReport}
        />
        <ReportCard
          title="Préstamos pendientes"
          subtitle="Total pendiente por cliente"
          icon={<PieChart size={24} color="#F59E0B" />}
          loading={loading}
          onDownload={handleDownloadReport}
        />
        <ReportCard
          title="Tendencias de pago"
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
