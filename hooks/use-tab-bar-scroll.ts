import { useCallback } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useNavigation } from 'expo-router';

export function useTabBarScroll() {
  const navigation = useNavigation();

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const velocity = event.nativeEvent.velocity?.y ?? 0;

      if (velocity > 0 && offsetY > 50) {
        // Ocultar la barra de tabs cuando se desplaza hacia abajo
        navigation.setOptions({
          tabBarStyle: {
            display: 'none',
          },
        });
      } else {
        // Mostrar la barra de tabs cuando se desplaza hacia arriba o está en la parte superior
        navigation.setOptions({
          tabBarStyle: {
            display: 'flex',
            backgroundColor: '#000',
            borderRadius: 50,
            marginHorizontal: 20,
            marginBottom: 35,
            height: 50,
            position: 'absolute',
            overflow: 'hidden',
          },
        });
      }
    },
    [navigation]
  );

  return { handleScroll };
}
