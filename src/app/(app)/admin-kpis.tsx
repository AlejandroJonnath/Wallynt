import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { api } from '@core/api';
import { theme } from '@shared/theme';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@features/auth/store/useAuthStore';

function KpiCard({ label, value, color = theme.colors.white, icon, fullWidth = false }: {
  label: string; value: string | number; color?: string; icon: string; fullWidth?: boolean;
}) {
  return (
    <View style={[styles.card, fullWidth && { minWidth: '100%' }]}>
      <Ionicons name={icon as any} size={22} color={color} style={{ marginBottom: 8 }} />
      <Text style={[styles.cardValue, { color }]}>{value}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  );
}

export default function AdminKpisScreen() {
  const { signOut, userProfile } = useAuthStore();
  const router = useRouter();
  const [biz, setBiz] = useState<any>(null);
  const [fin, setFin] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [b, f] = await Promise.all([
          api.get('/admin/business-kpis'),
          api.get('/admin/financial-kpis'),
        ]);
        setBiz(b.data);
        setFin(f.data);
      } catch (e: any) {
        Alert.alert('Error', e.response?.data?.message || 'Error al cargar KPIs');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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

      <Text style={styles.section}>Usuarios</Text>
      <View style={styles.grid}>
        <KpiCard icon="people" label="Registrados" value={biz?.usuarios_registrados ?? 0} />
        <KpiCard icon="pulse" label="Activos (30d)" value={biz?.usuarios_activos_mensuales ?? 0} color={theme.colors.secondary} />
        <KpiCard icon="trending-up" label="Retención" value={`${biz?.tasa_retencion ?? 0}%`} color="#4CAF50" />
        <KpiCard icon="trending-down" label="Abandono" value={`${biz?.tasa_abandono ?? 0}%`} color="#F44336" />
      </View>

      {/* Funcionalidades */}
      <Text style={styles.section}>Funcionalidades Más Usadas</Text>
      <View style={styles.featureList}>
        {(biz?.funcionalidades || []).map((f: any, i: number) => (
          <View key={i} style={styles.featureRow}>
            <View style={styles.featureRank}><Text style={styles.featureRankText}>#{i + 1}</Text></View>
            <Ionicons name={f.icon as any} size={20} color={theme.colors.secondary} />
            <Text style={styles.featureName}>{f.name}</Text>
            <Text style={styles.featureCount}>{f.count} registros</Text>
          </View>
        ))}
      </View>

      {/* Financieros */}
      <Text style={styles.section}>Salud Financiera</Text>
      <View style={styles.grid}>
        <KpiCard icon="arrow-up-circle" label="Ingreso Promedio" value={`$${fin?.ingreso_promedio ?? 0}`} color="#4CAF50" />
        <KpiCard icon="arrow-down-circle" label="Gasto Promedio" value={`$${fin?.gasto_promedio ?? 0}`} color="#F44336" />
        <KpiCard icon="warning" label="Usuarios en Riesgo" value={fin?.usuarios_en_riesgo ?? 0} color="#F44336" />
        <KpiCard icon="swap-horizontal" label="Desvío Estimado/Real" value={`${fin?.diferencia_estimado_real_pct ?? 0}%`} color={fin?.diferencia_estimado_real_pct > 0 ? '#FFC107' : '#4CAF50'} />
        <KpiCard icon="flag" label="Metas Completadas" value={`${fin?.metas_completadas ?? 0} / ${fin?.total_metas ?? 0}`} />
        <KpiCard icon="analytics" label="Wally Score Prom." value={`${fin?.wally_score_promedio ?? 0}`} color={theme.colors.secondary} />
      </View>

      {/* Top categorías con Gráfico de Barras Visual */}
      {(fin?.top_categorias || []).length > 0 && (
        <>
          <Text style={styles.section}>Gráfico: Categorías con Mayor Gasto</Text>
          <View style={styles.featureList}>
            {(fin.top_categorias).map((cat: any, i: number, arr: any[]) => {
              const maxVal = arr[0].total || 1;
              const pct = (cat.total / maxVal) * 100;
              return (
                <View key={i} style={styles.featureRow}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Ionicons name="cart" size={16} color={theme.colors.accent} />
                        <Text style={styles.featureName}>{cat.nombre}</Text>
                      </View>
                      <Text style={styles.featureCount}>${cat.total}</Text>
                    </View>
                    <View style={{ height: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                      <View style={{ height: '100%', width: `${pct}%`, backgroundColor: i === 0 ? theme.colors.accent : theme.colors.secondary, borderRadius: 4 }} />
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.primary },
  center: { flex: 1, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logoutBtn: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 10, borderRadius: 12, marginBottom: 20 },
  title: { fontSize: 26, fontWeight: '800', color: theme.colors.white, marginTop: 8, marginBottom: 4 },
  section: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginTop: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  card: { backgroundColor: theme.colors.petroleum, padding: 18, borderRadius: 20, flex: 1, minWidth: '45%', alignItems: 'center' },
  cardValue: { fontSize: 28, fontWeight: '900', marginBottom: 4 },
  cardLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12, textAlign: 'center' },
  featureList: { backgroundColor: theme.colors.petroleum, borderRadius: 20, marginBottom: 24, overflow: 'hidden' },
  featureRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  featureRank: { width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(20,141,141,0.15)', justifyContent: 'center', alignItems: 'center' },
  featureRankText: { color: theme.colors.secondary, fontWeight: '800', fontSize: 13 },
  featureName: { flex: 1, color: theme.colors.white, fontSize: 14, fontWeight: '600' },
  featureCount: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
});
