import axios from 'axios';
import { supabase } from '@core/supabase';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    if (typeof config.headers.set === 'function') {
      config.headers.set('Authorization', `Bearer ${session.access_token}`);
    } else {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  }
  return config;
});
