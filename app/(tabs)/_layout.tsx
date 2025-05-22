import { Link, Tabs, usePathname } from 'expo-router';
import { View, TouchableOpacity } from 'react-native';
import TabIcon from '@/components/home/tab-icon';
import { useSidebar } from '@/hooks/use-sidebar';
import ToggleButton from '@/components/home/toggle-button';

const _layout = () => {
  const pathname = usePathname();
  const isWeb = useSidebar((state) => state.isWeb);
  const sidebarVisible = useSidebar((state) => state.isOpen);
  const toggleSidebar = useSidebar((state) => state.toggle);

  return (
    <View style={{ flex: 1, flexDirection: isWeb ? 'row' : 'column' }}>
      {isWeb && sidebarVisible && (
        <View className="flex-col gap-5 w-[250px] h-full bg-white p-3 pt-5 border-r border-gray-200">
          <ToggleButton />
          {['index', 'clients', 'transactions', 'reports'].map((screen) => (
            <Link
              key={screen}
              href={`/${screen === 'index' ? '' : screen}`}
              className="hover:bg-gray-100 rounded-lg"
              asChild
            >
              <TouchableOpacity
                onPress={() => {
                  toggleSidebar();
                }}
              >
                <TabIcon
                  focused={
                    pathname === `/${screen}` ||
                    (pathname === '/' && screen === 'index')
                  }
                  icon={
                    getIconForScreen(screen) as
                      | 'House'
                      | 'UserRound'
                      | 'ArrowUpDown'
                      | 'ChartNoAxesColumn'
                  }
                  title={getTitleForScreen(screen)}
                  isWeb={true}
                />
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            tabBarShowLabel: false,
            tabBarItemStyle: {
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            },
            tabBarStyle: isWeb
              ? {
                  display: 'none',
                }
              : {
                  backgroundColor: '#FAFAFA',
                  borderRadius: 50,
                  marginHorizontal: 20,
                  marginBottom: 35,
                  height: 50,
                  position: 'absolute',
                  overflow: 'hidden',
                },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Inicio',
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <TabIcon focused={focused} icon="House" title="Inicio" />
              ),
            }}
          />
          <Tabs.Screen
            name="clients"
            options={{
              title: 'Clientes',
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <TabIcon focused={focused} icon="UserRound" title="Clientes" />
              ),
            }}
          />
          <Tabs.Screen
            name="transactions"
            options={{
              title: 'Transacciones',
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <TabIcon
                  focused={focused}
                  icon="ArrowUpDown"
                  title="Transacciones"
                />
              ),
            }}
          />
          <Tabs.Screen
            name="reports"
            options={{
              title: 'Reportes',
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <TabIcon
                  focused={focused}
                  icon="ChartNoAxesColumn"
                  title="Reportes"
                />
              ),
            }}
          />
        </Tabs>
      </View>
    </View>
  );
};

// Función auxiliar para obtener el icono según la pantalla
function getIconForScreen(screen: string) {
  switch (screen) {
    case 'index':
      return 'House';
    case 'clients':
      return 'UserRound';
    case 'transactions':
      return 'ArrowUpDown';
    case 'reports':
      return 'ChartNoAxesColumn';
    default:
      return 'Home';
  }
}

// Función auxiliar para obtener el título según la pantalla
function getTitleForScreen(screen: string) {
  switch (screen) {
    case 'index':
      return 'Inicio';
    case 'clients':
      return 'Clientes';
    case 'transactions':
      return 'Transacciones';
    case 'reports':
      return 'Reportes';
    default:
      return '';
  }
}

export default _layout;
