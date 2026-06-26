import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Modal, TextInput, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { api } from '@core/api';
import { theme } from '@shared/theme';

export default function GoalsScreen() {
  const router = useRouter();
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [contributeModal, setContributeModal] = useState<{ visible: boolean; goalId: string; goalName: string }>({ visible: false, goalId: '', goalName: '' });
  const [aporte, setAporte] = useState('');
  const [dashboard, setDashboard] = useState<any>(null);

  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => { loadData(); }, [])
  );

  const loadData = async () => {
    try {
      setLoading(true);
      const [goalsRes, dashRes] = await Promise.all([
        api.get('/goals'),
        api.get('/analysis/dashboard')
      ]);
      setGoals(goalsRes.data);
      setDashboard(dashRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const onContribute = async () => {
    if (!aporte || Number(aporte) <= 0) {
      Alert.alert('Error', 'Ingresa un monto válido');
      return;
    }
    setSaving(true);
    try {
      await api.patch(`/goals/${contributeModal.goalId}/contribute`, { aporte: Number(aporte) });
      setContributeModal({ visible: false, goalId: '', goalName: '' });
      setAporte('');
      loadData();
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'No se pudo aportar');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = (id: string) => {
    Alert.alert('Eliminar meta', '¿Seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
        await api.delete(`/goals/${id}`);
        setGoals(prev => prev.filter(g => g.id !== id));
      }}
    ]);
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.goalName}>{item.nombre}</Text>
        <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={20} color="#F44336" />
        </TouchableOpacity>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressCircle}>
          <Text style={styles.progressPct}>{item.porcentaje}%</Text>
        </View>
        <View style={styles.progressInfo}>
          <Text style={styles.progressAmount}>
            ${Number(item.monto_actual).toFixed(2)} / ${Number(item.monto_objetivo).toFixed(2)}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 }}>
            <Ionicons name="calendar-outline" size={12} color="rgba(255,255,255,0.5)" />
            <Text style={styles.progressSub}>Objetivo: {item.fecha_objetivo}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 }}>
            <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.5)" />
            <Text style={styles.progressSub}>{item.dias_restantes} días restantes</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="trending-up-outline" size={12} color={theme.colors.accent} />
            <Text style={[styles.progressSub, { color: theme.colors.accent }]}>
              Aporte diario: ${item.aporte_diario_recomendado}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${Math.min(item.porcentaje, 100)}%` }]} />
      </View>

      {!item.completada && (
        <TouchableOpacity
          style={styles.contributeBtn}
          onPress={() => setContributeModal({ visible: true, goalId: item.id, goalName: item.nombre })}
        >
          <Ionicons name="add-circle-outline" size={20} color={theme.colors.primary} />
          <Text style={styles.contributeBtnText}>Aportar</Text>
        </TouchableOpacity>
      )}
      {item.completada && (
        <View style={styles.completedBadge}>
          <Ionicons name="trophy" size={18} color="#4CAF50" />
          <Text style={styles.completedText}>¡Meta alcanzada!</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Metas de Ahorro</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/(app)/add-goal')}>
          <Ionicons name="add" size={18} color={theme.colors.white} />
          <Text style={styles.addBtnText}>Nueva</Text>
        </TouchableOpacity>
      </View>

      {dashboard?.dinero_para_ahorro > 0 && (
        <View style={styles.suggestionCard}>
          <Ionicons name="bulb-outline" size={24} color={theme.colors.accent} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.suggestionTitle}>Sugerencia de ahorro</Text>
            <Text style={styles.suggestionText}>
              Basado en tus ingresos y presupuestos, tienes <Text style={{fontWeight:'700', color: theme.colors.accent}}>${dashboard.dinero_para_ahorro.toFixed(2)}</Text> libres este mes que podrías destinar a tus metas.
            </Text>
          </View>
        </View>
      )}

      {loading && goals.length === 0 ? (
        <ActivityIndicator size="large" color={theme.colors.secondary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={goals}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="flag-outline" size={60} color={theme.colors.light} style={{ marginBottom: 16 }} />
              <Text style={styles.empty}>No tienes metas de ahorro</Text>
              <Text style={styles.emptySub}>Crea una meta para motivarte</Text>
            </View>
          }
        />
      )}

      {/* Modal de aporte */}
      <Modal visible={contributeModal.visible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Aportar a "{contributeModal.goalName}"</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Monto a aportar ($)"
              placeholderTextColor="rgba(255,255,255,0.4)"
              keyboardType="numeric"
              value={aporte}
              onChangeText={setAporte}
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => { setContributeModal({ visible: false, goalId: '', goalName: '' }); setAporte(''); }}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirm} onPress={onContribute} disabled={saving}>
                {saving ? <ActivityIndicator color={theme.colors.primary} size="small" /> : <Text style={styles.modalConfirmText}>Confirmar</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.primary },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginTop: 50, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '800', color: theme.colors.white },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.secondary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, gap: 4 },
  addBtnText: { color: theme.colors.white, fontWeight: '700' },

  card: { backgroundColor: theme.colors.petroleum, padding: 20, borderRadius: 20, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  goalName: { color: theme.colors.white, fontSize: 18, fontWeight: '700', flex: 1 },
  deleteBtn: { padding: 8, backgroundColor: 'rgba(244,67,54,0.1)', borderRadius: 12 },

  progressSection: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 14 },
  progressCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(20,141,141,0.3)', borderWidth: 3, borderColor: theme.colors.secondary, justifyContent: 'center', alignItems: 'center' },
  progressPct: { color: theme.colors.secondary, fontWeight: '900', fontSize: 16 },
  progressInfo: { flex: 1 },
  progressAmount: { color: theme.colors.white, fontWeight: '700', fontSize: 15, marginBottom: 6 },
  progressSub: { color: 'rgba(255,255,255,0.5)', fontSize: 12 },

  barBg: { height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 6, marginBottom: 14 },
  barFill: { height: 8, borderRadius: 6, backgroundColor: theme.colors.secondary },

  contributeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: theme.colors.accent, padding: 14, borderRadius: 14 },
  contributeBtnText: { color: theme.colors.primary, fontWeight: '700', fontSize: 15 },
  completedBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: 'rgba(76,175,80,0.2)', padding: 12, borderRadius: 14, borderWidth: 1, borderColor: '#4CAF50' },
  completedText: { color: '#4CAF50', fontWeight: '700', fontSize: 15 },

  suggestionCard: { flexDirection: 'row', backgroundColor: 'rgba(239, 188, 117, 0.1)', padding: 16, borderRadius: 16, marginHorizontal: 24, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(239, 188, 117, 0.3)', alignItems: 'center' },
  suggestionTitle: { color: theme.colors.accent, fontSize: 15, fontWeight: '700', marginBottom: 4 },
  suggestionText: { color: 'rgba(255,255,255,0.8)', fontSize: 13, lineHeight: 18 },

  emptyContainer: { alignItems: 'center', marginTop: 80 },
  empty: { color: theme.colors.light, fontSize: 18, fontWeight: '600', marginBottom: 8, textAlign: 'center' },
  emptySub: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modal: { backgroundColor: theme.colors.petroleum, padding: 28, borderTopLeftRadius: 28, borderTopRightRadius: 28 },
  modalTitle: { color: theme.colors.white, fontSize: 18, fontWeight: '700', marginBottom: 20 },
  modalInput: { backgroundColor: 'rgba(255,255,255,0.1)', color: theme.colors.white, borderRadius: 16, padding: 18, fontSize: 18, marginBottom: 20 },
  modalActions: { flexDirection: 'row', gap: 12 },
  modalCancel: { flex: 1, padding: 16, borderRadius: 14, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)' },
  modalCancelText: { color: theme.colors.white, fontWeight: '600' },
  modalConfirm: { flex: 1, padding: 16, borderRadius: 14, alignItems: 'center', backgroundColor: theme.colors.accent },
  modalConfirmText: { color: theme.colors.primary, fontWeight: '700' },
});
