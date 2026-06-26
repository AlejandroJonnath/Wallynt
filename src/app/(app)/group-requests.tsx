import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '@core/api';
import { theme } from '@shared/theme';
import { Ionicons } from '@expo/vector-icons';

export default function GroupRequestsScreen() {
  const router = useRouter();
  const [invitations, setInvitations] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadRequests(); }, []);

  const loadRequests = async () => {
    try {
      const res = await api.get('/groups/requests');
      setInvitations(res.data.invitaciones || []);
      setExpenses(res.data.gastos || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const respondInvitation = async (groupId: string, accept: boolean) => {
    try {
      await api.post(`/groups/${groupId}/invitations/respond`, { accept });
      Alert.alert(accept ? 'Aceptado' : 'Rechazado', 'Respuesta enviada');
      loadRequests();
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'Error al procesar solicitud');
    }
  };

  const respondExpense = async (approvalId: string, accept: boolean) => {
    try {
      await api.post(`/groups/expenses/respond/${approvalId}`, { accept });
      Alert.alert(accept ? 'Aprobado' : 'Rechazado', accept ? 'El gasto fue descontado de tu saldo' : 'Gasto rechazado');
      loadRequests();
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'Error al procesar solicitud');
    }
  };

  const renderInvitation = ({ item }: any) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>Invitación a grupo</Text>
        <Text style={styles.cardDesc}>
          <Text style={{ fontWeight: 'bold', color: theme.colors.white }}>{item.grupos_gastos.usuarios?.nombre || 'Alguien'}</Text> te invitó a unirte a "{item.grupos_gastos.nombre}"
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.btn, styles.btnReject]} onPress={() => respondInvitation(item.grupo_id, false)}>
          <Ionicons name="close" size={20} color="#F44336" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnAccept]} onPress={() => respondInvitation(item.grupo_id, true)}>
          <Ionicons name="checkmark" size={20} color="#4CAF50" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderExpense = ({ item }: any) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>Dividir gasto</Text>
        <Text style={styles.cardDesc}>
          <Text style={{ fontWeight: 'bold', color: theme.colors.white }}>{item.gastos_compartidos.usuarios?.nombre || 'Alguien'}</Text> pagó {item.gastos_compartidos.descripcion} en "{item.gastos_compartidos.grupos_gastos.nombre}".
        </Text>
        <Text style={styles.amountText}>Tu parte: ${Number(item.monto_dividido).toFixed(2)}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.btn, styles.btnReject]} onPress={() => respondExpense(item.id, false)}>
          <Ionicons name="close" size={20} color="#F44336" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnAccept]} onPress={() => respondExpense(item.id, true)}>
          <Ionicons name="checkmark" size={20} color="#4CAF50" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Solicitudes Pendientes</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.secondary} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView style={{ flex: 1 }}>
          {(invitations.length === 0 && expenses.length === 0) ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="checkmark-done-circle-outline" size={60} color="rgba(255,255,255,0.2)" />
              <Text style={styles.empty}>Todo al día</Text>
              <Text style={styles.emptySub}>No tienes solicitudes pendientes</Text>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              {invitations.length > 0 && (
                <View style={{ paddingHorizontal: 24, marginBottom: 20 }}>
                  <Text style={styles.sectionTitle}>Nuevos Grupos</Text>
                  <FlatList
                    data={invitations}
                    keyExtractor={i => i.grupo_id}
                    renderItem={renderInvitation}
                    scrollEnabled={false}
                  />
                </View>
              )}

              {expenses.length > 0 && (
                <View style={{ paddingHorizontal: 24, marginBottom: 20 }}>
                  <Text style={styles.sectionTitle}>Gastos por Pagar</Text>
                  <FlatList
                    data={expenses}
                    keyExtractor={i => i.id}
                    renderItem={renderExpense}
                    scrollEnabled={false}
                  />
                </View>
              )}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.primary },
  header: { marginTop: 50, marginBottom: 20 },
  back: { marginHorizontal: 24, marginBottom: 12 },
  backText: { color: theme.colors.secondary, fontSize: 16, fontWeight: '600' },
  title: { fontSize: 28, fontWeight: '800', color: theme.colors.white, marginHorizontal: 24 },
  
  sectionTitle: { color: theme.colors.accent, fontSize: 16, fontWeight: '700', marginBottom: 12, marginTop: 10 },
  
  card: { backgroundColor: theme.colors.petroleum, padding: 18, borderRadius: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
  cardTitle: { color: theme.colors.secondary, fontSize: 14, fontWeight: '700', marginBottom: 4 },
  cardDesc: { color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 20 },
  amountText: { color: theme.colors.accent, fontSize: 16, fontWeight: '800', marginTop: 8 },
  
  actions: { flexDirection: 'row', gap: 8, marginLeft: 12 },
  btn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)' },
  btnReject: { borderWidth: 1, borderColor: 'rgba(244, 67, 54, 0.3)' },
  btnAccept: { borderWidth: 1, borderColor: 'rgba(76, 175, 80, 0.3)' },

  emptyContainer: { alignItems: 'center', marginTop: 80 },
  empty: { color: theme.colors.light, fontSize: 18, fontWeight: '600', marginBottom: 8, marginTop: 16 },
  emptySub: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },
});
