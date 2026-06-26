import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { ToastProvider } from '../components/CustomToast';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { session, userProfile, isLoading, checkSession } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inAppGroup = segments[0] === '(app)';

    if (!session) {
      if (!inAuthGroup) router.replace('/(auth)/login');
    } else {
      if (!inAppGroup) {
        // Evitar que interrumpa el flujo si está en registro o llenando el perfil
        if (segments[1] !== 'financial-profile' && segments[1] !== 'register') {
          if (userProfile && (userProfile.rol === 'ADMIN' || userProfile.rol === 'SUPERADMIN')) {
            router.replace('/(app)/admin-kpis');
          } else {
            router.replace('/(app)/home');
          }
        }
      } else {
        // Si ya está en (app) pero no es admin e intenta ir a admin, o si es admin e intenta ir a home
        if (userProfile && (userProfile.rol === 'ADMIN' || userProfile.rol === 'SUPERADMIN')) {
          const isAdminRoute = segments[1]?.startsWith('admin');
          if (!isAdminRoute) {
            router.replace('/(app)/admin-kpis');
          }
        }
      }
    }
  }, [session, userProfile, isLoading, segments]);

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

