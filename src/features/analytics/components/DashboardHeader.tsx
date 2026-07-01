import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@shared/theme';

interface DashboardHeaderProps {
  userName: string;
  alertsCount: number;
  onSignOut: () => void;
}

export function DashboardHeader({ userName, alertsCount, onSignOut }: DashboardHeaderProps) {
  const router = useRouter();
  
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>Hola, {userName.split(' ')[0]}</Text>
        <Text style={styles.title}>Tu Billetera</Text>
      </View>
      <View style={styles.headerActions}>
        {alertsCount > 0 && (
          <TouchableOpacity style={styles.alertBadge} onPress={() => router.push('/(app)/alerts')}>
            <Ionicons name="notifications" size={16} color="#fff" />
            <Text style={styles.alertBadgeText}>{alertsCount}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/(app)/profile')}>
          <Ionicons name="person-circle-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={onSignOut}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40, marginBottom: 28 },
  greeting: { fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: '600', marginBottom: 4 },
  title: { fontSize: 28, fontWeight: '800', color: theme.colors.white },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  alertBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F44336', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  alertBadgeText: { color: theme.colors.white, fontWeight: '700', fontSize: 13 },
  profileButton: { backgroundColor: 'rgba(255,255,255,0.08)', padding: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  logoutButton: { backgroundColor: 'rgba(255,255,255,0.08)', padding: 10, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
});
