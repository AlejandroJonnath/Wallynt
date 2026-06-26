/**
 * core/providers — Providers globales que envuelven la aplicación entera.
 * Ejemplo: ThemeProvider, ToastProvider, QueryClientProvider, etc.
 */

// Los providers de UI (Toast, Theme) viven en @shared/components/<Name>/
// Este módulo re-exporta los que se usan en el root _layout.tsx

export { ToastProvider } from '@shared/components/Toast';
