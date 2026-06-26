import { Tabs } from 'expo-router';
import { theme } from '@shared/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@features/auth/store/useAuthStore';

export default function AppLayout() {
  const insets = useSafeAreaInsets();
  const { userProfile } = useAuthStore();
  const isAdmin = userProfile?.rol === 'ADMIN' || userProfile?.rol === 'SUPERADMIN';
  const isSuperAdmin = userProfile?.rol === 'SUPERADMIN';

  const tabBarStyle = {
    backgroundColor: '#0B202E',
    borderTopWidth: 0,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
    height: 65 + insets.bottom,
    paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
    paddingTop: 10,
  };

  const screenOptions = {
    headerShown: false,
    tabBarStyle,
    tabBarActiveTintColor: '#EFBC75', // theme.colors.accent
    tabBarInactiveTintColor: 'rgba(255,255,255,0.3)',
    tabBarLabelStyle: { fontSize: 11, fontWeight: '700' as const, marginTop: 4 },
  };

  if (isAdmin) {
    return (
      <Tabs screenOptions={screenOptions}>
        <Tabs.Screen
          name="admin-kpis"
          options={{
            title: 'KPIs',
            tabBarIcon: ({ color }) => <Ionicons name="analytics" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="admin-insights"
          options={{
            title: 'Insights',
            tabBarIcon: ({ color }) => <Ionicons name="bulb" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="admin-export"
          options={{
            title: 'Exportar',
            tabBarIcon: ({ color }) => <Ionicons name="download" size={24} color={color} />,
          }}
        />
        {isSuperAdmin && (
          <Tabs.Screen
            name="admin-users"
            options={{
              title: 'Usuarios',
              tabBarIcon: ({ color }) => <Ionicons name="people" size={24} color={color} />,
            }}
          />
        )}

        {/* Ocultar todas las pantallas de estudiante */}
        <Tabs.Screen name="home" options={{ href: null }} />
        <Tabs.Screen name="movements" options={{ href: null }} />
        <Tabs.Screen name="budgets" options={{ href: null }} />
        <Tabs.Screen name="goals" options={{ href: null }} />
        <Tabs.Screen name="groups" options={{ href: null }} />
        <Tabs.Screen name="admin" options={{ href: null }} />
        <Tabs.Screen name="add-movement" options={{ href: null }} />
        <Tabs.Screen name="edit-movement" options={{ href: null }} />
        <Tabs.Screen name="add-budget" options={{ href: null }} />
        <Tabs.Screen name="add-goal" options={{ href: null }} />
        <Tabs.Screen name="group-detail" options={{ href: null }} />
        <Tabs.Screen name="group-requests" options={{ href: null }} />
        <Tabs.Screen name="alerts" options={{ href: null }} />
        {!isSuperAdmin && (
          <Tabs.Screen name="admin-users" options={{ href: null }} />
        )}
      </Tabs>
    );
  }

  // Layout para ESTUDIANTES
  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="movements"
        options={{
          title: 'Movimientos',
          tabBarIcon: ({ color }) => <Ionicons name="list" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="budgets"
        options={{
          title: 'Presupuesto',
          tabBarIcon: ({ color }) => <Ionicons name="pie-chart" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: 'Metas',
          tabBarIcon: ({ color }) => <Ionicons name="flag" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: 'Grupos',
          tabBarIcon: ({ color }) => <Ionicons name="people" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="group-requests"
        options={{
          title: 'Solicitudes',
          tabBarIcon: ({ color }) => <Ionicons name="notifications" size={24} color={color} />,
        }}
      />
      {/* Pantallas ocultas del tab bar */}
      <Tabs.Screen name="add-movement" options={{ href: null }} />
      <Tabs.Screen name="add-budget" options={{ href: null }} />
      <Tabs.Screen name="add-goal" options={{ href: null }} />
      <Tabs.Screen name="group-detail" options={{ href: null }} />
      <Tabs.Screen name="alerts" options={{ href: null }} />
      <Tabs.Screen name="admin" options={{ href: null }} />
      <Tabs.Screen name="admin-kpis" options={{ href: null }} />
      <Tabs.Screen name="admin-insights" options={{ href: null }} />
      <Tabs.Screen name="admin-export" options={{ href: null }} />
      <Tabs.Screen name="admin-users" options={{ href: null }} />
    </Tabs>
  );
}
