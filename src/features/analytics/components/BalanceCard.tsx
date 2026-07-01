import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@shared/theme';

interface BalanceCardProps {
  saldoDisponible?: number;
  ingresoFijo?: number;
  totalGastos?: number;
}

export function BalanceCard({ saldoDisponible, ingresoFijo, totalGastos }: BalanceCardProps) {
  return (
    <LinearGradient
      colors={['rgba(32, 138, 239, 0.9)', 'rgba(15, 108, 108, 0.95)']}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      style={styles.balanceCard}
    >
      <View style={styles.balanceCardTop}>
        <Text style={styles.balanceLabel}>Saldo Disponible</Text>
        <Ionicons name="wallet" size={24} color="rgba(255,255,255,0.4)" />
      </View>
      <Text style={styles.balanceAmount}>${saldoDisponible?.toFixed(2) || '0.00'}</Text>
      
      <View style={styles.row}>
        <View style={styles.statBox}>
          <View style={styles.statIconRow}>
            <Ionicons name="arrow-down-circle" size={16} color="#4CAF50" />
            <Text style={styles.statLabel}>Ingreso Base</Text>
          </View>
          <Text style={styles.statValue}>+${ingresoFijo?.toFixed(2) || '0.00'}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <View style={styles.statIconRow}>
            <Ionicons name="arrow-up-circle" size={16} color="#EFBC75" />
            <Text style={styles.statLabel}>Gastos</Text>
          </View>
          <Text style={styles.statValue}>-${totalGastos?.toFixed(2) || '0.00'}</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  balanceCard: { padding: 24, borderRadius: 28, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  balanceCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  balanceLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 15, fontWeight: '500' },
  balanceAmount: { color: theme.colors.white, fontSize: 46, fontWeight: '900', marginBottom: 28, letterSpacing: -1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 20, padding: 16 },
  statBox: { flex: 0.45 },
  statIconRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '500' },
  statValue: { color: '#fff', fontSize: 18, fontWeight: '800' },
  statDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.2)' },
});
