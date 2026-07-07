import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@shared/theme';
import { WallyBotChatModal } from './WallyBotChatModal';

interface WallyBotCardProps {
  recommendations: {
    greeting: string;
    tips?: any[];
    score: number;
    nivel_riesgo: string;
    hasContextMsg?: boolean;
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
  
  const [isChatVisible, setIsChatVisible] = useState(false);

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

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.12, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    );
    pulse.start();

    const bounce = Animated.loop(
      Animated.sequence([
        Animated.timing(robotBounce, { toValue: -6, duration: 700, useNativeDriver: true }),
        Animated.timing(robotBounce, { toValue: 0, duration: 700, useNativeDriver: true }),
      ])
    );
    bounce.start();

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
    <>
      <Animated.View
        style={[
          styles.wrapper,
          {
            transform: [{ translateY: slideAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <Animated.View style={[styles.glowBorder, { borderColor }]}>
          <LinearGradient
            colors={['#1A2F45', '#0E2C40', '#142840']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.header}>
              <View style={styles.robotSection}>
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
                  <Text style={styles.botSubtitle}>Asistente Interactivo</Text>
                </View>
              </View>

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
              </View>
            </View>

            <View style={styles.speechBubble}>
              <View style={styles.speechTail} />
              {loading && !recommendations ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color={theme.colors.accent} />
                  <Text style={styles.loadingText}>Analizando tu perfil financiero...</Text>
                </View>
              ) : (
                <Text style={styles.greeting}>
                  {recommendations?.greeting ?? '¡Hey! ¿Necesitas ayuda con tus gastos?'}
                </Text>
              )}
            </View>

            {!loading && recommendations && (
              <TouchableOpacity 
                style={styles.chatButton}
                onPress={() => setIsChatVisible(true)}
              >
                <Ionicons name="chatbubbles" size={18} color="#0B202E" />
                <Text style={styles.chatButtonText}>Chatear con WallyBot</Text>
              </TouchableOpacity>
            )}

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

      <WallyBotChatModal 
        visible={isChatVisible}
        onClose={() => setIsChatVisible(false)}
        initialGreeting={recommendations?.greeting || '¡Hola! ¿En qué te puedo ayudar?'}
      />
    </>
  );
}

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
  speechBubble: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
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
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.accent,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    marginTop: 4,
  },
  chatButtonText: {
    color: '#0B202E',
    fontWeight: '700',
    fontSize: 14,
  },
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
