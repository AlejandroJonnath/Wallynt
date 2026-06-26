import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { api } from '@core/api';
import { theme } from '@shared/theme';
import { Ionicons } from '@expo/vector-icons';

export default function AdminInsightsScreen() {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/strategic-insights')
      .then(r => setInsights(r.data))
      .catch(e => Alert.alert('Error', e.response?.data?.message || 'Error al cargar'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={theme.colors.secondary} /></View>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
      <Text style={styles.title}>Insights Estratégicos</Text>
      <Text style={styles.subtitle}>Análisis calculado en tiempo real sobre los datos de la plataforma</Text>

      {insights.map((item, idx) => (
        <View key={idx} style={[styles.card, { borderLeftColor: item.color, borderLeftWidth: 4 }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBg, { backgroundColor: `${item.color}22` }]}>
              <Ionicons name={item.icono as any} size={22} color={item.color} />
            </View>
            <Text style={styles.cardTitle}>{item.titulo}</Text>
          </View>

          <View style={[styles.datoBadge, { backgroundColor: `${item.color}18` }]}>
            <Text style={[styles.datoText, { color: item.color }]}>
              {item.dato_texto}
            </Text>
          </View>

          <Text style={styles.decisionLabel}>Acción recomendada</Text>
          <Text style={styles.decisionText}>{item.decision}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.primary },
  center: { flex: 1, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 26, fontWeight: '800', color: theme.colors.white, marginTop: 8, marginBottom: 6 },
  subtitle: { color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 24 },
  card: { backgroundColor: theme.colors.petroleum, borderRadius: 20, padding: 20, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  iconBg: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  cardTitle: { color: theme.colors.white, fontSize: 16, fontWeight: '700', flex: 1 },
  datoBadge: { borderRadius: 12, padding: 12, marginBottom: 14 },
  datoText: { fontSize: 15, fontWeight: '700', lineHeight: 22 },
  decisionLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  decisionText: { color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 20 },
});
