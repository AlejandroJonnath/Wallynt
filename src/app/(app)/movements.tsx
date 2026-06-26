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

export default function MovementsScreen() {
  const router = useRouter();
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadMovements();
    }, [])
  );

  const loadMovements = async () => {
    try {
      setLoading(true);
      const res = await api.get('/movements');
      setMovements(res.data);
    } catch (e) {
      console.log('Error fetching movements', e);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = (id: string) => {
    Alert.alert('Eliminar', '¿Seguro que deseas eliminar este movimiento?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive', onPress: async () => {
          try {
            await api.delete(`/movements/${id}`);
            setMovements(prev => prev.filter(m => m.id !== id));
          } catch {
            Alert.alert('Error', 'No se pudo eliminar');
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }: any) => {
    const iconName = CATEGORY_ICONS[item.categorias?.nombre] || 'list';
    
    return (
      <View style={styles.card}>
        <View style={styles.cardLeft}>
          <View style={styles.iconBg}>
            <Ionicons name={iconName} size={24} color={theme.colors.white} />
          </View>
          <View>
            <Text style={styles.catName}>{item.categorias?.nombre || 'Categoría'}</Text>
            <Text style={styles.desc}>{item.descripcion || 'Sin descripción'}</Text>
            <Text style={styles.date}>{item.fecha}</Text>
          </View>
        </View>
        <View style={styles.cardRight}>
          <Text style={[styles.amount, { color: item.tipo === 'INGRESO' ? theme.colors.light : theme.colors.accent }]}>
            {item.tipo === 'INGRESO' ? '+' : '-'}${item.monto}
          </Text>
          <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={20} color="#F44336" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Movimientos</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push('/(app)/add-movement')}
        >
          <Ionicons name="add" size={18} color={theme.colors.white} />
          <Text style={styles.addBtnText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      {loading && movements.length === 0 ? (
        <ActivityIndicator size="large" color={theme.colors.secondary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={movements}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="wallet-outline" size={60} color={theme.colors.light} style={{marginBottom: 16}} />
              <Text style={styles.empty}>No tienes movimientos registrados.</Text>
              <Text style={styles.emptySub}>Toca "Agregar" para empezar</Text>
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
  addBtnText: { color: theme.colors.white, fontWeight: '700', fontSize: 14 },

  card: { backgroundColor: theme.colors.petroleum, padding: 16, borderRadius: 20, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 14 },
  cardRight: { alignItems: 'flex-end', gap: 8 },
  iconBg: { backgroundColor: 'rgba(255,255,255,0.1)', width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center' },
  catName: { color: theme.colors.white, fontSize: 16, fontWeight: '700', marginBottom: 2 },
  desc: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },
  date: { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 },
  amount: { fontSize: 18, fontWeight: '900' },
  deleteBtn: { padding: 6, backgroundColor: 'rgba(244, 67, 54, 0.1)', borderRadius: 12 },

  emptyContainer: { alignItems: 'center', marginTop: 80 },
  empty: { color: theme.colors.light, fontSize: 18, fontWeight: '600', marginBottom: 8, textAlign: 'center' },
  emptySub: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },
});
