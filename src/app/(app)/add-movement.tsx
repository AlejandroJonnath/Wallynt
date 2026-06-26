import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator, Alert, Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { api } from '../../lib/api';
import { theme } from '../../constants/theme';

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  'Alimentación': 'fast-food', 'Transporte': 'bus', 'Educación': 'school',
  'Entretenimiento': 'game-controller', 'Compras': 'cart', 'Salud': 'medkit', 'Otros': 'ellipsis-horizontal',
};

export default function AddMovementScreen() {
  const router = useRouter();
  const [tipo, setTipo] = useState<'INGRESO' | 'GASTO'>('GASTO');
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [categoriaId, setCategoriaId] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCats, setLoadingCats] = useState(true);

  useEffect(() => {
    api.get('/categories').then(res => {
      setCategorias(res.data);
      if (res.data.length > 0) setCategoriaId(res.data[0].id);
    }).finally(() => setLoadingCats(false));
  }, []);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const onDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setFecha(selectedDate);
  };

  const onSave = async () => {
    if (!monto || !categoriaId) {
      Alert.alert('Error', 'Ingresa el monto y selecciona una categoría');
      return;
    }
    setLoading(true);
    try {
      await api.post('/movements', {
        tipo,
        monto: Number(monto),
        categoria_id: categoriaId,
        descripcion: descripcion || undefined,
        fecha: formatDate(fecha),
      });
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'No se pudo guardar');
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
      <Text style={styles.title}>Nuevo Movimiento</Text>

      {/* Toggle Ingreso / Gasto */}
      <View style={styles.toggle}>
        <TouchableOpacity
          style={[styles.toggleBtn, tipo === 'GASTO' && styles.toggleActive]}
          onPress={() => setTipo('GASTO')}
        >
          <Ionicons name="arrow-down-circle" size={18} color={tipo === 'GASTO' ? theme.colors.white : 'rgba(255,255,255,0.5)'} />
          <Text style={[styles.toggleText, tipo === 'GASTO' && styles.toggleActiveText]}>Gasto</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, tipo === 'INGRESO' && styles.toggleActiveGreen]}
          onPress={() => setTipo('INGRESO')}
        >
          <Ionicons name="arrow-up-circle" size={18} color={tipo === 'INGRESO' ? theme.colors.white : 'rgba(255,255,255,0.5)'} />
          <Text style={[styles.toggleText, tipo === 'INGRESO' && styles.toggleActiveText]}>Ingreso</Text>
        </TouchableOpacity>
      </View>

      {/* Monto */}
      <Text style={styles.label}>Monto ($)</Text>
      <TextInput
        style={styles.input}
        placeholder="0.00"
        placeholderTextColor="rgba(255,255,255,0.4)"
        keyboardType="numeric"
        value={monto}
        onChangeText={setMonto}
      />

      {/* Categoría */}
      <Text style={styles.label}>Categoría</Text>
      {loadingCats ? (
        <ActivityIndicator color={theme.colors.secondary} />
      ) : (
        <View style={styles.catGrid}>
          {categorias.map(cat => {
            const iconName = CATEGORY_ICONS[cat.nombre] || 'ellipsis-horizontal';
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catChip, categoriaId === cat.id && styles.catChipActive]}
                onPress={() => setCategoriaId(cat.id)}
              >
                <Ionicons name={iconName} size={22} color={categoriaId === cat.id ? theme.colors.secondary : 'rgba(255,255,255,0.5)'} style={{ marginBottom: 4 }} />
                <Text style={[styles.catText, categoriaId === cat.id && styles.catTextActive]}>
                  {cat.nombre}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Descripción */}
      <Text style={styles.label}>Descripción (opcional)</Text>
      <TextInput
        style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
        placeholder="Ej. Almuerzo en la cafetería"
        placeholderTextColor="rgba(255,255,255,0.4)"
        multiline
        value={descripcion}
        onChangeText={setDescripcion}
      />

      {/* Fecha */}
      <Text style={styles.label}>Fecha</Text>
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
          maximumDate={new Date()}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={onSave} disabled={loading}>
        {loading ? (
          <ActivityIndicator color={theme.colors.primary} />
        ) : (
          <>
            <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
            <Text style={styles.buttonText}>Guardar Movimiento</Text>
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
  title: { fontSize: 28, fontWeight: '800', color: theme.colors.white, marginBottom: 24 },

  toggle: { flexDirection: 'row', backgroundColor: theme.colors.petroleum, borderRadius: 16, padding: 4, marginBottom: 24 },
  toggleBtn: { flex: 1, flexDirection: 'row', padding: 14, borderRadius: 14, alignItems: 'center', justifyContent: 'center', gap: 8 },
  toggleActive: { backgroundColor: theme.colors.accent },
  toggleActiveGreen: { backgroundColor: theme.colors.secondary },
  toggleText: { color: 'rgba(255,255,255,0.6)', fontWeight: '700', fontSize: 15 },
  toggleActiveText: { color: theme.colors.white },

  label: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600', marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: theme.colors.petroleum, color: theme.colors.white, borderRadius: 16, padding: 16, fontSize: 16 },

  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catChip: { backgroundColor: theme.colors.petroleum, padding: 12, borderRadius: 16, alignItems: 'center', minWidth: 80, borderWidth: 1, borderColor: 'transparent' },
  catChipActive: { borderColor: theme.colors.secondary, backgroundColor: 'rgba(20,141,141,0.2)' },
  catText: { color: 'rgba(255,255,255,0.6)', fontSize: 11, textAlign: 'center' },
  catTextActive: { color: theme.colors.secondary, fontWeight: '700' },

  dateBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.petroleum, borderRadius: 16, padding: 16, gap: 12 },
  dateBtnText: { flex: 1, color: theme.colors.white, fontSize: 16, fontWeight: '600' },

  button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: theme.colors.accent, padding: 18, borderRadius: 16, marginTop: 32 },
  buttonText: { color: theme.colors.primary, fontSize: 16, fontWeight: '700' },
});
