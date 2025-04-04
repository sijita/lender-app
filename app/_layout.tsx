import { Stack } from 'expo-router';
import './global.css';
import { Geist_100Thin } from 'expo-google-fonts-geist/100Thin';
import { Geist_200ExtraLight } from 'expo-google-fonts-geist/200ExtraLight';
import { Geist_300Light } from 'expo-google-fonts-geist/300Light';
import { Geist_400Regular } from 'expo-google-fonts-geist/400Regular';
import { Geist_500Medium } from 'expo-google-fonts-geist/500Medium';
import { Geist_600SemiBold } from 'expo-google-fonts-geist/600SemiBold';
import { Geist_700Bold } from 'expo-google-fonts-geist/700Bold';
import { Geist_800ExtraBold } from 'expo-google-fonts-geist/800ExtraBold';
import { Geist_900Black } from 'expo-google-fonts-geist/900Black';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { ToastProvider } from '../components/ui/toast-context';

export default function RootLayout() {
  const [loaded, error] = useFonts({
    GeistThin: Geist_100Thin,
    GeistExtraLight: Geist_200ExtraLight,
    GeistLight: Geist_300Light,
    GeistRegular: Geist_400Regular,
    GeistMedium: Geist_500Medium,
    GeistSemibold: Geist_600SemiBold,
    GeistBold: Geist_700Bold,
    GeistExtraBold: Geist_800ExtraBold,
    GeistBlack: Geist_900Black,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ToastProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ToastProvider>
  );
}
