/**
 * core/config — Variables de entorno y configuración global de la aplicación.
 * Centraliza el acceso a process.env para evitar referencias directas dispersas.
 */

export const ENV = {
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
} as const;
