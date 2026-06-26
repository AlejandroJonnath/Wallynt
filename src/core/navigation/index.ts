/**
 * core/navigation — Constantes y helpers de navegación.
 * Centraliza los nombres de rutas para evitar strings mágicos en toda la app.
 */

export const ROUTES = {
  // Auth
  LOGIN: '/(auth)/login' as const,
  REGISTER: '/(auth)/register' as const,
  FINANCIAL_PROFILE: '/(auth)/financial-profile' as const,

  // App — Estudiante
  HOME: '/(app)/home' as const,
  MOVEMENTS: '/(app)/movements' as const,
  BUDGETS: '/(app)/budgets' as const,
  GOALS: '/(app)/goals' as const,
  GROUPS: '/(app)/groups' as const,
  ALERTS: '/(app)/alerts' as const,
  ADD_MOVEMENT: '/(app)/add-movement' as const,
  ADD_BUDGET: '/(app)/add-budget' as const,
  ADD_GOAL: '/(app)/add-goal' as const,
  GROUP_DETAIL: '/(app)/group-detail' as const,
  GROUP_REQUESTS: '/(app)/group-requests' as const,

  // App — Admin
  ADMIN_KPIS: '/(app)/admin-kpis' as const,
  ADMIN_INSIGHTS: '/(app)/admin-insights' as const,
  ADMIN_EXPORT: '/(app)/admin-export' as const,
  ADMIN_USERS: '/(app)/admin-users' as const,
} as const;
