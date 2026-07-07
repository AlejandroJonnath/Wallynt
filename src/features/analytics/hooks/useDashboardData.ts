import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { api } from '@core/api';
import { useAuthStore } from '@features/auth/store/useAuthStore';

export function useDashboardData() {
  const { session } = useAuthStore();
  const [dashboard, setDashboard] = useState<any>(null);
  const [dailyLimit, setDailyLimit] = useState<any>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [score, setScore] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    if (!session) return;
    try {
      setLoading(true);
      const [dashRes, limitRes, predRes, scoreRes, alertsRes] = await Promise.all([
        api.get('/analysis/dashboard'),
        api.get('/analysis/daily-limit'),
        api.get('/analysis/prediction'),
        api.get('/analysis/score'),
        api.get('/analysis/alerts'),
      ]);
      setDashboard(dashRes.data);
      setDailyLimit(limitRes.data);
      setPrediction(predRes.data);
      setScore(scoreRes.data);
      setAlerts(alertsRes.data || []);

      // Cargar recomendaciones IA si el score es bajo
      if (scoreRes.data?.puntaje_financiero < 50) {
        loadAiRecommendations();
      } else {
        setAiRecommendations(null);
      }
    } catch (e) {
      console.log('Error fetching dashboard', e);
    } finally {
      setLoading(false);
    }
  };

  const loadAiRecommendations = async () => {
    if (!session) return;
    try {
      setAiLoading(true);
      const res = await api.get('/analysis/ai-recommendations');
      setAiRecommendations(res.data);
    } catch (e) {
      console.log('Error fetching AI recommendations', e);
    } finally {
      setAiLoading(false);
    }
  };

  return {
    dashboard,
    dailyLimit,
    prediction,
    score,
    alerts,
    aiRecommendations,
    aiLoading,
    loading,
    refreshAiRecommendations: loadAiRecommendations,
  };
}
