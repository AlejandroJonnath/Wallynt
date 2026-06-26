import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert, Modal } from 'react-native';
import { api } from '@core/api';
import { theme } from '@shared/theme';
import { Ionicons } from '@expo/vector-icons';

const ROL_COLORS: Record<string, string> = {
  'ESTUDIANTE': theme.colors.secondary,
  'ADMIN': '#FFC107',
  'SUPERADMIN': '#F44336',
};

export default function AdminUsersScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newRole, setNewRole] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data);
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'Solo SuperAdmin puede ver esta sección');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openEdit = (user: any) => {
    setSelectedUser(user);
    setNewRole(user.rol);
    setModalVisible(true);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;
    setSaving(true);
    try {
      await api.patch(`/admin/users/${selectedUser.id}/role`, { rol: newRole });
      Alert.alert('Éxito', 'Rol actualizado correctamente');
      setModalVisible(false);
      load();
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'No se pudo actualizar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (user: any) => {
    Alert.alert(
      'Eliminar usuario',
      `¿Estás seguro de eliminar a "${user.nombre || user.correo}"? Esta acción es irreversible.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar', style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/admin/users/${user.id}`);
              Alert.alert('Eliminado', 'Usuario eliminado de la plataforma');
              load();
            } catch (e: any) {
              Alert.alert('Error', e.response?.data?.message || 'No se pudo eliminar');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={theme.colors.secondary} /></View>;
  }

  const students = users.filter(u => u.rol === 'ESTUDIANTE');
  const admins = users.filter(u => u.rol === 'ADMIN' || u.rol === 'SUPERADMIN');

  const UserCard = ({ user }: { user: any }) => (
    <View style={styles.userCard}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{(user.nombre || user.correo || '?')[0].toUpperCase()}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.userName}>{user.nombre || 'Sin nombre'}</Text>
        <Text style={styles.userEmail}>{user.correo}</Text>
        <View style={[styles.roleBadge, { backgroundColor: `${ROL_COLORS[user.rol] || '#fff'}22` }]}>
          <Text style={[styles.roleText, { color: ROL_COLORS[user.rol] || '#fff' }]}>{user.rol}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => openEdit(user)}>
          <Ionicons name="pencil" size={18} color={theme.colors.secondary} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => handleDelete(user)}>
          <Ionicons name="trash" size={18} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.primary }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <Text style={styles.title}>Gestión de Usuarios</Text>
        <Text style={styles.subtitle}>{users.length} usuarios registrados</Text>

        {admins.length > 0 && (
          <>
            <Text style={styles.section}>Administradores ({admins.length})</Text>
            {admins.map(u => <UserCard key={u.id} user={u} />)}
          </>
        )}

        <Text style={styles.section}>Estudiantes ({students.length})</Text>
        {students.map(u => <UserCard key={u.id} user={u} />)}
        {students.length === 0 && (
          <Text style={styles.empty}>No hay estudiantes registrados</Text>
        )}
      </ScrollView>

      {/* Modal de edición */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Cambiar Rol</Text>
            <Text style={styles.modalSubtitle}>{selectedUser?.nombre || selectedUser?.correo}</Text>

            <View style={{ gap: 10, marginVertical: 20 }}>
              {['ESTUDIANTE', 'ADMIN', 'SUPERADMIN'].map(r => (
                <TouchableOpacity
                  key={r}
                  style={[styles.roleOption, newRole === r && { borderColor: ROL_COLORS[r] || theme.colors.secondary, backgroundColor: `${ROL_COLORS[r] || theme.colors.secondary}15` }]}
                  onPress={() => setNewRole(r)}
                >
                  <Ionicons
                    name={r === 'ESTUDIANTE' ? 'school' : r === 'ADMIN' ? 'shield' : 'star'}
                    size={20}
                    color={newRole === r ? (ROL_COLORS[r] || theme.colors.secondary) : 'rgba(255,255,255,0.5)'}
                  />
                  <Text style={[styles.roleOptionText, newRole === r && { color: ROL_COLORS[r] || theme.colors.secondary }]}>{r}</Text>
                  {newRole === r && <Ionicons name="checkmark-circle" size={20} color={ROL_COLORS[r] || theme.colors.secondary} />}
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleUpdateRole} disabled={saving}>
                {saving ? <ActivityIndicator color={theme.colors.primary} /> : <Text style={styles.saveText}>Guardar</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 26, fontWeight: '800', color: theme.colors.white, marginTop: 8, marginBottom: 6 },
  subtitle: { color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 24 },
  section: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginTop: 8 },
  empty: { color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: 20 },
  userCard: { backgroundColor: theme.colors.petroleum, borderRadius: 18, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(20,141,141,0.2)', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: theme.colors.secondary, fontWeight: '800', fontSize: 18 },
  userName: { color: theme.colors.white, fontSize: 15, fontWeight: '700' },
  userEmail: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 2 },
  roleBadge: { marginTop: 6, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start' },
  roleText: { fontSize: 11, fontWeight: '700' },
  actions: { gap: 8 },
  actionBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(20,141,141,0.1)', justifyContent: 'center', alignItems: 'center' },
  deleteBtn: { backgroundColor: 'rgba(244,67,54,0.1)' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modal: { backgroundColor: theme.colors.petroleum, padding: 28, borderTopLeftRadius: 28, borderTopRightRadius: 28 },
  modalTitle: { color: theme.colors.white, fontSize: 20, fontWeight: '800', marginBottom: 4 },
  modalSubtitle: { color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 4 },
  roleOption: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  roleOptionText: { flex: 1, color: 'rgba(255,255,255,0.6)', fontSize: 15, fontWeight: '600' },
  cancelBtn: { flex: 1, padding: 16, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center' },
  cancelText: { color: theme.colors.white, fontWeight: '600' },
  saveBtn: { flex: 1, padding: 16, borderRadius: 16, backgroundColor: theme.colors.secondary, alignItems: 'center' },
  saveText: { color: theme.colors.primary, fontWeight: '800' },
});
