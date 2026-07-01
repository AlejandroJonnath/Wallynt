import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@shared/theme';

interface AlertsSectionProps {
  alerts: any[];
}

export function AlertsSection({ alerts }: AlertsSectionProps) {
  const router = useRouter();

  if (alerts.length === 0) return null;

  return (
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
  );
}

const styles = StyleSheet.create({
  alertsSection: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  alertsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  alertsTitle: { color: theme.colors.white, fontSize: 16, fontWeight: '700' },
  alertsVerTodas: { color: theme.colors.accent, fontSize: 13, fontWeight: '600', backgroundColor: 'rgba(239, 188, 117, 0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  alertItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)', padding: 14, borderRadius: 16, marginBottom: 8, gap: 14 },
  alertIconBg: { backgroundColor: 'rgba(239, 188, 117, 0.15)', padding: 10, borderRadius: 14 },
  alertItemTitle: { color: theme.colors.white, fontWeight: '700', fontSize: 14, marginBottom: 4 },
  alertItemMsg: { color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 18 },
});
