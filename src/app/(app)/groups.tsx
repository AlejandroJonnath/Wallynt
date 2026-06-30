import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, TextInput, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '@core/api';
import { theme } from '@shared/theme';
import { Ionicons } from '@expo/vector-icons';
import { useToast } from '@shared/components/Toast';

export default function GroupsScreen() {
  const router = useRouter();
  const { showError, showSuccess } = useToast();
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModal, setCreateModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupEmail, setGroupEmail] = useState('');
  const [saving, setSaving] = useState(false);

  const [requestsCount, setRequestsCount] = useState(0);

  useEffect(() => { loadGroups(); loadRequests(); }, []);

  const loadRequests = async () => {
    try {
      const res = await api.get('/groups/requests');
      const invitations = res.data?.invitations || [];
      const expenses = res.data?.expenses || [];
      setRequestsCount(invitations.length + expenses.length);
    } catch (e) {}
  };

  const loadGroups = async () => {
    try {
      const res = await api.get('/groups');
      setGroups(res.data);
    } finally {
      setLoading(false);
    }
  };

  const onCreate = async () => {
    if (!groupName.trim()) { showError('Error', 'Ingresa un nombre'); return; }
    setSaving(true);
    try {
      await api.post('/groups', { nombre: groupName, correo_invitado: groupEmail });
      setCreateModal(false);
      setGroupName('');
      setGroupEmail('');
      loadGroups();
      showSuccess('Éxito', 'Grupo creado');
    } catch (e: any) {
      const err = e.response?.data?.message;
      const msg = Array.isArray(err) ? err.join(', ') : err || 'No se pudo crear el grupo';
      showError('Error', msg);
    } finally {
      setSaving(false);
    }
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({ pathname: '/(app)/group-detail', params: { id: item.id, nombre: item.nombre } })}
    >
      <View style={styles.cardLeft}>
        <View style={styles.groupAvatar}>
          <Text style={styles.groupAvatarText}>{item.nombre?.[0]?.toUpperCase() || '?'}</Text>
        </View>
        <View>
          <Text style={styles.groupName}>{item.nombre}</Text>
          <Text style={styles.groupSub}>Ver gastos y miembros →</Text>
        </View>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Grupos</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setCreateModal(true)}>
          <Text style={styles.addBtnText}>+ Crear</Text>
        </TouchableOpacity>
      </View>

      {requestsCount > 0 && (
        <TouchableOpacity style={styles.requestsBanner} onPress={() => router.push('/(app)/group-requests')}>
          <Ionicons name="notifications" size={20} color={theme.colors.accent} />
          <Text style={styles.requestsBannerText}>Tienes {requestsCount} solicitudes pendientes</Text>
          <Text style={styles.requestsBannerArrow}>→</Text>
        </TouchableOpacity>
      )}

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.secondary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={groups}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>👥</Text>
              <Text style={styles.empty}>No tienes grupos</Text>
              <Text style={styles.emptySub}>Crea un grupo con tus compañeros</Text>
            </View>
          }
        />
      )}

      <Modal visible={createModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Nuevo Grupo</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Nombre del grupo (Ej. Cuarto 204)"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={groupName}
              onChangeText={setGroupName}
              autoFocus
            />
            <TextInput
              style={[styles.modalInput, { marginBottom: 24 }]}
              placeholder="Correo de integrante (opcional)"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={groupEmail}
              onChangeText={setGroupEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => { setCreateModal(false); setGroupName(''); setGroupEmail(''); }}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirm} onPress={onCreate} disabled={saving}>
                {saving ? <ActivityIndicator color={theme.colors.primary} size="small" /> : <Text style={styles.modalConfirmText}>Crear</Text>}
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
  addBtn: { backgroundColor: theme.colors.secondary,    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#0B202E',
    fontWeight: '700',
    fontSize: 14,
  },
  requestsBanner: {
    backgroundColor: 'rgba(239, 188, 117, 0.1)',
    marginHorizontal: 24,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 188, 117, 0.3)',
  },
  requestsBannerText: {
    flex: 1,
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  requestsBannerArrow: {
    color: theme.colors.accent,
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: { backgroundColor: theme.colors.petroleum, padding: 18, borderRadius: 20, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  groupAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: theme.colors.secondary, justifyContent: 'center', alignItems: 'center' },
  groupAvatarText: { color: theme.colors.white, fontSize: 20, fontWeight: '800' },
  groupName: { color: theme.colors.white, fontSize: 17, fontWeight: '700' },
  groupSub: { color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 2 },
  arrow: { color: theme.colors.accent, fontSize: 28, fontWeight: '300' },

  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyEmoji: { fontSize: 60, marginBottom: 16 },
  empty: { color: theme.colors.light, fontSize: 18, fontWeight: '600', marginBottom: 8 },
  emptySub: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modal: { backgroundColor: theme.colors.petroleum, padding: 28, borderTopLeftRadius: 28, borderTopRightRadius: 28 },
  modalTitle: { color: theme.colors.white, fontSize: 18, fontWeight: '700', marginBottom: 20 },
  modalInput: { backgroundColor: 'rgba(255,255,255,0.1)', color: theme.colors.white, borderRadius: 16, padding: 18, fontSize: 16, marginBottom: 20 },
  modalActions: { flexDirection: 'row', gap: 12 },
  modalCancel: { flex: 1, padding: 16, borderRadius: 14, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)' },
  modalCancelText: { color: theme.colors.white, fontWeight: '600' },
  modalConfirm: { flex: 1, padding: 16, borderRadius: 14, alignItems: 'center', backgroundColor: theme.colors.accent },
  modalConfirmText: { color: theme.colors.primary, fontWeight: '700' },
});
