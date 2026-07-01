import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@shared/theme';

interface PredictionCardProps {
  prediction: any;
}

export function PredictionCard({ prediction }: PredictionCardProps) {
  if (!prediction) return null;

  return (
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
  );
}

const styles = StyleSheet.create({
  predictionCard: { backgroundColor: 'rgba(255,255,255,0.04)', padding: 24, borderRadius: 24, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  predictionCardRisk: { borderColor: 'rgba(244, 67, 54, 0.4)', backgroundColor: 'rgba(244, 67, 54, 0.05)' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  predictionTitle: { color: theme.colors.white, fontSize: 17, fontWeight: '700' },
  predictionMessage: { color: 'rgba(255,255,255,0.85)', fontSize: 15, lineHeight: 22 },
  riskBox: { marginTop: 16, padding: 16, backgroundColor: 'rgba(244, 67, 54, 0.1)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(244, 67, 54, 0.2)' },
  predictionDate: { color: '#F44336', fontSize: 14, fontWeight: '500' },
});
