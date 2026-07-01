import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@shared/theme';

interface KpiCardProps {
  label: string;
  value: string | number;
  color?: string;
  icon: string;
  fullWidth?: boolean;
}

export function KpiCard({ label, value, color = theme.colors.white, icon, fullWidth = false }: KpiCardProps) {
  return (
    <View style={[styles.card, fullWidth && { minWidth: '100%' }]}>
      <Ionicons name={icon as any} size={22} color={color} style={{ marginBottom: 8 }} />
      <Text style={[styles.cardValue, { color }]}>{value}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: theme.colors.petroleum, padding: 18, borderRadius: 20, flex: 1, minWidth: '45%', alignItems: 'center' },
  cardValue: { fontSize: 28, fontWeight: '900', marginBottom: 4 },
  cardLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12, textAlign: 'center' },
});
