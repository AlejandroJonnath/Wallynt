import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@shared/theme';

interface TopCategoriesChartProps {
  fin: any;
}

export function TopCategoriesChart({ fin }: TopCategoriesChartProps) {
  if (!fin?.top_categorias || fin.top_categorias.length === 0) return null;

  return (
    <>
      <Text style={styles.section}>Gráfico: Categorías con Mayor Gasto</Text>
      <View style={styles.featureList}>
        {(fin.top_categorias).map((cat: any, i: number, arr: any[]) => {
          const maxVal = arr[0].total || 1;
          const pct = (cat.total / maxVal) * 100;
          return (
            <View key={i} style={styles.featureRow}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name="cart" size={16} color={theme.colors.accent} />
                    <Text style={styles.featureName}>{cat.nombre}</Text>
                  </View>
                  <Text style={styles.featureCount}>${cat.total}</Text>
                </View>
                <View style={{ height: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                  <View style={{ height: '100%', width: `${pct}%`, backgroundColor: i === 0 ? theme.colors.accent : theme.colors.secondary, borderRadius: 4 }} />
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  section: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginTop: 8 },
  featureList: { backgroundColor: theme.colors.petroleum, borderRadius: 20, marginBottom: 24, overflow: 'hidden' },
  featureRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  featureName: { color: theme.colors.white, fontSize: 14, fontWeight: '600' },
  featureCount: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
});
