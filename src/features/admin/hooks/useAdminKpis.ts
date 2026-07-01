import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { api } from '@core/api';
import { useAuthStore } from '@features/auth/store/useAuthStore';

export function useAdminKpis() {
  const { session } = useAuthStore();
  const [biz, setBiz] = useState<any>(null);
  const [fin, setFin] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!session) return;
      try {
        const [b, f] = await Promise.all([
          api.get('/admin/business-kpis'),
          api.get('/admin/financial-kpis'),
        ]);
        setBiz(b.data);
        setFin(f.data);
      } catch (e: any) {
        if (e.response?.status !== 401) {
          Alert.alert('Error', e.response?.data?.message || 'Error al cargar KPIs');
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { biz, fin, loading };
}
