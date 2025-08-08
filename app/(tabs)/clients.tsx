import { View, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import ClientList from '@/components/clients/client-list';
import { Plus } from 'lucide-react-native';
import CustomSafeScreen from '@/components/ui/custom-safe-screen';
import ToggleButton from '@/components/home/toggle-button';
import { useSidebar } from '@/hooks/use-sidebar';

export default function Clients() {
  const router = useRouter();
  const isOpen = useSidebar(state => state.isOpen);

  return (
    <CustomSafeScreen>
      <View className="flex-row justify-between items-center px-4 py-6 bg-white border-b border-gray-200">
        {!isOpen && <ToggleButton />}
        <Text className="text-2xl font-geist-bold">Clientes</Text>
        <TouchableOpacity
          className="flex-row items-center gap-1 bg-black px-4 py-2 rounded-full"
          onPress={() => router.push('/new-client')}
        >
          <Text className="text-white font-geist-medium">Añadir cliente</Text>
          <Plus size={18} color="white" />
        </TouchableOpacity>
      </View>
      <ClientList />
    </CustomSafeScreen>
  );
}
