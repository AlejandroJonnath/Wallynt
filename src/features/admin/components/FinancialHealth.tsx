import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { KpiCard } from './KpiCard';
import { theme } from '@shared/theme';

interface FinancialHealthProps {
  fin: any;
}

export function FinancialHealth({ fin }: FinancialHealthProps) {
  return (
    <>
      <Text style={styles.section}>Salud Financiera</Text>
      <View style={styles.grid}>
        <KpiCard icon="arrow-up-circle" label="Ingreso Promedio" value={`$${fin?.ingreso_promedio ?? 0}`} color="#4CAF50" />
        <KpiCard icon="arrow-down-circle" label="Gasto Promedio" value={`$${fin?.gasto_promedio ?? 0}`} color="#F44336" />
        <KpiCard icon="warning" label="Usuarios en Riesgo" value={fin?.usuarios_en_riesgo ?? 0} color="#F44336" />
        <KpiCard icon="swap-horizontal" label="Desvío Estimado/Real" value={`${fin?.diferencia_estimado_real_pct ?? 0}%`} color={fin?.diferencia_estimado_real_pct > 0 ? '#FFC107' : '#4CAF50'} />
        <KpiCard icon="flag" label="Metas Completadas" value={`${fin?.metas_completadas ?? 0} / ${fin?.total_metas ?? 0}`} />
        <KpiCard icon="analytics" label="Wally Score Prom." value={`${fin?.wally_score_promedio ?? 0}`} color={theme.colors.secondary} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  section: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginTop: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
});
