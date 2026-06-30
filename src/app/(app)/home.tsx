import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, StatusBar, Image } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@features/auth/store/useAuthStore';
import { api } from '@core/api';
import { theme } from '@shared/theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const { signOut, userProfile } = useAuthStore();
  const router = useRouter();
  const [dashboard, setDashboard] = useState<any>(null);
  const [dailyLimit, setDailyLimit] = useState<any>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [score, setScore] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      setLoading(true);
      const [dashRes, limitRes, predRes, scoreRes, alertsRes] = await Promise.all([
        api.get('/analysis/dashboard'),
        api.get('/analysis/daily-limit'),
        api.get('/analysis/prediction'),
        api.get('/analysis/score'),
        api.get('/analysis/alerts'),
      ]);
      setDashboard(dashRes.data);
      setDailyLimit(limitRes.data);
      setPrediction(predRes.data);
      setScore(scoreRes.data);
      setAlerts(alertsRes.data || []);
    } catch (e) {
      console.log('Error fetching dashboard', e);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (puntaje: number) => {
    if (puntaje >= 90) return '#4CAF50';
    if (puntaje >= 50) return theme.colors.accent;
    return '#F44336';
  };

  const getScoreLabel = (puntaje: number) => {
    if (puntaje >= 90) return 'Excelente';
    if (puntaje >= 50) return 'Estable';
    return 'Riesgo financiero';
  };

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
        
        {/* Header Premium */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hola, {userProfile?.nombre?.split(' ')[0] || 'Estudiante'}</Text>
            <Text style={styles.title}>Tu Billetera</Text>
          </View>
          <View style={styles.headerActions}>
            {alerts.length > 0 && (
              <TouchableOpacity style={styles.alertBadge} onPress={() => router.push('/(app)/alerts')}>
                <Ionicons name="notifications" size={16} color="#fff" />
                <Text style={styles.alertBadgeText}>{alerts.length}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/(app)/profile')}>
              <Ionicons name="person-circle-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
              <Ionicons name="log-out-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tarjeta de saldo tipo Glassmorphism / Premium */}
        <LinearGradient
          colors={['rgba(32, 138, 239, 0.9)', 'rgba(15, 108, 108, 0.95)']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.balanceCard}
        >
          <View style={styles.balanceCardTop}>
            <Text style={styles.balanceLabel}>Saldo Disponible</Text>
            <Ionicons name="wallet" size={24} color="rgba(255,255,255,0.4)" />
          </View>
          <Text style={styles.balanceAmount}>${dashboard?.saldoDisponible?.toFixed(2) || '0.00'}</Text>
          
          <View style={styles.row}>
            <View style={styles.statBox}>
              <View style={styles.statIconRow}>
                <Ionicons name="arrow-down-circle" size={16} color="#4CAF50" />
                <Text style={styles.statLabel}>Ingreso Base</Text>
              </View>
              <Text style={styles.statValue}>+${dashboard?.ingreso_mensual_fijo?.toFixed(2) || '0.00'}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <View style={styles.statIconRow}>
                <Ionicons name="arrow-up-circle" size={16} color="#EFBC75" />
                <Text style={styles.statLabel}>Gastos</Text>
              </View>
              <Text style={styles.statValue}>-${dashboard?.totalGastos?.toFixed(2) || '0.00'}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Accesos rápidos (Quick Actions) */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.quickActionBtn} onPress={() => router.push('/(app)/add-movement')}>
            <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(32, 138, 239, 0.15)' }]}>
              <Ionicons name="swap-vertical" size={24} color="#208AEF" />
            </View>
            <Text style={styles.quickActionText}>Mover</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionBtn} onPress={() => router.push('/(app)/budgets')}>
            <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(239, 188, 117, 0.15)' }]}>
              <Ionicons name="pie-chart" size={24} color="#EFBC75" />
            </View>
            <Text style={styles.quickActionText}>Presupuestos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionBtn} onPress={() => router.push('/(app)/goals')}>
            <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(76, 175, 80, 0.15)' }]}>
              <Ionicons name="flag" size={24} color="#4CAF50" />
            </View>
            <Text style={styles.quickActionText}>Metas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionBtn} onPress={() => router.push('/(app)/groups')}>
            <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(156, 39, 176, 0.15)' }]}>
              <Ionicons name="people" size={24} color="#9C27B0" />
            </View>
            <Text style={styles.quickActionText}>Grupos</Text>
          </TouchableOpacity>
        </View>

        {/* Widgets Informativos */}
        <View style={styles.widgetsGrid}>
          {/* Límite diario */}
          {dailyLimit && (
            <View style={styles.widgetCard}>
              <View style={styles.widgetHeader}>
                <Ionicons name="cash-outline" size={18} color={theme.colors.light} />
                <Text style={styles.widgetTitle}>Gasto Diario</Text>
              </View>
              <Text style={styles.widgetValue}>${dailyLimit.limite_diario?.toFixed(2)}</Text>
              <Text style={styles.widgetSub}>Restan {dailyLimit.dias_restantes} días</Text>
            </View>
          )}

          {/* Wally Score */}
          <View style={styles.widgetCard}>
            <View style={styles.widgetHeader}>
              <Ionicons name="shield-checkmark-outline" size={18} color={theme.colors.accent} />
              <Text style={styles.widgetTitle}>Wally Score</Text>
            </View>
            <Text style={[styles.widgetValue, { color: score ? getScoreColor(score.puntaje_financiero) : '#fff' }]}>
              {score?.puntaje_financiero ?? '—'}
            </Text>
            <Text style={styles.widgetSub}>
              {score ? getScoreLabel(score.puntaje_financiero) : 'Sin datos'}
            </Text>
          </View>
        </View>

        {/* Predicción Financiera */}
        {prediction && (
          <View style={[styles.predictionCard, prediction.en_riesgo && styles.predictionCardRisk]}>
            <View style={styles.cardHeader}>
              <View style={styles.iconCircle}>
                <Ionicons name="trending-up" size={20} color={prediction.en_riesgo ? '#F44336' : theme.colors.accent} />
              </View>
              <Text style={styles.predictionTitle}>Insights Estratégicos</Text>
            </View>
            <Text style={styles.predictionMessage}>{prediction.mensaje}</Text>
            {prediction.en_riesgo && (
              <View style={styles.riskBox}>
                <Text style={styles.predictionDate}>
                  Sin dinero en: <Text style={{fontWeight:'900', fontSize: 16}}>{prediction.dias_hasta_sin_dinero} días</Text>
                </Text>
                <Text style={{color: 'rgba(244, 67, 54, 0.8)', fontSize: 12, marginTop: 4}}>
                  Fecha estimada: {prediction.fecha_estimada_sin_dinero}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Alertas recientes */}
        {alerts.length > 0 && (
          <View style={styles.alertsSection}>
            <View style={styles.alertsHeader}>
              <Text style={styles.alertsTitle}>Alertas Recientes</Text>
              <TouchableOpacity onPress={() => router.push('/(app)/alerts')}>
                <Text style={styles.alertsVerTodas}>Ver todas</Text>
              </TouchableOpacity>
            </View>
            {alerts.slice(0, 2).map((alerta) => (
              <View key={alerta.id} style={styles.alertItem}>
                <View style={styles.alertIconBg}>
                  <Ionicons name="warning" size={18} color={theme.colors.accent} />
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.alertItemTitle}>{alerta.titulo}</Text>
                  <Text style={styles.alertItemMsg}>{alerta.mensaje}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  decorativeCircle: { position: 'absolute', width: 400, height: 400, borderRadius: 200, backgroundColor: 'rgba(32, 138, 239, 0.08)', top: -100, right: -150 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40, marginBottom: 28 },
  greeting: { fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: '600', marginBottom: 4 },
  title: { fontSize: 28, fontWeight: '800', color: theme.colors.white },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  alertBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F44336', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  alertBadgeText: { color: theme.colors.white, fontWeight: '700', fontSize: 13 },
  logoutButton: { backgroundColor: 'rgba(255,255,255,0.08)', padding: 10, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },

  balanceCard: { padding: 24, borderRadius: 28, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  balanceCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  balanceLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 15, fontWeight: '500' },
  balanceAmount: { color: theme.colors.white, fontSize: 46, fontWeight: '900', marginBottom: 28, letterSpacing: -1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 20, padding: 16 },
  statBox: { flex: 0.45 },
  statIconRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '500' },
  statValue: { color: '#fff', fontSize: 18, fontWeight: '800' },
  statDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.2)' },

  quickActionsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  quickActionBtn: { alignItems: 'center', flex: 1 },
  quickActionIcon: { width: 56, height: 56, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  quickActionText: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600' },

  widgetsGrid: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  widgetCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.04)', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  widgetHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  widgetTitle: { color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: '600' },
  widgetValue: { color: theme.colors.white, fontSize: 26, fontWeight: '800', marginBottom: 4 },
  widgetSub: { color: 'rgba(255,255,255,0.4)', fontSize: 12 },

  predictionCard: { backgroundColor: 'rgba(255,255,255,0.04)', padding: 24, borderRadius: 24, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  predictionCardRisk: { borderColor: 'rgba(244, 67, 54, 0.4)', backgroundColor: 'rgba(244, 67, 54, 0.05)' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  predictionTitle: { color: theme.colors.white, fontSize: 17, fontWeight: '700' },
  predictionMessage: { color: 'rgba(255,255,255,0.85)', fontSize: 15, lineHeight: 22 },
  riskBox: { marginTop: 16, padding: 16, backgroundColor: 'rgba(244, 67, 54, 0.1)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(244, 67, 54, 0.2)' },
  predictionDate: { color: '#F44336', fontSize: 14, fontWeight: '500' },

  alertsSection: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  alertsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  alertsTitle: { color: theme.colors.white, fontSize: 16, fontWeight: '700' },
  alertsVerTodas: { color: theme.colors.accent, fontSize: 13, fontWeight: '600', backgroundColor: 'rgba(239, 188, 117, 0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  alertItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)', padding: 14, borderRadius: 16, marginBottom: 8, gap: 14 },
  alertIconBg: { backgroundColor: 'rgba(239, 188, 117, 0.15)', padding: 10, borderRadius: 14 },
  alertItemTitle: { color: theme.colors.white, fontWeight: '700', fontSize: 14, marginBottom: 4 },
  alertItemMsg: { color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 18 },
});
