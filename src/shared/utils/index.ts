/**
 * shared/utils — Utilidades genéricas reutilizables por cualquier módulo.
 * No debe contener lógica de negocio específica de una feature.
 */

/** Formatea una fecha a 'YYYY-MM-DD' */
export const formatDateISO = (date: Date): string =>
  date.toISOString().split('T')[0];

/** Formatea un número como moneda (COP por defecto) */
export const formatCurrency = (
  amount: number,
  locale = 'es-CO',
  currency = 'COP'
): string =>
  new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
