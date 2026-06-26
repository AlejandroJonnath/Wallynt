import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, TextInput, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '@core/api';
import { theme } from '@shared/theme';

export default function GroupDetailScreen() {
  const { id, nombre } = useLocalSearchParams<{ id: string; nombre: string }>();
  const router = useRouter();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addExpenseModal, setAddExpenseModal] = useState(false);
  const [addMemberModal, setAddMemberModal] = useState(false);
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [correo, setCorreo] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadExpenses(); }, []);

  const loadExpenses = async () => {
    try {
      const res = await api.get(`/groups/${id}/expenses`);
      setExpenses(res.data);
    } finally {
      setLoading(false);
    }
  };

  const onAddExpense = async () => {
    if (!descripcion || !monto) { Alert.alert('Error', 'Completa todos los campos'); return; }
    setSaving(true);
    try {
      await api.post(`/groups/${id}/expenses`, { descripcion, monto: Number(monto) });
      setAddExpenseModal(false);
      setDescripcion(''); setMonto('');
      loadExpenses();
    } catch (e: any) {
      const err = e.response?.data?.message;
      const msg = Array.isArray(err) ? err.join(', ') : err || 'Error al registrar gasto';
      Alert.alert('Error', msg);
    } finally {
      setSaving(false);
    }
  };

  const onAddMember = async () => {
    if (!correo.trim()) { Alert.alert('Error', 'Ingresa el correo'); return; }
    setSaving(true);
    try {
      await api.post(`/groups/${id}/members`, { correo });
      Alert.alert('¡Listo!', 'Miembro agregado correctamente');
      setAddMemberModal(false);
      setCorreo('');
    } catch (e: any) {
      const err = e.response?.data?.message;
      const msg = Array.isArray(err) ? err.join(', ') : err || 'Usuario no encontrado';
      Alert.alert('Error', msg);
    } finally {
      setSaving(false);
    }
  };

  const renderExpense = ({ item }: any) => (
    <View style={styles.card}>
      <View>
        <Text style={styles.expenseDesc}>{item.descripcion}</Text>
        <Text style={styles.expensePayer}>Pagó: {item.usuarios?.nombre || 'Tú'}</Text>
        <Text style={styles.expenseSplit}>
          ${item.monto_por_persona?.toFixed(2)} c/u ({item.cantidad_miembros} personas)
        </Text>
      </View>
      <Text style={styles.expenseTotal}>${Number(item.monto).toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Grupos</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{nombre}</Text>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => setAddExpenseModal(true)}>
          <Text style={styles.actionBtnText}>+ Gasto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.actionBtnSecondary]} onPress={() => setAddMemberModal(true)}>
          <Text style={styles.actionBtnText}>+ Miembro</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.secondary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={item => item.id}
          renderItem={renderExpense}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🧾</Text>
              <Text style={styles.empty}>Sin gastos registrados</Text>
            </View>
          }
        />
      )}

      {/* Modal agregar gasto */}
      <Modal visible={addExpenseModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Nuevo Gasto Compartido</Text>
            <TextInput style={styles.modalInput} placeholder="Descripción (Ej. Cena)" placeholderTextColor="rgba(255,255,255,0.4)" value={descripcion} onChangeText={setDescripcion} />
            <TextInput style={styles.modalInput} placeholder="Monto total ($)" placeholderTextColor="rgba(255,255,255,0.4)" keyboardType="numeric" value={monto} onChangeText={setMonto} />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setAddExpenseModal(false)}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirm} onPress={onAddExpense} disabled={saving}>
                {saving ? <ActivityIndicator color={theme.colors.primary} size="small" /> : <Text style={styles.modalConfirmText}>Guardar</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal agregar miembro */}
      <Modal visible={addMemberModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Agregar Miembro</Text>
            <TextInput style={styles.modalInput} placeholder="Correo registrado en la app" placeholderTextColor="rgba(255,255,255,0.4)" keyboardType="email-address" value={correo} onChangeText={setCorreo} autoCapitalize="none" />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setAddMemberModal(false)}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirm} onPress={onAddMember} disabled={saving}>
                {saving ? <ActivityIndicator color={theme.colors.primary} size="small" /> : <Text style={styles.modalConfirmText}>Agregar</Text>}
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
  back: { marginTop: 50, marginHorizontal: 24, marginBottom: 4 },
  backText: { color: theme.colors.secondary, fontSize: 16, fontWeight: '600' },
  title: { fontSize: 28, fontWeight: '800', color: theme.colors.white, marginHorizontal: 24, marginBottom: 20 },
  actions: { flexDirection: 'row', gap: 12, paddingHorizontal: 24, marginBottom: 20 },
  actionBtn: { flex: 1, backgroundColor: theme.colors.accent, padding: 14, borderRadius: 16, alignItems: 'center' },
  actionBtnSecondary: { backgroundColor: theme.colors.secondary },
  actionBtnText: { color: theme.colors.primary, fontWeight: '700' },

  card: { backgroundColor: theme.colors.petroleum, padding: 18, borderRadius: 18, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  expenseDesc: { color: theme.colors.white, fontSize: 16, fontWeight: '700', marginBottom: 4 },
  expensePayer: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },
  expenseSplit: { color: theme.colors.accent, fontSize: 13, fontWeight: '600', marginTop: 2 },
  expenseTotal: { color: theme.colors.white, fontSize: 20, fontWeight: '900' },

  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyEmoji: { fontSize: 50, marginBottom: 12 },
  empty: { color: 'rgba(255,255,255,0.5)', fontSize: 16 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modal: { backgroundColor: theme.colors.petroleum, padding: 28, borderTopLeftRadius: 28, borderTopRightRadius: 28 },
  modalTitle: { color: theme.colors.white, fontSize: 18, fontWeight: '700', marginBottom: 16 },
  modalInput: { backgroundColor: 'rgba(255,255,255,0.1)', color: theme.colors.white, borderRadius: 16, padding: 16, fontSize: 16, marginBottom: 12 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  modalCancel: { flex: 1, padding: 16, borderRadius: 14, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)' },
  modalCancelText: { color: theme.colors.white, fontWeight: '600' },
  modalConfirm: { flex: 1, padding: 16, borderRadius: 14, alignItems: 'center', backgroundColor: theme.colors.accent },
  modalConfirmText: { color: theme.colors.primary, fontWeight: '700' },
});
