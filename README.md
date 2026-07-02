# Wallynt — Frontend

App móvil de finanzas personales construida con **Expo Router** y **TypeScript**.

## Inicio rápido

```bash
npm install
npx expo start
```

---

## Arquitectura del Proyecto

El proyecto sigue una **Arquitectura Basada en Funcionalidades (Feature-Based Architecture)**. Cada módulo encapsula su propia lógica, evitando dependencias cruzadas innecesarias.

### Estructura de directorios

```
frontend/
├── assets/
│   ├── images/         ← Imágenes de la app
│   ├── fonts/          ← Fuentes tipográficas
│   ├── animations/     ← Archivos de animación (Lottie, etc.)
│   ├── expo.icon/      ← Íconos iOS (convención Expo, no mover)
│   └── logo.png        ← Ícono principal (referenciado en app.json, no mover)
│
└── src/
    ├── app/            ← Solo routing y layouts (Expo Router file-based routing)
    │   ├── (app)/      ← Pantallas de la app autenticada
    │   └── (auth)/     ← Pantallas de autenticación
    │
    ├── core/           ← Infraestructura de la aplicación (NO lógica de negocio)
    │   ├── api/        ← Cliente HTTP (Axios)
    │   ├── supabase/   ← Cliente Supabase
    │   ├── auth/       ← Lógica de autenticación de infraestructura
    │   ├── providers/  ← Providers globales de contexto (React Context)
    │   ├── config/     ← Configuración global de la app
    │   ├── navigation/ ← Configuración de navegación global
    │   └── services/   ← Servicios de infraestructura compartida
    │
    ├── shared/         ← Código reutilizado por 2+ features (NO exclusivo de una)
    │   ├── components/ ← Componentes visuales genéricos (Button, Card, Modal...)
    │   ├── hooks/      ← Hooks de utilidad (useColorScheme, useTheme, useToast)
    │   ├── icons/      ← AnimatedIcon y similares
    │   ├── theme/      ← Tokens de diseño: colores, tipografía (fuente de verdad)
    │   ├── validations/← Esquemas de validación genéricos
    │   ├── constants/  ← Constantes globales (USER_ROLES, etc.)
    │   ├── types/      ← Tipos e interfaces comunes (PaginatedResponse, ApiError)
    │   └── utils/      ← Utilidades generales (formatCurrency, formatDateISO)
    │
    └── features/       ← Módulos de funcionalidad (autónomos y aislados)
        ├── auth/
        ├── admin/
        ├── analytics/
        ├── budgets/
        ├── transactions/
        └── groups/
```

### Reglas de arquitectura

| Capa | Regla |
|---|---|
| `core/` | Solo infraestructura. Sin componentes visuales, sin lógica de negocio. |
| `shared/` | Solo lo que usan **dos o más** features distintas. Si solo lo usa una feature, va dentro de esa feature. |
| `features/<name>/` | Todo lo exclusivo de una funcionalidad. **Nunca importa de otra feature directamente.** |
| `app/` | Solo routing y layouts de Expo Router. Sin lógica de negocio. |

### Estructura interna de cada feature

```
features/<nombre>/
  components/    ← Componentes exclusivos de esta feature
  hooks/         ← Hooks de negocio
  services/      ← Llamadas a la API
  store/         ← Estado global (Zustand)
  types/         ← Interfaces y tipos propios
  validations/   ← Esquemas Zod/Yup propios
  index.ts       ← API pública de la feature (barrel export)
```

### Alias de TypeScript

```ts
@core/*      →  src/core/*
@shared/*    →  src/shared/*
@features/*  →  src/features/*
@app/*       →  src/app/*
@/*          →  src/*
@/assets/*   →  assets/*
```

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npx expo start` | Inicia el servidor de desarrollo |
| `npx tsc --noEmit` | Verificación de tipos TypeScript |
| `npx expo lint` | Linting con ESLint |
