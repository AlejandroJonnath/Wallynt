import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { KpiCard } from './KpiCard';
import { theme } from '@shared/theme';

interface UsersKpisProps {
  biz: any;
}

export function UsersKpis({ biz }: UsersKpisProps) {
  return (
    <>
      <Text style={styles.section}>Usuarios</Text>
      <View style={styles.grid}>
        <KpiCard icon="people" label="Registrados" value={biz?.usuarios_registrados ?? 0} />
        <KpiCard icon="pulse" label="Activos (30d)" value={biz?.usuarios_activos_mensuales ?? 0} color={theme.colors.secondary} />
        <KpiCard icon="trending-up" label="Retención" value={`${biz?.tasa_retencion ?? 0}%`} color="#4CAF50" />
        <KpiCard icon="trending-down" label="Abandono" value={`${biz?.tasa_abandono ?? 0}%`} color="#F44336" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  section: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginTop: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
});
