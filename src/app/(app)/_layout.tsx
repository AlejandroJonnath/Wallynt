import { Drawer } from 'expo-router/drawer';
import { theme } from '@shared/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@features/auth/store/useAuthStore';
import { TouchableOpacity } from 'react-native';

export default function AppLayout() {
  const { userProfile, signOut } = useAuthStore();
  const isAdmin = userProfile?.rol === 'ADMIN' || userProfile?.rol === 'SUPERADMIN';
  const isSuperAdmin = userProfile?.rol === 'SUPERADMIN';

  const drawerScreenOptions = {
    headerStyle: { backgroundColor: '#0B202E' },
    headerTintColor: theme.colors.white,
    drawerStyle: { backgroundColor: '#0B202E' },
    drawerActiveTintColor: theme.colors.accent,
    drawerInactiveTintColor: 'rgba(255,255,255,0.6)',
    headerRight: () => (
      <TouchableOpacity onPress={signOut} style={{ marginRight: 15 }}>
        <Ionicons name="log-out" size={24} color={theme.colors.white} />
      </TouchableOpacity>
    ),
  };

  if (isAdmin) {
    return (
      <Drawer screenOptions={drawerScreenOptions}>
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
        <Drawer.Screen name="admin" options={{ drawerItemStyle: { display: 'none' } }} />
      </Drawer>
    );
  }

  // Layout para ESTUDIANTES con Drawer
  return (
    <Drawer screenOptions={drawerScreenOptions}>
      <Drawer.Screen
        name="home"
        options={{
          title: 'Inicio',
          drawerIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="movements"
        options={{
          title: 'Movimientos',
          drawerIcon: ({ color }) => <Ionicons name="list" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="budgets"
        options={{
          title: 'Presupuesto',
          drawerIcon: ({ color }) => <Ionicons name="pie-chart" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="goals"
        options={{
          title: 'Metas',
          drawerIcon: ({ color }) => <Ionicons name="flag" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="groups"
        options={{
          title: 'Grupos',
          drawerIcon: ({ color }) => <Ionicons name="people" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="group-requests"
        options={{
          title: 'Solicitudes',
          drawerIcon: ({ color }) => <Ionicons name="notifications" size={24} color={color} />,
        }}
      />

      {/* Pantallas ocultas del drawer para estudiantes */}
      <Drawer.Screen name="add-movement" options={{ drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="add-budget" options={{ drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="add-goal" options={{ drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="group-detail" options={{ drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="alerts" options={{ drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="profile" options={{ drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="admin" options={{ drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="admin-kpis" options={{ drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="admin-insights" options={{ drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="admin-export" options={{ drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="admin-users" options={{ drawerItemStyle: { display: 'none' } }} />
    </Drawer>
  );
}
