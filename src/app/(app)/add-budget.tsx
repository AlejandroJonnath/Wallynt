import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../lib/api';
import { theme } from '../../constants/theme';

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  'Alimentación': 'fast-food', 'Transporte': 'bus', 'Educación': 'school',
  'Entretenimiento': 'game-controller', 'Compras': 'cart', 'Salud': 'medkit', 'Otros': 'ellipsis-horizontal',
};

export default function AddBudgetScreen() {
  const router = useRouter();
  const [categorias, setCategorias] = useState<any[]>([]);
  const [categoriaId, setCategoriaId] = useState('');
  const [limite, setLimite] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCats, setLoadingCats] = useState(true);

  useEffect(() => {
    api.get('/categories').then(res => {
      setCategorias(res.data);
      if (res.data.length > 0) setCategoriaId(res.data[0].id);
    }).finally(() => setLoadingCats(false));
  }, []);

  const onSave = async () => {
    if (!limite || !categoriaId) {
      Alert.alert('Error', 'Selecciona una categoría e ingresa el límite');
      return;
    }
    setLoading(true);
    try {
      await api.post('/budgets', { categoria_id: categoriaId, limite_monto: Number(limite) });
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'No se pudo crear el presupuesto');
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
      <Text style={styles.title}>Nuevo Presupuesto</Text>
      <Text style={styles.subtitle}>Define un límite de gasto mensual por categoría</Text>

      <Text style={styles.label}>Categoría</Text>
      {loadingCats ? <ActivityIndicator color={theme.colors.secondary} /> : (
        <View style={styles.catGrid}>
          {categorias.map(cat => {
            const iconName = CATEGORY_ICONS[cat.nombre] || 'ellipsis-horizontal';
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catChip, categoriaId === cat.id && styles.catChipActive]}
                onPress={() => setCategoriaId(cat.id)}
              >
                <Ionicons
                  name={iconName}
                  size={22}
                  color={categoriaId === cat.id ? theme.colors.secondary : 'rgba(255,255,255,0.5)'}
                  style={{ marginBottom: 4 }}
                />
                <Text style={[styles.catText, categoriaId === cat.id && styles.catTextActive]}>{cat.nombre}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <Text style={styles.label}>Límite mensual ($)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. 150.00"
        placeholderTextColor="rgba(255,255,255,0.4)"
        keyboardType="numeric"
        value={limite}
        onChangeText={setLimite}
      />

      <TouchableOpacity style={styles.button} onPress={onSave} disabled={loading}>
        {loading ? (
          <ActivityIndicator color={theme.colors.primary} />
        ) : (
          <>
            <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
            <Text style={styles.buttonText}>Crear Presupuesto</Text>
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
  subtitle: { color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 24 },
  label: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600', marginBottom: 10, marginTop: 20 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catChip: { backgroundColor: theme.colors.petroleum, padding: 12, borderRadius: 16, alignItems: 'center', minWidth: 80, borderWidth: 1, borderColor: 'transparent' },
  catChipActive: { borderColor: theme.colors.secondary, backgroundColor: 'rgba(20,141,141,0.2)' },
  catText: { color: 'rgba(255,255,255,0.6)', fontSize: 11, textAlign: 'center' },
  catTextActive: { color: theme.colors.secondary, fontWeight: '700' },
  input: { backgroundColor: theme.colors.petroleum, color: theme.colors.white, borderRadius: 16, padding: 16, fontSize: 16 },
  button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: theme.colors.accent, padding: 18, borderRadius: 16, marginTop: 32 },
  buttonText: { color: theme.colors.primary, fontSize: 16, fontWeight: '700' },
});
