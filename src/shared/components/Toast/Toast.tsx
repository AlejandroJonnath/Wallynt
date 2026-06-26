import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, Animated, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// ─── Tipos ───────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'welcome';

interface ToastConfig {
  icon: keyof typeof Ionicons.glyphMap;
  gradient: [string, string];
  borderColor: string;
  label: string;
}

const TOAST_CONFIGS: Record<ToastType, ToastConfig> = {
  success: {
    icon: 'checkmark-circle',
    gradient: ['#1a472a', '#2d6a4f'],
    borderColor: '#52b788',
    label: 'Éxito',
  },
  error: {
    icon: 'close-circle',
    gradient: ['#4a0e0e', '#7b1a1a'],
    borderColor: '#e63946',
    label: 'Error',
  },
  warning: {
    icon: 'warning',
    gradient: ['#3d2c00', '#6b4c00'],
    borderColor: '#EFBC75',
    label: 'Advertencia',
  },
  info: {
    icon: 'information-circle',
    gradient: ['#0a2540', '#1a3a5c'],
    borderColor: '#4a9eff',
    label: 'Información',
  },
  welcome: {
    icon: 'sparkles',
    gradient: ['#1a0e3d', '#2d1b69'],
    borderColor: '#a855f7',
    label: '¡Bienvenido!',
  },
};

// ─── Interfaz del contexto ────────────────────────────────────────────────────

interface ShowToastOptions {
  type: ToastType;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  autoDismissMs?: number;
}

interface ToastContextValue {
  showToast: (opts: ShowToastOptions) => void;
  hideToast: () => void;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
  showWelcome: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Hook público ────────────────────────────────────────────────────────────

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

// ─── Componente visual interno ────────────────────────────────────────────────

interface ToastState extends ShowToastOptions {
  visible: boolean;
}

function ToastView({ toast, onDismiss }: { toast: ToastState; onDismiss: () => void }) {
  const slideAnim = useRef(new Animated.Value(-200)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(1)).current;

  const config = TOAST_CONFIGS[toast.type];
  const dismissMs = toast.autoDismissMs ?? 4000;

  useEffect(() => {
    if (toast.visible) {
      progressAnim.setValue(1);
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, bounciness: 7, speed: 16 }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start();

      if (dismissMs > 0 && !toast.actionLabel) {
        Animated.timing(progressAnim, { toValue: 0, duration: dismissMs, useNativeDriver: false }).start();
        const t = setTimeout(onDismiss, dismissMs);
        return () => clearTimeout(t);
      }
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: -200, duration: 220, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
      ]).start();
    }
  }, [toast.visible]);

  const progressWidth = progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  if (!toast.visible) return null;

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }], opacity: opacityAnim }]} pointerEvents="box-none">
      <LinearGradient colors={config.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.toast, { borderColor: config.borderColor }]}>
        <View style={[styles.iconContainer, { backgroundColor: `${config.borderColor}25` }]}>
          <Ionicons name={config.icon} size={26} color={config.borderColor} />
        </View>

        <View style={styles.content}>
          <Text style={[styles.label, { color: config.borderColor }]}>{config.label}</Text>
          <Text style={styles.title}>{toast.title}</Text>
          {toast.message ? <Text style={styles.message}>{toast.message}</Text> : null}
          {toast.actionLabel && toast.onAction ? (
            <TouchableOpacity onPress={() => { toast.onAction!(); onDismiss(); }} style={styles.actionBtn}>
              <Text style={[styles.actionText, { color: config.borderColor }]}>{toast.actionLabel} →</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity onPress={onDismiss} style={styles.closeBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="close" size={18} color="rgba(255,255,255,0.45)" />
        </TouchableOpacity>

        {dismissMs > 0 && !toast.actionLabel && (
          <Animated.View style={[styles.progressBar, { width: progressWidth, backgroundColor: config.borderColor }]} />
        )}
      </LinearGradient>
    </Animated.View>
  );
}

// ─── Provider (envuelve toda la app) ─────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState>({ visible: false, type: 'info', title: '' });

  const showToast = useCallback((opts: ShowToastOptions) => {
    // Si hay uno activo, cerramos rápido y abrimos el nuevo
    setToast({ visible: false, type: 'info', title: '' });
    setTimeout(() => setToast({ visible: true, ...opts }), 80);
  }, []);

  const hideToast = useCallback(() => setToast(p => ({ ...p, visible: false })), []);

  const showSuccess = useCallback((title: string, msg?: string) => showToast({ type: 'success', title, message: msg }), [showToast]);
  const showError   = useCallback((title: string, msg?: string) => showToast({ type: 'error',   title, message: msg }), [showToast]);
  const showWarning = useCallback((title: string, msg?: string) => showToast({ type: 'warning', title, message: msg }), [showToast]);
  const showInfo    = useCallback((title: string, msg?: string) => showToast({ type: 'info',    title, message: msg }), [showToast]);
  const showWelcome = useCallback((title: string, msg?: string) => showToast({ type: 'welcome', title, message: msg }), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, hideToast, showSuccess, showError, showWarning, showInfo, showWelcome }}>
      {children}
      <ToastView toast={toast} onDismiss={hideToast} />
    </ToastContext.Provider>
  );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    position: 'absolute', top: 0, left: 0, right: 0,
    zIndex: 9999, paddingTop: 52, paddingHorizontal: 16,
  },
  toast: {
    flexDirection: 'row', alignItems: 'flex-start',
    borderRadius: 20, borderWidth: 1, padding: 16, paddingBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45, shadowRadius: 20, elevation: 14, overflow: 'hidden',
  },
  iconContainer: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 14, flexShrink: 0 },
  content: { flex: 1 },
  label: { fontSize: 10, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 2, opacity: 0.85 },
  title: { color: '#fff', fontSize: 15, fontWeight: '700', lineHeight: 20, marginBottom: 2 },
  message: { color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 18, marginTop: 2 },
  actionBtn: { marginTop: 10 },
  actionText: { fontSize: 13, fontWeight: '700' },
  closeBtn: { marginLeft: 8, padding: 2 },
  progressBar: { position: 'absolute', bottom: 0, left: 0, height: 3, borderRadius: 2, opacity: 0.5 },
});
