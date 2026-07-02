import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Image, KeyboardAvoidingView,
  Platform, Animated, StatusBar, Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@core/supabase';
import { theme } from '@shared/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useToast } from '@shared/components/Toast';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showError, showWarning } = useToast();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 260, useNativeDriver: true }),
    ]).start();
  }, []);

  const onSignIn = async () => {
    if (!email || !password) {
      showWarning('Campos requeridos', 'Ingresa tu correo y contraseña para continuar.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showWarning('Correo inválido', 'El formato del correo no es válido.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      showError('No pudimos iniciar sesión', error.message);
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

      {/* Círculos decorativos abstractos de fondo */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        {/* Logo Section */}
        <Animated.View style={[styles.brandSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Image
            source={require('../../../assets/images/image.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>Wallynt</Text>
          <Text style={styles.tagline}>TU DINERO, BAJO CONTROL.</Text>
        </Animated.View>

        {/* Card Section */}
        <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.cardTitle}>¡Hola de nuevo!</Text>
          <Text style={styles.cardSub}>Accede para gestionar tus finanzas</Text>

          {/* Email Input */}
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color="rgba(255,255,255,0.5)" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color="rgba(255,255,255,0.5)" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Contraseña"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)} style={{ paddingRight: 16 }}>
              <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={20} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity onPress={onSignIn} disabled={loading} activeOpacity={0.85}>
            <LinearGradient
              colors={[theme.colors.secondary, '#0F6C6C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.button}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Ingresar</Text>}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>¿Nuevo en Wallynt?</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Register Button */}
          <TouchableOpacity onPress={() => router.push('/(auth)/register')} style={styles.registerBtn} activeOpacity={0.8}>
            <Text style={styles.registerText}>Crear una cuenta gratis</Text>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.footer}>PLANIFICA · AHORRA · LOGRA</Text>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  decorativeCircle1: {
    position: 'absolute', width: 300, height: 300,
    borderRadius: 150, backgroundColor: 'rgba(20, 141, 141, 0.15)',
    top: -50, left: -100
  },
  decorativeCircle2: {
    position: 'absolute', width: 250, height: 250,
    borderRadius: 125, backgroundColor: 'rgba(239, 188, 117, 0.08)',
    bottom: 50, right: -80
  },

  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },

  brandSection: { alignItems: 'center', marginBottom: 40, marginTop: 40 },
  logo: { width: 120, height: 120, marginBottom: 16, borderRadius: 24, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 5 } },
  appName: { color: theme.colors.white, fontSize: 36, fontWeight: '900', letterSpacing: 1.5, marginBottom: 4 },
  tagline: { color: theme.colors.accent, fontSize: 12, fontWeight: '700', letterSpacing: 2, opacity: 0.9 },

  card: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 28, padding: 28,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  cardTitle: { color: '#fff', fontSize: 26, fontWeight: '800', marginBottom: 6 },
  cardSub: { color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 28 },

  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16, marginBottom: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
  },
  inputIcon: { paddingLeft: 16, paddingRight: 8 },
  input: { flex: 1, color: '#fff', fontSize: 16, paddingVertical: 18, paddingRight: 16 },

  button: {
    borderRadius: 16, paddingVertical: 18, alignItems: 'center', marginTop: 12,
    shadowColor: theme.colors.secondary, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 15, elevation: 6,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },

  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 24, gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  dividerText: { color: 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: '500' },

  registerBtn: { borderRadius: 16, paddingVertical: 18, alignItems: 'center', backgroundColor: 'rgba(239, 188, 117, 0.1)' },
  registerText: { color: theme.colors.accent, fontSize: 15, fontWeight: '700' },

  footer: { textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 12, marginTop: 40, letterSpacing: 2 },
});
