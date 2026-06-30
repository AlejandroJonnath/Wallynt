import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { api } from '@core/api';
import { theme } from '@shared/theme';
import { useAuthStore } from '@features/auth/store/useAuthStore';
import { useToast } from '@shared/components/Toast';

export default function ProfileScreen() {
  const router = useRouter();
  const { userProfile, updateProfile } = useAuthStore();
  const { showError, showSuccess } = useToast();
  
  const [nombre, setNombre] = useState(userProfile?.nombre || '');
  const [ingresoMensual, setIngresoMensual] = useState(userProfile?.ingreso_mensual?.toString() || '');
  const [gastoEstimado, setGastoEstimado] = useState(userProfile?.gasto_estimado?.toString() || '');
  const [loading, setLoading] = useState(false);

  const onSave = async () => {
    if (!nombre.trim()) {
      showError('Error', 'Ingresa tu nombre');
      return;
    }
    const ingreso = Number(ingresoMensual);
    if (isNaN(ingreso) || ingreso < 0) {
      showError('Error', 'Ingreso mensual inválido');
      return;
    }
    const gasto = Number(gastoEstimado);
    if (isNaN(gasto) || gasto < 0) {
      showError('Error', 'Gasto estimado inválido');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/users/profile', {
        nombre,
        trabaja: userProfile?.trabaja || false,
        ingreso_mensual: ingreso,
        gasto_estimado: gasto
      });
      // Actualizamos el estado global
      if (updateProfile) {
        updateProfile(res.data);
      }
      showSuccess('Éxito', 'Perfil actualizado correctamente');
      router.back();
    } catch (e: any) {
      showError('Error', e.response?.data?.message || 'No se pudo actualizar el perfil');
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
      
      <Text style={styles.title}>Mi Perfil</Text>
      <Text style={styles.subtitle}>Actualiza tu información y configuración mensual</Text>

      <Text style={styles.label}>Nombre completo</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="person" size={20} color={theme.colors.secondary} style={styles.inputIcon} />
        <TextInput
          style={styles.inputWithIcon}
          placeholder="Tu nombre"
          placeholderTextColor="rgba(255,255,255,0.4)"
          value={nombre}
          onChangeText={setNombre}
        />
      </View>

      <Text style={styles.label}>Ingreso mensual ($)</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="cash" size={20} color={theme.colors.secondary} style={styles.inputIcon} />
        <TextInput
          style={styles.inputWithIcon}
          placeholder="Ej. 500.00"
          placeholderTextColor="rgba(255,255,255,0.4)"
          keyboardType="numeric"
          value={ingresoMensual}
          onChangeText={(val) => {
            let formattedVal = val.replace(',', '.');
            if (/^\d*\.?\d*$/.test(formattedVal)) {
              setIngresoMensual(formattedVal);
            }
          }}
        />
      </View>
      <Text style={styles.hint}>Tus ingresos base (ej. sueldo, mesada)</Text>

      <Text style={styles.label}>Gasto mensual estimado ($)</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="pie-chart" size={20} color={theme.colors.secondary} style={styles.inputIcon} />
        <TextInput
          style={styles.inputWithIcon}
          placeholder="Ej. 200.00"
          placeholderTextColor="rgba(255,255,255,0.4)"
          keyboardType="numeric"
          value={gastoEstimado}
          onChangeText={(val) => {
            let formattedVal = val.replace(',', '.');
            if (/^\d*\.?\d*$/.test(formattedVal)) {
              setGastoEstimado(formattedVal);
            }
          }}
        />
      </View>
      <Text style={styles.hint}>Lo que planeas gastar en el mes</Text>

      <TouchableOpacity style={styles.button} onPress={onSave} disabled={loading}>
        {loading ? (
          <ActivityIndicator color={theme.colors.primary} />
        ) : (
          <Text style={styles.buttonText}>Guardar Cambios</Text>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.petroleum,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  inputWithIcon: {
    flex: 1,
    color: theme.colors.white,
    paddingVertical: 16,
    fontSize: 16,
  },
  input: { backgroundColor: theme.colors.petroleum, color: theme.colors.white, borderRadius: 16, padding: 16, fontSize: 16 },
  hint: { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 4, marginLeft: 4 },
  button: { alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.accent, padding: 18, borderRadius: 16, marginTop: 40 },
  buttonText: { color: theme.colors.primary, fontSize: 16, fontWeight: '700' },
});
