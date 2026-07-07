import React from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView, StatusBar } from 'react-native';
import { useAuthStore } from '@features/auth/store/useAuthStore';
import { theme } from '@shared/theme';
import { LinearGradient } from 'expo-linear-gradient';

import { useDashboardData } from '@features/analytics/hooks/useDashboardData';
import { DashboardHeader } from '@features/analytics/components/DashboardHeader';
import { BalanceCard } from '@features/analytics/components/BalanceCard';
import { QuickActions } from '@features/analytics/components/QuickActions';
import { WidgetsGrid } from '@features/analytics/components/WidgetsGrid';
import { PredictionCard } from '@features/analytics/components/PredictionCard';
import { AlertsSection } from '@features/analytics/components/AlertsSection';
import { WallyBotCard } from '@features/analytics/components/WallyBotCard';

export default function HomeScreen() {
  const { signOut, userProfile } = useAuthStore();
  const {
    dashboard,
    dailyLimit,
    prediction,
    score,
    alerts,
    aiRecommendations,
    aiLoading,
    loading,
    refreshAiRecommendations,
  } = useDashboardData();

  const showWallyBot = score && score.puntaje_financiero < 70;

  if (loading && !dashboard) {
    return (
      <LinearGradient colors={[theme.colors.primary, '#0B202E', theme.colors.petroleum]} style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#0B202E', theme.colors.primary, theme.colors.petroleum]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Círculo decorativo */}
      <View style={styles.decorativeCircle} />

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        <DashboardHeader
          userName={userProfile?.nombre || 'Estudiante'}
          alertsCount={alerts.length}
          onSignOut={signOut}
        />

        <BalanceCard
          saldoDisponible={dashboard?.saldoDisponible}
          ingresoFijo={dashboard?.ingreso_mensual_fijo}
          totalGastos={dashboard?.totalGastos}
        />

        <QuickActions />

        <WidgetsGrid
          dailyLimit={dailyLimit}
          score={score}
        />

        {/* WallyBot — aparece solo cuando el score es bajo */}
        {showWallyBot && (
          <WallyBotCard
            recommendations={aiRecommendations}
            loading={aiLoading}
            onRefresh={refreshAiRecommendations}
          />
        )}

        <PredictionCard
          prediction={prediction}
        />

        <AlertsSection
          alerts={alerts}
        />

      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  decorativeCircle: { position: 'absolute', width: 400, height: 400, borderRadius: 200, backgroundColor: 'rgba(32, 138, 239, 0.08)', top: -100, right: -150 },
});
