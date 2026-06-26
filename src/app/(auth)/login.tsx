import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { theme } from '../../constants/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      Alert.alert('Error', error.message);
    }
    // Si es exitoso, el RootLayout reacciona al cambio de sesión
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wallynt</Text>
      <Text style={styles.subtitle}>Tu asistente financiero personal</Text>
      
      <View style={styles.form}>
        <TextInput 
          style={styles.input} 
          placeholder="Correo electrónico" 
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput 
          style={styles.input} 
          placeholder="Contraseña" 
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity style={styles.button} onPress={onSignIn} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Ingresar</Text>}
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => router.push('/(auth)/register')} style={styles.linkContainer}>
          <Text style={styles.linkText}>¿No tienes cuenta? Regístrate aquí</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.primary, padding: 24, justifyContent: 'center' },
  title: { fontSize: 40, fontWeight: '900', color: theme.colors.white, marginBottom: 8, textAlign: 'center', letterSpacing: 1 },
  subtitle: { fontSize: 16, color: theme.colors.light, marginBottom: 48, textAlign: 'center' },
  form: { backgroundColor: theme.colors.petroleum, padding: 24, borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  input: { backgroundColor: 'rgba(255,255,255,0.1)', color: theme.colors.white, borderRadius: 16, padding: 18, marginBottom: 16, fontSize: 16 },
  button: { backgroundColor: theme.colors.secondary, padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { color: theme.colors.white, fontSize: 16, fontWeight: '700' },
  linkContainer: { marginTop: 24, alignItems: 'center' },
  linkText: { color: theme.colors.accent, fontSize: 14, fontWeight: '500' }
});
