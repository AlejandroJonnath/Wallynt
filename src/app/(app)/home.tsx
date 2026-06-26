import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/useAuthStore';
import { api } from '../../lib/api';
import { theme } from '../../constants/theme';

export default function HomeScreen() {
  const { signOut } = useAuthStore();
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
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.secondary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Mi Billetera</Text>
        <View style={styles.headerActions}>
          {alerts.length > 0 && (
            <TouchableOpacity style={styles.alertBadge} onPress={() => router.push('/(app)/alerts')}>
              <Ionicons name="notifications" size={16} color="#fff" />
              <Text style={styles.alertBadgeText}>{alerts.length}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
            <Ionicons name="log-out-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tarjeta de saldo */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo Disponible</Text>
        <Text style={styles.balanceAmount}>${dashboard?.saldoDisponible?.toFixed(2) || '0.00'}</Text>
        <View style={styles.row}>
          <View style={styles.statBox}>
            <Ionicons name="arrow-up-circle" size={20} color={theme.colors.light} style={{marginBottom: 4}} />
            <Text style={styles.statLabel}>Ingreso Base</Text>
            <Text style={[styles.statValue, { color: theme.colors.light }]}>
              +${dashboard?.ingreso_mensual_fijo?.toFixed(2) || '0.00'}
            </Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="arrow-down-circle" size={20} color={theme.colors.accent} style={{marginBottom: 4}} />
            <Text style={styles.statLabel}>Gastos</Text>
            <Text style={[styles.statValue, { color: theme.colors.accent }]}>
              -${dashboard?.totalGastos?.toFixed(2) || '0.00'}
            </Text>
          </View>
        </View>
      </View>

      {/* Límite diario */}
      {dailyLimit && (
        <View style={styles.dailyCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="wallet-outline" size={20} color={theme.colors.white} />
            <Text style={styles.dailyLabel}>Límite de gasto hoy</Text>
          </View>
          <Text style={styles.dailyAmount}>${dailyLimit.limite_diario?.toFixed(2)}</Text>
          <Text style={styles.dailySub}>Quedan {dailyLimit.dias_restantes} días en el mes</Text>
        </View>
      )}

      {prediction && (
        <View style={[styles.predictionCard, prediction.en_riesgo && styles.predictionCardRisk]}>
          <View style={styles.cardHeader}>
            <Ionicons name="trending-up-outline" size={20} color={theme.colors.white} />
            <Text style={styles.predictionTitle}>Predicción Financiera</Text>
          </View>
          <Text style={styles.predictionMessage}>{prediction.mensaje}</Text>
          {prediction.en_riesgo && (
            <>
              <Text style={styles.predictionDate}>
                Te quedarás sin dinero en exactamente <Text style={{fontWeight:'900', fontSize: 15}}>{prediction.dias_hasta_sin_dinero} días</Text>
              </Text>
              <Text style={{color: '#F44336', fontSize: 12, marginTop: 4}}>
                Estimado: {prediction.fecha_estimada_sin_dinero}
              </Text>
            </>
          )}
        </View>
      )}

      {/* Wally Score */}
      <View style={styles.scoreCard}>
        <View style={styles.cardHeaderCenter}>
          <Ionicons name="shield-checkmark-outline" size={20} color={theme.colors.white} />
          <Text style={styles.scoreTitle}>Wally Score</Text>
        </View>
        <Text style={[styles.scoreValue, { color: score ? getScoreColor(score.puntaje_financiero) : '#fff' }]}>
          {score?.puntaje_financiero ?? '—'}
        </Text>
        <Text style={styles.scoreLabel}>
          {score ? getScoreLabel(score.puntaje_financiero) : 'Registra movimientos para calcular'}
        </Text>
      </View>

      {/* Alertas recientes */}
      {alerts.length > 0 && (
        <View style={styles.alertsSection}>
          <View style={styles.alertsHeader}>
            <Text style={styles.alertsTitle}>Alertas Recientes</Text>
            <TouchableOpacity onPress={() => router.push('/(app)/alerts')}>
              <Text style={styles.alertsVerTodas}>Ver todas →</Text>
            </TouchableOpacity>
          </View>
          {alerts.slice(0, 2).map((alerta) => (
            <View key={alerta.id} style={styles.alertItem}>
              <View style={styles.alertIconBg}>
                <Ionicons name="warning-outline" size={18} color={theme.colors.accent} />
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.primary },
  centerContainer: { flex: 1, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40, marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '800', color: theme.colors.white },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  alertBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F44336', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  alertBadgeText: { color: theme.colors.white, fontWeight: '700', fontSize: 13 },
  logoutButton: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 8, borderRadius: 20 },
  logoutText: { color: theme.colors.white, fontWeight: '600', fontSize: 13 },

  balanceCard: { backgroundColor: theme.colors.secondary, padding: 24, borderRadius: 24, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 15, elevation: 8 },
  balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 15, marginBottom: 6 },
  balanceAmount: { color: theme.colors.white, fontSize: 44, fontWeight: '900', marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  statBox: { backgroundColor: 'rgba(0,0,0,0.15)', padding: 14, borderRadius: 16, flex: 0.48 },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: '700' },

  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  cardHeaderCenter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 10 },
  
  dailyCard: { backgroundColor: theme.colors.petroleum, padding: 20, borderRadius: 20, marginBottom: 16 },
  dailyLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  dailyAmount: { color: theme.colors.accent, fontSize: 36, fontWeight: '900' },
  dailySub: { color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 4 },

  predictionCard: { backgroundColor: theme.colors.petroleum, padding: 20, borderRadius: 20, marginBottom: 16 },
  predictionCardRisk: { borderWidth: 1, borderColor: '#F44336' },
  predictionTitle: { color: theme.colors.white, fontSize: 16, fontWeight: '700' },
  predictionMessage: { color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 20 },
  predictionDate: { color: '#F44336', fontSize: 13, marginTop: 8, fontWeight: '600' },

  scoreCard: { backgroundColor: theme.colors.petroleum, padding: 24, borderRadius: 24, alignItems: 'center', marginBottom: 16 },
  scoreTitle: { color: theme.colors.white, fontSize: 18, fontWeight: '600' },
  scoreValue: { fontSize: 60, fontWeight: '900', marginBottom: 8 },
  scoreLabel: { color: theme.colors.light, textAlign: 'center', fontSize: 15, fontWeight: '600' },

  alertsSection: { backgroundColor: theme.colors.petroleum, padding: 20, borderRadius: 20, marginBottom: 16 },
  alertsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  alertsTitle: { color: theme.colors.white, fontSize: 16, fontWeight: '700' },
  alertsVerTodas: { color: theme.colors.accent, fontSize: 13, fontWeight: '600' },
  alertItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.07)', padding: 14, borderRadius: 14, marginBottom: 8, gap: 12 },
  alertIconBg: { backgroundColor: 'rgba(239, 188, 117, 0.1)', padding: 8, borderRadius: 10 },
  alertItemTitle: { color: theme.colors.white, fontWeight: '700', fontSize: 14, marginBottom: 4 },
  alertItemMsg: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
});
