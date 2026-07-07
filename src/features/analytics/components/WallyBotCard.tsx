import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@shared/theme';

interface Tip {
  icon: string;
  title: string;
  description: string;
}

interface WallyBotCardProps {
  recommendations: {
    greeting: string;
    tips: Tip[];
    score: number;
    nivel_riesgo: string;
  } | null;
  loading: boolean;
  onRefresh: () => void;
}

export function WallyBotCard({ recommendations, loading, onRefresh }: WallyBotCardProps) {
  // ── Animaciones ──────────────────────────────────────────────
  const slideAnim = useRef(new Animated.Value(60)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const robotBounce = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const [expanded, setExpanded] = useState(true);

  // Entrada suave al montar
  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulsación continua del robot
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.12, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    );
    pulse.start();

    // Rebote del robot
    const bounce = Animated.loop(
      Animated.sequence([
        Animated.timing(robotBounce, { toValue: -6, duration: 700, useNativeDriver: true }),
        Animated.timing(robotBounce, { toValue: 0, duration: 700, useNativeDriver: true }),
      ])
    );
    bounce.start();

    // Brillo del borde
    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1500, useNativeDriver: false }),
        Animated.timing(glowAnim, { toValue: 0, duration: 1500, useNativeDriver: false }),
      ])
    );
    glow.start();

    return () => {
      pulse.stop();
      bounce.stop();
      glow.stop();
    };
  }, []);

  const borderColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(239,188,117,0.2)', 'rgba(239,188,117,0.7)'],
  });

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      {/* ── Borde animado con brillo ── */}
      <Animated.View style={[styles.glowBorder, { borderColor }]}>
        <LinearGradient
          colors={['#1A2F45', '#0E2C40', '#142840']}
          style={styles.container}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* ── Header del bot ── */}
          <View style={styles.header}>
            <View style={styles.robotSection}>
              {/* Robot animado */}
              <Animated.View
                style={[
                  styles.robotWrapper,
                  {
                    transform: [
                      { scale: pulseAnim },
                      { translateY: robotBounce },
                    ],
                  },
                ]}
              >
                <LinearGradient
                  colors={['#EFBC75', '#D4961F']}
                  style={styles.robotBubble}
                >
                  <Text style={styles.robotEmoji}>🤖</Text>
                </LinearGradient>
                {/* Indicador "vivo" */}
                <View style={styles.activeDot} />
              </Animated.View>

              <View style={styles.headerText}>
                <View style={styles.nameBadge}>
                  <Text style={styles.botName}>WallyBot</Text>
                  <LinearGradient
                    colors={['#EFBC75', '#D4961F']}
                    style={styles.aiBadge}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.aiBadgeText}>IA</Text>
                  </LinearGradient>
                </View>
                <Text style={styles.botSubtitle}>Asesor Financiero Inteligente</Text>
              </View>
            </View>

            {/* Botón refrescar + colapsar */}
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.refreshBtn}
                onPress={onRefresh}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={theme.colors.accent} />
                ) : (
                  <Ionicons name="refresh" size={16} color={theme.colors.accent} />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.collapseBtn}
                onPress={() => setExpanded(!expanded)}
              >
                <Ionicons
                  name={expanded ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color="rgba(255,255,255,0.5)"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Burbuja de diálogo ── */}
          <View style={styles.speechBubble}>
            <View style={styles.speechTail} />
            {loading && !recommendations ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color={theme.colors.accent} />
                <Text style={styles.loadingText}>Analizando tu perfil financiero...</Text>
              </View>
            ) : (
              <Text style={styles.greeting}>
                {recommendations?.greeting ?? '¡Hey! ¿No sabes gestionar bien tu dinero? ¡Déjame ayudarte!'}
              </Text>
            )}
          </View>

          {/* ── Consejos (colapsables) ── */}
          {expanded && recommendations?.tips && recommendations.tips.length > 0 && (
            <View style={styles.tipsContainer}>
              <View style={styles.tipsDivider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>MIS RECOMENDACIONES</Text>
                <View style={styles.dividerLine} />
              </View>

              {recommendations.tips.map((tip, index) => (
                <TipItem key={index} tip={tip} index={index} />
              ))}
            </View>
          )}

          {/* ── Score badge en el footer ── */}
          {recommendations && (
            <View style={styles.scoreFooter}>
              <Ionicons name="analytics-outline" size={13} color="rgba(255,255,255,0.35)" />
              <Text style={styles.scoreFooterText}>
                Basado en tu Wally Score de{' '}
                <Text style={styles.scoreHighlight}>{recommendations.score}/100</Text>
              </Text>
            </View>
          )}
        </LinearGradient>
      </Animated.View>
    </Animated.View>
  );
}

// ── Sub-componente animado para cada tip ──────────────────────
function TipItem({ tip, index }: { tip: Tip; index: number }) {
  const slideIn = useRef(new Animated.Value(30)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = index * 120;
    Animated.parallel([
      Animated.timing(slideIn, {
        toValue: 0,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.tipRow,
        {
          transform: [{ translateX: slideIn }],
          opacity: fadeIn,
        },
      ]}
    >
      <LinearGradient
        colors={['rgba(239,188,117,0.15)', 'rgba(239,188,117,0.05)']}
        style={styles.tipIconBox}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.tipIcon}>{tip.icon}</Text>
      </LinearGradient>
      <View style={styles.tipContent}>
        <Text style={styles.tipTitle}>{tip.title}</Text>
        <Text style={styles.tipDesc}>{tip.description}</Text>
      </View>
    </Animated.View>
  );
}

// ── Estilos ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 24,
  },
  glowBorder: {
    borderRadius: 24,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  container: {
    borderRadius: 24,
    padding: 20,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  robotSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  robotWrapper: {
    position: 'relative',
  },
  robotBubble: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EFBC75',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  robotEmoji: {
    fontSize: 26,
  },
  activeDot: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#0E2C40',
  },
  headerText: {
    gap: 4,
  },
  nameBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  botName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  aiBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  aiBadgeText: {
    color: '#0E2C40',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  botSubtitle: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 12,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  refreshBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(239,188,117,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239,188,117,0.2)',
  },
  collapseBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Burbuja de diálogo
  speechBubble: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    position: 'relative',
    marginLeft: 8,
  },
  speechTail: {
    position: 'absolute',
    top: 14,
    left: -8,
    width: 0,
    height: 0,
    borderTopWidth: 7,
    borderBottomWidth: 7,
    borderRightWidth: 10,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: 'rgba(255,255,255,0.06)',
  },
  greeting: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontStyle: 'italic',
  },

  // Tips
  tipsContainer: {
    marginTop: 16,
    gap: 10,
  },
  tipsDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  dividerText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  tipIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239,188,117,0.2)',
  },
  tipIcon: {
    fontSize: 20,
  },
  tipContent: {
    flex: 1,
    gap: 3,
  },
  tipTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  tipDesc: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    lineHeight: 17,
  },

  // Footer
  scoreFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  scoreFooterText: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 11,
  },
  scoreHighlight: {
    color: theme.colors.accent,
    fontWeight: '700',
  },
});
