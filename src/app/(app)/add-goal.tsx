import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { api } from '@core/api';
import { theme } from '@shared/theme';

export default function AddGoalScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [objetivo, setObjetivo] = useState('');
  // Default: 1 month from now
  const defaultDate = new Date();
  defaultDate.setMonth(defaultDate.getMonth() + 1);
  const [fecha, setFecha] = useState(defaultDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const onDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setFecha(selectedDate);
  };

  const onSave = async () => {
    if (!nombre.trim() || nombre.trim().length < 2) {
      Alert.alert('Error', 'El nombre debe tener al menos 2 caracteres');
      return;
    }
    if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(nombre)) {
      Alert.alert('Error', 'El nombre debe contener al menos una letra');
      return;
    }
    if (!objetivo || Number(objetivo) <= 0) {
      Alert.alert('Error', 'Ingresa un monto objetivo válido mayor a 0');
      return;
    }
    setLoading(true);
    try {
      await api.post('/goals', { nombre, monto_objetivo: Number(objetivo), fecha_objetivo: formatDate(fecha) });
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'No se pudo crear la meta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Ionicons name="arrow-back" size={20} color={theme.colors.secondary} />
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Nueva Meta</Text>
      <Text style={styles.subtitle}>Define un objetivo financiero a alcanzar</Text>

      <Text style={styles.label}>¿Qué quieres lograr?</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. Laptop, Viaje, Celular..."
        placeholderTextColor="rgba(255,255,255,0.4)"
        value={nombre}
        onChangeText={setNombre}
      />

      <Text style={styles.label}>¿Cuánto necesitas? ($)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. 900.00"
        placeholderTextColor="rgba(255,255,255,0.4)"
        keyboardType="numeric"
        value={objetivo}
        onChangeText={setObjetivo}
      />

      <Text style={styles.label}>Fecha objetivo</Text>
      <TouchableOpacity style={styles.dateBtn} onPress={() => setShowDatePicker(true)}>
        <Ionicons name="calendar" size={20} color={theme.colors.secondary} />
        <Text style={styles.dateBtnText}>{formatDate(fecha)}</Text>
        <Ionicons name="chevron-down" size={18} color="rgba(255,255,255,0.4)" />
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={fecha}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={onSave} disabled={loading}>
        {loading ? (
          <ActivityIndicator color={theme.colors.primary} />
        ) : (
          <>
            <Ionicons name="flag" size={20} color={theme.colors.primary} />
            <Text style={styles.buttonText}>Crear Meta</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.primary },
  back: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 40, marginBottom: 8 },
  backText: { color: theme.colors.secondary, fontSize: 16, fontWeight: '600' },
  title: { fontSize: 28, fontWeight: '800', color: theme.colors.white, marginBottom: 8 },
  subtitle: { color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 32 },
  label: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600', marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: theme.colors.petroleum, color: theme.colors.white, borderRadius: 16, padding: 16, fontSize: 16 },
  dateBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.petroleum, borderRadius: 16, padding: 16, gap: 12 },
  dateBtnText: { flex: 1, color: theme.colors.white, fontSize: 16, fontWeight: '600' },
  button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: theme.colors.accent, padding: 18, borderRadius: 16, marginTop: 40 },
  buttonText: { color: theme.colors.primary, fontSize: 16, fontWeight: '700' },
});
