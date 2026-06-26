import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { api } from '../../lib/api';
import { theme } from '../../constants/theme';

const TIPO_ICON: Record<string, string> = {
  PRESUPUESTO: '💳', RIESGO: '🔴', INUSUAL: '📈', METAS: '🏆', SISTEMA: 'ℹ️'
};

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAlerts(); }, []);

  const loadAlerts = async () => {
    try {
      const res = await api.get('/analysis/alerts');
      setAlerts(res.data);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id: string) => {
    try {
      await api.patch(`/analysis/alerts/${id}/read`);
      setAlerts(prev => prev.filter(a => a.id !== id));
    } catch (e) { console.log(e); }
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.card} onPress={() => markRead(item.id)} activeOpacity={0.8}>
      <View style={styles.cardLeft}>
        <Text style={styles.cardIcon}>{TIPO_ICON[item.tipo] || 'ℹ️'}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{item.titulo}</Text>
          <Text style={styles.cardMsg}>{item.mensaje}</Text>
          <Text style={styles.cardDate}>{new Date(item.fecha_creacion).toLocaleDateString('es-EC')}</Text>
        </View>
      </View>
      <Text style={styles.readHint}>✓</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alertas</Text>
      <Text style={styles.subtitle}>Toca una alerta para marcarla como leída</Text>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.secondary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={alerts}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🎉</Text>
              <Text style={styles.empty}>¡Sin alertas pendientes!</Text>
              <Text style={styles.emptySub}>Todo está bajo control</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.primary },
  title: { fontSize: 28, fontWeight: '800', color: theme.colors.white, marginTop: 50, marginHorizontal: 24, marginBottom: 4 },
  subtitle: { color: 'rgba(255,255,255,0.5)', fontSize: 13, marginHorizontal: 24, marginBottom: 20 },

  card: { backgroundColor: theme.colors.petroleum, padding: 18, borderRadius: 18, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, flex: 1 },
  cardIcon: { fontSize: 26 },
  cardTitle: { color: theme.colors.white, fontSize: 15, fontWeight: '700', marginBottom: 4 },
  cardMsg: { color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 18 },
  cardDate: { color: 'rgba(255,255,255,0.35)', fontSize: 11, marginTop: 6 },
  readHint: { color: theme.colors.secondary, fontSize: 20, fontWeight: '700', paddingLeft: 8 },

  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyEmoji: { fontSize: 60, marginBottom: 16 },
  empty: { color: theme.colors.light, fontSize: 18, fontWeight: '600', marginBottom: 8 },
  emptySub: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },
});
