import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '@core/api';
import { theme } from '@shared/theme';

export default function FinancialProfileScreen() {
  const [nombre, setNombre] = useState('');
  const [trabaja, setTrabaja] = useState(false);
  const [ingreso, setIngreso] = useState('');
  const [gasto, setGasto] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async () => {
    if (!nombre || !ingreso || !gasto) {
      Alert.alert('Error', 'Por favor llena todos los campos obligatorios');
      return;
    }

    if (Number(ingreso) < 6) {
      Alert.alert('Aviso', 'Se necesita un mínimo de 6 dólares para usar la app');
      return;
    }

    if (Number(gasto) > Number(ingreso)) {
      Alert.alert('Aviso', 'El gasto mensual no puede ser mayor que tu ingreso mensual');
      return;
    }

    setLoading(true);
    try {
      await api.post('/users/profile', {
        nombre,
        trabaja,
        ingreso_mensual: Number(ingreso),
        gasto_estimado: Number(gasto)
      });
      router.replace('/(app)/home');
    } catch (error: any) {
      const msg = error.response?.data?.message;
      const displayMsg = Array.isArray(msg) ? msg.join('\n') : msg;
      Alert.alert('Error', displayMsg || 'Error guardando perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil Financiero</Text>
      <Text style={styles.subtitle}>Configura tus finanzas iniciales</Text>
      
      <View style={styles.form}>
        <TextInput 
          style={styles.input} 
          placeholder="Tu Nombre (Ej. Juan Pérez)" 
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={nombre}
          onChangeText={setNombre}
        />
        
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>¿Trabajas actualmente?</Text>
          <Switch 
            value={trabaja}
            onValueChange={setTrabaja}
            trackColor={{ false: 'rgba(255,255,255,0.1)', true: theme.colors.secondary }}
            thumbColor={theme.colors.white}
          />
        </View>

        <TextInput 
          style={styles.input} 
          placeholder="Ingreso mensual estimado ($)" 
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={ingreso}
          onChangeText={setIngreso}
          keyboardType="numeric"
        />
        
        <TextInput 
          style={styles.input} 
          placeholder="Gasto mensual estimado ($)" 
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={gasto}
          onChangeText={setGasto}
          keyboardType="numeric"
        />
        
        <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color={theme.colors.primary} /> : <Text style={styles.buttonText}>Comenzar en Wallynt</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.primary, padding: 24, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: '800', color: theme.colors.white, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: theme.colors.light, marginBottom: 40, textAlign: 'center' },
  form: { backgroundColor: theme.colors.petroleum, padding: 24, borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  input: { backgroundColor: 'rgba(255,255,255,0.1)', color: theme.colors.white, borderRadius: 16, padding: 18, marginBottom: 16, fontSize: 16 },
  switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingHorizontal: 4 },
  switchLabel: { color: theme.colors.white, fontSize: 16, fontWeight: '500' },
  button: { backgroundColor: theme.colors.accent, padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 16 },
  buttonText: { color: theme.colors.primary, fontSize: 16, fontWeight: '700' },
});
