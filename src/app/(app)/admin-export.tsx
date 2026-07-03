import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { api } from '@core/api';
import { theme } from '@shared/theme';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
const FS: any = FileSystem;
import * as Sharing from 'expo-sharing';

function ExportCard({ icon, iconColor, iconBg, title, desc, onPress, loading }: any) {
  return (
    <TouchableOpacity style={styles.exportCard} onPress={onPress} disabled={loading}>
      <View style={[styles.iconBg, { backgroundColor: iconBg }]}>
        {loading ? <ActivityIndicator color={iconColor} /> : <Ionicons name={icon} size={32} color={iconColor} />}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.exportTitle}>{title}</Text>
        <Text style={styles.exportDesc}>{desc}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
    </TouchableOpacity>
  );
}

export default function AdminExportScreen() {
  const [loadingExcel, setLoadingExcel] = useState(false);
  const [loadingPBI, setLoadingPBI] = useState(false);

  const handleExportExcel = async () => {
    setLoadingExcel(true);
    try {
      const { data } = await api.get('/admin/export/excel');
      const date = new Date();
      const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
      const timestamp = Date.now();
      const filename = `Reporte_${timestamp}_${date.getDate()}_${meses[date.getMonth()]}_${date.getFullYear()}.xlsx`;
      const fileUri = `${FS.documentDirectory}${filename}`;
      await FS.writeAsStringAsync(fileUri, data.base64, {
        encoding: 'base64' as any,
      });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          dialogTitle: 'Guardar reporte Wallynt',
        });
      } else {
        Alert.alert('Reporte listo', `Archivo guardado en: ${fileUri}`);
      }
    } catch (error: any) {
      console.log('Error Excel:', error?.response?.data || error);
      Alert.alert('Error', error?.response?.data?.message || 'No se pudo generar el Excel. Asegúrate de tener datos registrados.');
    } finally {
      setLoadingExcel(false);
    }
  };

  const handleExportPowerBI = async () => {
    setLoadingPBI(true);
    try {
      const { data } = await api.get('/admin/export/powerbi');
      const jsonStr = JSON.stringify(data, null, 2);
      const fileUri = `${FS.documentDirectory}wallynt_powerbi_${Date.now()}.json`;
      await FS.writeAsStringAsync(fileUri, jsonStr, {
        encoding: 'utf8' as any,
      });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Exportar datos para Power BI',
        });
      } else {
        Alert.alert('Datos listos', `Archivo JSON guardado en: ${fileUri}`);
      }
    } catch (error: any) {
      console.log('Error PowerBI:', error?.response?.data || error);
      Alert.alert('Error', error?.response?.data?.message || 'No se pudo exportar los datos para Power BI.');
    } finally {
      setLoadingPBI(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exportar Reportes</Text>
      <Text style={styles.subtitle}>Descarga los datos de la plataforma para análisis externo</Text>

      <Text style={styles.section}>Formatos Disponibles</Text>

      <ExportCard
        icon="document-text"
        iconColor="#4CAF50"
        iconBg="rgba(76,175,80,0.12)"
        title="Reporte Completo (.xlsx)"
        desc="Contiene: Usuarios, Movimientos, Presupuestos y Metas en hojas separadas."
        onPress={handleExportExcel}
        loading={loadingExcel}
      />

      <ExportCard
        icon="bar-chart"
        iconColor="#FFC107"
        iconBg="rgba(255,193,7,0.12)"
        title="Datos para Power BI (.json)"
        desc="Tablas relacionales aplanadas listas para importar como origen de datos en Microsoft Power BI."
        onPress={handleExportPowerBI}
        loading={loadingPBI}
      />

      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={18} color={theme.colors.secondary} />
        <Text style={styles.infoText}>
          Los reportes incluyen datos actualizados al momento de la descarga. Para Power BI, usa "Obtener datos → JSON" y selecciona el archivo descargado.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.primary, padding: 20 },
  title: { fontSize: 26, fontWeight: '800', color: theme.colors.white, marginTop: 8, marginBottom: 6 },
  subtitle: { color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 28 },
  section: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 },
  exportCard: { backgroundColor: theme.colors.petroleum, borderRadius: 20, padding: 20, marginBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBg: { width: 60, height: 60, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  exportTitle: { color: theme.colors.white, fontSize: 16, fontWeight: '700', marginBottom: 4 },
  exportDesc: { color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 18 },
  infoBox: { flexDirection: 'row', gap: 10, backgroundColor: 'rgba(20,141,141,0.08)', borderRadius: 16, padding: 16, marginTop: 8, borderWidth: 1, borderColor: 'rgba(20,141,141,0.2)' },
  infoText: { color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 19, flex: 1 },
});
