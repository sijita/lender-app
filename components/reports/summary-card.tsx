import { formatCurrency } from '@/utils';
import { Download } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

export default function SummaryCard({
  reportData,
  loading,
  handleDownloadReport,
}: {
  reportData: any;
  loading: boolean;
  handleDownloadReport: () => void;
}) {
  return (
    <View className="flex-col gap-6 bg-white rounded-xl p-5 border border-gray-100">
      <Text className="text-xl font-geist-bold">Resumen financiero</Text>
      {loading ? (
        <View className="flex items-center justify-center py-4">
          <Text className="text-gray-400">Cargando datos...</Text>
        </View>
      ) : reportData ? (
        <View className="flex-col gap-3">
          <View className="flex-row gap-1 justify-between items-center flex-wrap">
            <View className="flex-col gap-5">
              <View className="flex-col gap-1 items-start">
                <Text className="text-gray-500 font-geist-medium text-lg">
                  Total Pendiente
                </Text>
                <Text className="text-xl font-geist-bold">
                  {formatCurrency(reportData.summary.totalOutstanding)}
                </Text>
              </View>
              <View className="flex-col gap-1 items-start">
                <Text className="text-gray-500 font-geist-medium text-lg">
                  Total cobrado
                </Text>
                <Text className="text-green-500 text-xl font-geist-bold">
                  {formatCurrency(reportData.summary.totalCollected)}
                </Text>
              </View>
            </View>
            <View className="flex-col gap-5">
              <View className="flex-col gap-1 items-start">
                <Text className="text-gray-500 font-geist-medium text-lg">
                  Préstamos nuevos
                </Text>
                <Text className="text-xl font-geist-bold">
                  {formatCurrency(reportData.summary.newLoans)}
                </Text>
              </View>
              <View className="flex-col gap-1 items-start">
                <Text className="text-gray-500 font-geist-medium text-lg">
                  Interés Ganado
                </Text>
                <Text className="text-green-500 text-xl font-geist-bold">
                  {formatCurrency(reportData.summary.interestEarned)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      ) : null}
      <TouchableOpacity
        className="flex-row items-center gap-2 justify-center bg-black py-3 rounded-xl"
        onPress={handleDownloadReport}
      >
        <Text className="font-geist-medium text-white">
          Descargar reporte completo
        </Text>
        <Download size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
