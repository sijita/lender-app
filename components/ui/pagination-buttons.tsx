import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

export default function PaginationButtons({
  page,
  setPage,
  totalClients,
  pageSize,
}: {
  page: number;
  setPage: (page: number) => void;
  totalClients: number;
  pageSize: number;
}) {
  return (
    <View className="flex-row justify-between items-center mt-4">
      <TouchableOpacity
        className="flex flex-row items-center gap-1 p-3 bg-black rounded-lg disabled:bg-gray-200"
        disabled={page === 1}
        onPress={() => setPage(page - 1)}
      >
        <ChevronLeft size={20} color="#fff" />
        <Text className="text-white">Anterior</Text>
      </TouchableOpacity>
      <Text className="text-gray-700">
        Página {page} de {Math.max(1, Math.ceil(totalClients / pageSize))}
      </Text>
      <TouchableOpacity
        className="flex flex-row items-center gap-1 p-3 bg-black rounded-lg disabled:bg-gray-200"
        disabled={page >= Math.ceil(totalClients / pageSize)}
        onPress={() => setPage(page + 1)}
      >
        <Text className="text-white">Siguiente</Text>
        <ChevronRight size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
