import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView,
  Platform, Animated, StatusBar, ScrollView, Switch
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@core/supabase';
import { api } from '@core/api';
import { theme } from '@shared/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useToast } from '@shared/components/Toast';

export default function RegisterScreen() {
  const [step, setStep] = useState(1); // Paso 1: datos de cuenta, Paso 2: perfil financiero
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [trabaja, setTrabaja] = useState(false);
  const [ingresoMensual, setIngresoMensual] = useState('');
  const [gastoEstimado, setGastoEstimado] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showError, showWarning, showInfo, showWelcome } = useToast();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  const goToStep2 = () => {
    if (!email || !password || !name) {
      showWarning('Campos incompletos', 'Completa tu nombre, correo y contraseña para continuar.');
      return;
    }
    if (password.length < 6) {
      showWarning('Contraseña muy corta', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setStep(2);
  };

  const onSignUp = async () => {
    const ingreso = parseFloat(ingresoMensual);
    const gasto = parseFloat(gastoEstimado);

    if (!ingresoMensual || isNaN(ingreso) || ingreso < 5) {
      showWarning('Ingreso inválido', 'El ingreso mensual debe ser al menos $5.');
      return;
    }
    if (!gastoEstimado || isNaN(gasto) || gasto <= 0) {
      showWarning('Gasto estimado requerido', 'Ingresa tu gasto mensual estimado.');
      return;
    }

    setLoading(true);

    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });

    if (authError) {
      showError('Error al registrarse', authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      const accessToken = authData.session?.access_token;

      if (!accessToken) {
        showInfo(
          'Confirma tu correo',
          'Te enviamos un enlace de confirmación. Una vez confirmado, inicia sesión.',
        );
        setLoading(false);
        setTimeout(() => router.replace('/(auth)/login'), 3500);
        return;
      }

      try {
        await api.post('/users/profile', {
          nombre: name,
          trabaja,
          ingreso_mensual: ingreso,
          gasto_estimado: gasto,
        }, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        showWelcome(
          `¡Bienvenido a Wallynt, ${name.split(' ')[0]}!`,
          'Tu cuenta ha sido creada. Ya puedes empezar a gestionar tus finanzas.',
        );
        setTimeout(() => router.replace('/(auth)/login'), 2000);
      } catch (e: any) {
        showError('Error guardando perfil', e?.response?.data?.message || e.message);
      }
    }
    setLoading(false);
  };

  return (
    <LinearGradient
      colors={[theme.colors.primary, '#0B202E', theme.colors.petroleum]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          <Animated.View style={[styles.headerSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <TouchableOpacity style={styles.backButton} onPress={() => step === 1 ? router.back() : setStep(1)}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            {/* Indicador de pasos */}
            <View style={styles.stepsRow}>
              <View style={[styles.stepDot, step >= 1 && styles.stepDotActive]} />
              <View style={[styles.stepLine, step >= 2 && styles.stepLineActive]} />
              <View style={[styles.stepDot, step >= 2 && styles.stepDotActive]} />
            </View>

            <Text style={styles.headerTitle}>
              {step === 1 ? 'Crear cuenta' : 'Tu perfil financiero'}
            </Text>
            <Text style={styles.headerSub}>
              {step === 1 ? 'Únete a Wallynt y toma el control.' : 'Necesitamos esto para personalizar tu experiencia.'}
            </Text>
          </Animated.View>

          <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

            {step === 1 ? (
              <>
                {/* Nombre */}
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={20} color="rgba(255,255,255,0.5)" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input} placeholder="Tu nombre completo" placeholderTextColor="rgba(255,255,255,0.4)"
                    value={name} onChangeText={setName} autoCapitalize="words"
                  />
                </View>

                {/* Email */}
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={20} color="rgba(255,255,255,0.5)" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input} placeholder="Correo electrónico" placeholderTextColor="rgba(255,255,255,0.4)"
                    value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address"
                  />
                </View>

                {/* Contraseña */}
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color="rgba(255,255,255,0.5)" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { flex: 1 }]} placeholder="Contraseña (mín. 6 caracteres)" placeholderTextColor="rgba(255,255,255,0.4)"
                    value={password} onChangeText={setPassword} secureTextEntry={!showPass}
                  />
                  <TouchableOpacity onPress={() => setShowPass(!showPass)} style={{ paddingRight: 16 }}>
                    <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={20} color="rgba(255,255,255,0.5)" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={goToStep2} activeOpacity={0.85}>
                  <LinearGradient
                    colors={['#EFBC75', '#DDA24A']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>Continuar</Text>
                    <Ionicons name="arrow-forward" size={18} color="#0B202E" style={{ marginLeft: 8 }} />
                  </LinearGradient>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* ¿Trabaja? */}
                <View style={styles.switchRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.switchLabel}>¿Actualmente trabajas?</Text>
                    <Text style={styles.switchSub}>Incluye empleos, freelance o negocios propios</Text>
                  </View>
                  <Switch
                    value={trabaja}
                    onValueChange={setTrabaja}
                    trackColor={{ false: 'rgba(255,255,255,0.1)', true: theme.colors.accent }}
                    thumbColor={trabaja ? '#0B202E' : 'rgba(255,255,255,0.5)'}
                  />
                </View>

                {/* Ingreso mensual */}
                <Text style={styles.fieldLabel}>Ingreso mensual estimado ($)</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="cash-outline" size={20} color="rgba(255,255,255,0.5)" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Ej: 500.00"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={ingresoMensual}
                    onChangeText={setIngresoMensual}
                    keyboardType="decimal-pad"
                  />
                </View>
                <Text style={styles.hint}>Incluye sueldo, mesada, préstamos recurrentes, etc.</Text>

                {/* Gasto mensual estimado */}
                <Text style={styles.fieldLabel}>Gasto mensual estimado ($)</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="receipt-outline" size={20} color="rgba(255,255,255,0.5)" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Ej: 350.00"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={gastoEstimado}
                    onChangeText={setGastoEstimado}
                    keyboardType="decimal-pad"
                  />
                </View>
                <Text style={styles.hint}>Transporte, comida, servicios, entretenimiento, etc.</Text>

                <TouchableOpacity onPress={onSignUp} disabled={loading} activeOpacity={0.85} style={{ marginTop: 8 }}>
                  <LinearGradient
                    colors={['#EFBC75', '#DDA24A']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    style={styles.button}
                  >
                    {loading
                      ? <ActivityIndicator color="#0B202E" />
                      : <>
                        <Text style={styles.buttonText}>Crear mi cuenta</Text>
                        <Ionicons name="checkmark-circle" size={18} color="#0B202E" style={{ marginLeft: 8 }} />
                      </>
                    }
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}

          </Animated.View>

        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingBottom: 40 },

  decorativeCircle1: { position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(239, 188, 117, 0.08)', top: -100, right: -100 },
  decorativeCircle2: { position: 'absolute', width: 250, height: 250, borderRadius: 125, backgroundColor: 'rgba(20, 141, 141, 0.1)', bottom: -50, left: -50 },

  headerSection: { marginBottom: 32, marginTop: 60 },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },

  stepsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  stepDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.2)' },
  stepDotActive: { backgroundColor: theme.colors.accent },
  stepLine: { flex: 1, height: 2, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: 8 },
  stepLineActive: { backgroundColor: theme.colors.accent },

  headerTitle: { color: theme.colors.white, fontSize: 34, fontWeight: '800', marginBottom: 8 },
  headerSub: { color: 'rgba(255,255,255,0.6)', fontSize: 15, fontWeight: '400' },

  card: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 28, padding: 28, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },

  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 16, marginBottom: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  inputIcon: { paddingLeft: 16, paddingRight: 8 },
  input: { flex: 1, color: '#fff', fontSize: 16, paddingVertical: 18, paddingRight: 16 },

  button: { borderRadius: 16, paddingVertical: 18, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: 4, shadowColor: '#EFBC75', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 6 },
  buttonText: { color: '#0B202E', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },

  switchRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  switchLabel: { color: '#fff', fontSize: 15, fontWeight: '700', marginBottom: 4 },
  switchSub: { color: 'rgba(255,255,255,0.5)', fontSize: 12 },

  fieldLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600', marginBottom: 8, marginLeft: 4 },
  hint: { color: 'rgba(255,255,255,0.35)', fontSize: 12, marginBottom: 20, marginLeft: 4 },
});
