import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '@features/auth/store/useAuthStore';
import { ToastProvider } from '@shared/components/Toast';
import * as SplashScreen from 'expo-splash-screen';

// Mantener el splash visible hasta que la app esté lista
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { session, userProfile, isLoading, checkSession } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    checkSession();
  }, []);

  // Ocultar el splash cuando ya sabemos el estado de autenticación
  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) return;
    if (!rootNavigationState?.key) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inAppGroup = segments[0] === '(app)';

    if (!session) {
      if (!inAuthGroup) router.replace('/(auth)/login');
    } else {
      if (!inAppGroup) {
        if (segments[1] !== 'financial-profile' && segments[1] !== 'register') {
          if (userProfile && (userProfile.rol === 'ADMIN' || userProfile.rol === 'SUPERADMIN')) {
            router.replace('/(app)/admin-kpis');
          } else {
            router.replace('/(app)/home');
          }
        }
      } else {
        if (userProfile && (userProfile.rol === 'ADMIN' || userProfile.rol === 'SUPERADMIN')) {
          const isAdminRoute = segments[1]?.startsWith('admin');
          if (!isAdminRoute) {
            router.replace('/(app)/admin-kpis');
          }
        }
      }
    }
  }, [session, userProfile, isLoading, segments, rootNavigationState?.key]);

  return (
    <ToastProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </ToastProvider>
  );
}
