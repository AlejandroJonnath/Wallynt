import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export function QuickActions() {
  const router = useRouter();

  return (
    <View style={styles.quickActionsContainer}>
      <TouchableOpacity style={styles.quickActionBtn} onPress={() => router.push('/(app)/add-movement')}>
        <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(32, 138, 239, 0.15)' }]}>
          <Ionicons name="swap-vertical" size={24} color="#208AEF" />
        </View>
        <Text style={styles.quickActionText}>Mover</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.quickActionBtn} onPress={() => router.push('/(app)/budgets')}>
        <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(239, 188, 117, 0.15)' }]}>
          <Ionicons name="pie-chart" size={24} color="#EFBC75" />
        </View>
        <Text style={styles.quickActionText}>Presupuestos</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.quickActionBtn} onPress={() => router.push('/(app)/goals')}>
        <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(76, 175, 80, 0.15)' }]}>
          <Ionicons name="flag" size={24} color="#4CAF50" />
        </View>
        <Text style={styles.quickActionText}>Metas</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.quickActionBtn} onPress={() => router.push('/(app)/groups')}>
        <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(156, 39, 176, 0.15)' }]}>
          <Ionicons name="people" size={24} color="#9C27B0" />
        </View>
        <Text style={styles.quickActionText}>Grupos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  quickActionsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  quickActionBtn: { alignItems: 'center', flex: 1 },
  quickActionIcon: { width: 56, height: 56, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  quickActionText: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600' },
});
