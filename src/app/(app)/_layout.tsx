import { Tabs } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { theme } from '@shared/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@features/auth/store/useAuthStore';
import { TouchableOpacity } from 'react-native';

export default function AppLayout() {
  const insets = useSafeAreaInsets();
  const { userProfile, signOut } = useAuthStore();
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
      <Drawer screenOptions={{
        headerStyle: { backgroundColor: '#0B202E' },
        headerTintColor: theme.colors.white,
        drawerStyle: { backgroundColor: '#0B202E' },
        drawerActiveTintColor: theme.colors.accent,
        drawerInactiveTintColor: 'rgba(255,255,255,0.6)',
        headerRight: () => (
          <TouchableOpacity onPress={signOut} style={{ marginRight: 15 }}>
            <Ionicons name="log-out" size={24} color={theme.colors.white} />
          </TouchableOpacity>
        )
      }}>
        <Drawer.Screen
          name="admin-kpis"
          options={{
            title: 'KPIs Generales',
            drawerIcon: ({ color }) => <Ionicons name="analytics" size={24} color={color} />,
          }}
        />
        <Drawer.Screen
          name="admin-insights"
          options={{
            title: 'Insights',
            drawerIcon: ({ color }) => <Ionicons name="bulb" size={24} color={color} />,
          }}
        />
        <Drawer.Screen
          name="admin-export"
          options={{
            title: 'Exportar Datos',
            drawerIcon: ({ color }) => <Ionicons name="download" size={24} color={color} />,
          }}
        />
        <Drawer.Screen
          name="admin-users"
          options={{
            title: 'Gestión Usuarios',
            drawerItemStyle: { display: isSuperAdmin ? 'flex' : 'none' },
            drawerIcon: ({ color }) => <Ionicons name="people" size={24} color={color} />,
          }}
        />

        {/* Ocultar screens de estudiantes del drawer */}
        <Drawer.Screen name="home" options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="movements" options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="budgets" options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="goals" options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="groups" options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="add-movement" options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="add-budget" options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="add-goal" options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="alerts" options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="profile" options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="group-detail" options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="group-requests" options={{ drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="admin-alerts" options={{ drawerItemStyle: { display: 'none' } }} />
      </Drawer>
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
      <Tabs.Screen name="profile" options={{ href: null }} />
      <Tabs.Screen name="admin" options={{ href: null }} />
      <Tabs.Screen name="admin-kpis" options={{ href: null }} />
      <Tabs.Screen name="admin-insights" options={{ href: null }} />
      <Tabs.Screen name="admin-export" options={{ href: null }} />
      <Tabs.Screen name="admin-users" options={{ href: null }} />
      <Tabs.Screen name="admin-alerts" options={{ href: null }} />
    </Tabs>
  );
}
