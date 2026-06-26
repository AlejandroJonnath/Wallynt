/**
 * core/constants — Constantes globales de la aplicación.
 * Valores que no cambian en runtime y son compartidos por múltiples módulos.
 */

// Roles de usuario
export const USER_ROLES = {
  STUDENT: 'ESTUDIANTE',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPERADMIN',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
