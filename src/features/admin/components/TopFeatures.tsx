import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@shared/theme';

interface TopFeaturesProps {
  biz: any;
}

export function TopFeatures({ biz }: TopFeaturesProps) {
  if (!biz?.funcionalidades || biz.funcionalidades.length === 0) return null;

  return (
    <>
      <Text style={styles.section}>Funcionalidades Más Usadas</Text>
      <View style={styles.featureList}>
        {(biz.funcionalidades).map((f: any, i: number) => (
          <View key={i} style={styles.featureRow}>
            <View style={styles.featureRank}><Text style={styles.featureRankText}>#{i + 1}</Text></View>
            <Ionicons name={f.icon as any} size={20} color={theme.colors.secondary} />
            <Text style={styles.featureName}>{f.name}</Text>
            <Text style={styles.featureCount}>{f.count} registros</Text>
          </View>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  section: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginTop: 8 },
  featureList: { backgroundColor: theme.colors.petroleum, borderRadius: 20, marginBottom: 24, overflow: 'hidden' },
  featureRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  featureRank: { width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(20,141,141,0.15)', justifyContent: 'center', alignItems: 'center' },
  featureRankText: { color: theme.colors.secondary, fontWeight: '800', fontSize: 13 },
  featureName: { flex: 1, color: theme.colors.white, fontSize: 14, fontWeight: '600' },
  featureCount: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
});
