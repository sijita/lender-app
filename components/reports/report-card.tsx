import { Download } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

export default function ReportCard({
  title,
  subtitle,
  icon,
  loading,
  onDownload,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  loading?: boolean;
  onDownload: () => void;
}) {
  return (
    <View className="bg-white rounded-xl p-5 border border-gray-100">
      <View className="flex-row justify-between items-start">
        <View>
          <Text className="text-lg font-geist-semibold">{title}</Text>
          <Text className="text-sm text-gray-500">{subtitle}</Text>
        </View>
        {icon}
      </View>
      {loading ? (
        <View className="h-32 flex items-center justify-center">
          <Text className="text-gray-400">Cargando datos...</Text>
        </View>
      ) : (
        <View className="h-5 flex items-center justify-center">
          {/* Aquí se mostrarían gráficos en una implementación completa */}
        </View>
      )}

      <TouchableOpacity
        className="bg-black p-4 rounded-xl flex-row items-center justify-center gap-2"
        onPress={onDownload}
      >
        <Text className="text-white font-geist-medium">Descargar</Text>
        <Download size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
