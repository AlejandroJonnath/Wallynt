import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@shared/theme';

interface WidgetsGridProps {
  dailyLimit: any;
  score: any;
}

export function WidgetsGrid({ dailyLimit, score }: WidgetsGridProps) {
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

  return (
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
  );
}

const styles = StyleSheet.create({
  widgetsGrid: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  widgetCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.04)', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  widgetHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  widgetTitle: { color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: '600' },
  widgetValue: { color: theme.colors.white, fontSize: 26, fontWeight: '800', marginBottom: 4 },
  widgetSub: { color: 'rgba(255,255,255,0.4)', fontSize: 12 },
});
