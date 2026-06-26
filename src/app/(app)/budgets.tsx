import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../lib/api';
import { theme } from '../../constants/theme';

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  'Alimentación': 'fast-food', 'Transporte': 'bus', 'Educación': 'school',
  'Entretenimiento': 'game-controller', 'Compras': 'cart', 'Salud': 'medkit', 'Otros': 'ellipsis-horizontal',
};

export default function BudgetsScreen() {
  const router = useRouter();
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => { loadBudgets(); }, [])
  );

  const loadBudgets = async () => {
    try {
      setLoading(true);
      const res = await api.get('/budgets');
      setBudgets(res.data);
    } catch (e) {
      console.log('Error loading budgets', e);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = (id: string) => {
    Alert.alert('Eliminar presupuesto', '¿Seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive', onPress: async () => {
          await api.delete(`/budgets/${id}`);
          setBudgets(prev => prev.filter(b => b.id !== id));
        }
      }
    ]);
  };

  const getBarColor = (pct: number) => {
    if (pct >= 100) return '#F44336';
    if (pct >= 80) return theme.colors.accent;
    return '#4CAF50';
  };

  const getStatusIcon = (estado: string): keyof typeof Ionicons.glyphMap => {
    if (estado === 'excedido') return 'warning';
    if (estado === 'advertencia') return 'alert-circle';
    return 'checkmark-circle';
  };

  const getStatusColor = (estado: string) => {
    if (estado === 'excedido') return '#F44336';
    if (estado === 'advertencia') return theme.colors.accent;
    return '#4CAF50';
  };

  const renderItem = ({ item }: any) => {
    const iconName = CATEGORY_ICONS[item.categorias?.nombre] || 'ellipsis-horizontal';
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitle}>
            <View style={styles.iconBg}>
              <Ionicons name={iconName} size={22} color={theme.colors.white} />
            </View>
            <View>
              <Text style={styles.catName}>{item.categorias?.nombre}</Text>
              <View style={styles.statusRow}>
                <Ionicons name={getStatusIcon(item.estado)} size={13} color={getStatusColor(item.estado)} />
                <Text style={[styles.estadoBadge, { color: getStatusColor(item.estado) }]}>
                  {item.estado === 'excedido' ? 'Excedido' : item.estado === 'advertencia' ? 'Advertencia' : 'En control'}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={20} color="#F44336" />
          </TouchableOpacity>
        </View>

        {/* Barra de progreso */}
        <View style={styles.barBg}>
          <View style={[styles.barFill, { width: `${Math.min(item.porcentaje_usado, 100)}%`, backgroundColor: getBarColor(item.porcentaje_usado) }]} />
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.footerText}>Gastado: ${item.gasto_actual?.toFixed(2)}</Text>
          <Text style={styles.footerText}>{item.porcentaje_usado}% de ${item.limite_monto}</Text>
          <Text style={[styles.footerText, { color: '#4CAF50' }]}>Resta: ${item.restante?.toFixed(2)}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Presupuesto</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/(app)/add-budget')}>
          <Ionicons name="add" size={18} color={theme.colors.white} />
          <Text style={styles.addBtnText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      {loading && budgets.length === 0 ? (
        <ActivityIndicator size="large" color={theme.colors.secondary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={budgets}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="pie-chart-outline" size={60} color={theme.colors.light} style={{ marginBottom: 16 }} />
              <Text style={styles.empty}>No tienes presupuestos</Text>
              <Text style={styles.emptySub}>Crea uno para controlar tus gastos</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.primary },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginTop: 50, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '800', color: theme.colors.white },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.secondary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, gap: 4 },
  addBtnText: { color: theme.colors.white, fontWeight: '700' },

  card: { backgroundColor: theme.colors.petroleum, padding: 20, borderRadius: 20, marginBottom: 14 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  cardTitle: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconBg: { backgroundColor: 'rgba(255,255,255,0.1)', width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center' },
  catName: { color: theme.colors.white, fontSize: 17, fontWeight: '700' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  estadoBadge: { fontSize: 12, fontWeight: '600' },
  deleteBtn: { padding: 8, backgroundColor: 'rgba(244,67,54,0.1)', borderRadius: 12 },

  barBg: { height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, marginBottom: 12 },
  barFill: { height: 8, borderRadius: 8 },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },

  emptyContainer: { alignItems: 'center', marginTop: 80 },
  empty: { color: theme.colors.light, fontSize: 18, fontWeight: '600', marginBottom: 8, textAlign: 'center' },
  emptySub: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },
});
