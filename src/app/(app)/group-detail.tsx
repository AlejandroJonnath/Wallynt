import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, TextInput, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '@core/api';
import { theme } from '@shared/theme';
import { useToast } from '@shared/components/Toast';

export default function GroupDetailScreen() {
  const { id, nombre } = useLocalSearchParams<{ id: string; nombre: string }>();
  const router = useRouter();
  const { showError, showSuccess, showWarning } = useToast();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addExpenseModal, setAddExpenseModal] = useState(false);
  const [addMemberModal, setAddMemberModal] = useState(false);
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [correo, setCorreo] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setExpenses([]);
    setLoading(true);
    loadExpenses();
  }, [id]);

  const loadExpenses = async () => {
    try {
      const res = await api.get(`/groups/${id}/expenses`);
      setExpenses(res.data);
    } finally {
      setLoading(false);
    }
  };

  const onAddExpense = async (estado: string) => {
    if (!descripcion.trim() || descripcion.trim().length < 2) {
      showError('Error', 'La descripción debe tener al menos 2 caracteres');
      return;
    }
    if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(descripcion)) {
      showError('Error', 'La descripción debe contener al menos una letra');
      return;
    }
    if (!monto || Number(monto) <= 0) {
      showError('Error', 'Ingresa un monto válido mayor a 0');
      return;
    }
    setSaving(true);
    try {
      await api.post(`/groups/${id}/expenses`, { descripcion, monto: Number(monto), estado });
      setAddExpenseModal(false);
      setDescripcion(''); setMonto('');
      loadExpenses();
      showSuccess('Éxito', estado === 'PENDIENTE' ? 'Gasto guardado como borrador' : 'Gasto registrado');
    } catch (e: any) {
      const err = e.response?.data?.message;
      const msg = Array.isArray(err) ? err.join(', ') : err || 'Error al registrar gasto';
      showError('Error', msg);
    } finally {
      setSaving(false);
    }
  };

  const onConfirmExpense = (expenseId: string) => {
    Alert.alert('Confirmar gasto', '¿Seguro que deseas confirmar y dividir este gasto?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Confirmar', onPress: async () => {
          try {
            await api.post(`/groups/${id}/expenses/${expenseId}/confirm`);
            loadExpenses();
            showSuccess('Gasto confirmado');
          } catch (e: any) {
            showError('Error', e.response?.data?.message || 'No se pudo confirmar el gasto');
          }
        }
      }
    ]);
  };

  const onDeleteExpense = (expenseId: string) => {
    Alert.alert('Eliminar gasto', '¿Seguro que deseas eliminar este gasto?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
          try {
            await api.delete(`/groups/${id}/expenses/${expenseId}`);
            loadExpenses();
            showSuccess('Gasto eliminado');
          } catch (e: any) {
            showError('Error', e.response?.data?.message || 'No se pudo eliminar el gasto');
          }
        }
      }
    ]);
  };

  const onAddMember = async () => {
    if (!correo.trim()) { showError('Error', 'Ingresa el correo'); return; }
    setSaving(true);
    try {
      await api.post(`/groups/${id}/members`, { correo });
      showSuccess('¡Listo!', 'Miembro agregado correctamente');
      setAddMemberModal(false);
      setCorreo('');
    } catch (e: any) {
      const err = e.response?.data?.message;
      const msg = Array.isArray(err) ? err.join(', ') : err || 'Usuario no encontrado';
      showError('Error', msg);
    } finally {
      setSaving(false);
    }
  };

  const renderExpense = ({ item }: any) => {
    const isDraft = !item.grupo_aprobaciones_gasto || item.grupo_aprobaciones_gasto.length === 0;
    
    return (
      <View style={styles.card}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Text style={styles.expenseDesc}>{item.descripcion}</Text>
            {isDraft && <View style={styles.draftBadge}><Text style={styles.draftBadgeText}>BORRADOR</Text></View>}
          </View>
          <Text style={styles.expensePayer}>Pagó: {item.usuarios?.nombre || 'Tú'}</Text>
          {!isDraft ? (
            <Text style={styles.expenseSplit}>
              ${(item.monto / Math.max(item.grupo_aprobaciones_gasto.length, 1)).toFixed(2)} c/u ({item.grupo_aprobaciones_gasto.length} personas)
            </Text>
          ) : (
            <View style={styles.draftActions}>
              <TouchableOpacity onPress={() => onConfirmExpense(item.id)} style={styles.draftConfirmBtn}>
                <Text style={styles.draftBtnText}>Confirmar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onDeleteExpense(item.id)} style={styles.draftDeleteBtn}>
                <Text style={[styles.draftBtnText, { color: '#F44336' }]}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <Text style={styles.expenseTotal}>${Number(item.monto).toFixed(2)}</Text>
      </View>
    );
  };

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
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity style={[styles.modalConfirm, { backgroundColor: theme.colors.petroleum }]} onPress={() => onAddExpense('PENDIENTE')} disabled={saving}>
                  {saving ? <ActivityIndicator color={theme.colors.white} size="small" /> : <Text style={[styles.modalConfirmText, { color: theme.colors.white, fontSize: 13 }]}>Borrador</Text>}
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalConfirm} onPress={() => onAddExpense('ACEPTADO')} disabled={saving}>
                  {saving ? <ActivityIndicator color={theme.colors.primary} size="small" /> : <Text style={styles.modalConfirmText}>Guardar</Text>}
                </TouchableOpacity>
              </View>
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

  draftBadge: { backgroundColor: 'rgba(255, 255, 255, 0.1)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  draftBadgeText: { color: '#bbb', fontSize: 10, fontWeight: 'bold' },
  draftActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  draftConfirmBtn: { backgroundColor: 'rgba(76, 175, 80, 0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  draftDeleteBtn: { backgroundColor: 'rgba(244, 67, 54, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  draftBtnText: { color: '#4CAF50', fontSize: 12, fontWeight: '600' },

  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyEmoji: { fontSize: 50, marginBottom: 12 },
  empty: { color: 'rgba(255,255,255,0.5)', fontSize: 16 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 24 },
  modal: { backgroundColor: theme.colors.primary, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  modalTitle: { color: theme.colors.white, fontSize: 20, fontWeight: '700', marginBottom: 20 },
  modalInput: { backgroundColor: theme.colors.petroleum, color: theme.colors.white, padding: 16, borderRadius: 16, marginBottom: 12, fontSize: 16 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 12 },
  modalCancel: { padding: 16 },
  modalCancelText: { color: 'rgba(255,255,255,0.6)', fontSize: 16, fontWeight: '600' },
  modalConfirm: { backgroundColor: theme.colors.accent, paddingVertical: 16, paddingHorizontal: 24, borderRadius: 16 },
  modalConfirmText: { color: theme.colors.primary, fontSize: 16, fontWeight: '700' }
});
