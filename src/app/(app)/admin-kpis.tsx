import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { theme } from '@shared/theme';
import { useAuthStore } from '@features/auth/store/useAuthStore';

import { useAdminKpis } from '@features/admin/hooks/useAdminKpis';
import { UsersKpis } from '@features/admin/components/UsersKpis';
import { TopFeatures } from '@features/admin/components/TopFeatures';
import { FinancialHealth } from '@features/admin/components/FinancialHealth';
import { TopCategoriesChart } from '@features/admin/components/TopCategoriesChart';

export default function AdminKpisScreen() {
  const { userProfile } = useAuthStore();
  const { biz, fin, loading } = useAdminKpis();

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={theme.colors.secondary} /></View>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingTop: 50, paddingBottom: 60 }}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Panel de Control</Text>
          <Text style={{ color: theme.colors.secondary, fontWeight: '700', marginBottom: 20 }}>Hola, {userProfile?.nombre || 'Administrador'}</Text>
        </View>
      </View>

      <UsersKpis biz={biz} />
      
      <TopFeatures biz={biz} />

      <FinancialHealth fin={fin} />

      <TopCategoriesChart fin={fin} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.primary },
  center: { flex: 1, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 26, fontWeight: '800', color: theme.colors.white, marginTop: 8, marginBottom: 4 },
});
