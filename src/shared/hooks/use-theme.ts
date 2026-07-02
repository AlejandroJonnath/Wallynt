/**
 * shared/hooks/use-theme — Retorna el objeto de tema (colores de Wallynt).
 */
import { theme } from '@shared/theme';

export function useTheme() {
  return theme.colors;
}
