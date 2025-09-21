# CAU Business Rules Admin

Frontend administrativo para la gestión de reglas de negocio del sistema CTT Incidents Report Service.

## 📋 Descripción

Esta aplicación React + TypeScript proporciona una interfaz administrativa para gestionar:

- **Reglas de Negocio**: Contextos de clasificación para la IA
- **Responsables**: Personas que pueden ser asignadas a tickets
- **Sistemas**: Catálogo de sistemas y aplicaciones
- **Dashboard**: Estadísticas y monitoreo del sistema

## 🚀 Desarrollo Local

### Prerrequisitos

- Node.js 18+ y npm
- Backend funcionando en `http://localhost:5000`

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación se ejecutará en `http://localhost:5175`

### Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo (puerto 5175)
npm run build    # Build para producción
npm run preview  # Preview del build local
npm run lint     # Linting con ESLint
```

## 🔐 Autenticación

La aplicación utiliza el mismo sistema de autenticación que el frontend principal:

- **Desarrollo local**: Autenticación automática con usuario mock
- **Producción**: Debe abrirse desde la aplicación principal que proporciona el token

### Estados de Autenticación

- **Loading**: Verificando autenticación
- **Error**: Problema de comunicación o token inválido
- **No autenticado**: Debe abrirse desde aplicación principal
- **Autenticado**: Acceso completo a funcionalidades

## 🏗️ Arquitectura

### Estructura de Carpetas

```
src/
├── components/
│   ├── auth/           # Componentes de autenticación
│   ├── layout/         # Layout principal y navegación
│   └── ui/            # Componentes base reutilizables
├── contexts/          # Contextos de React (AuthContext)
├── hooks/             # Custom hooks
├── pages/             # Páginas principales
├── services/          # Servicios de API
├── store/             # Estado global (Zustand)
└── types/             # Definiciones TypeScript
```

### Tecnologías Utilizadas

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (estilos)
- **Zustand** (estado global)
- **React Hook Form** + **Zod** (formularios)
- **React Query** (cache de APIs)
- **Lucide React** (iconos)

## 📡 Integración con Backend

### APIs Utilizadas

```typescript
// Business Context Management
POST   /api/admin/business-context          // Crear regla
GET    /api/admin/business-context          // Listar reglas
PUT    /api/admin/business-context/:id      // Actualizar regla
DELETE /api/admin/business-context/:id      // Eliminar regla

// Responsibles Management
GET    /api/catalog/responsibles            // Lista simple
POST   /api/admin/responsibles              // Crear responsable
PUT    /api/admin/responsibles/:id          // Actualizar responsable

// Systems Management
GET    /api/catalog/systems                 // Lista simple
POST   /api/admin/systems                   // Crear sistema
PUT    /api/admin/systems/:id               // Actualizar sistema

// Dashboard & Stats
GET    /api/admin/dashboard                 // Datos dashboard
GET    /api/admin/context-stats             // Estadísticas
```

### Configuración de API

La URL base del backend se configura en `.env`:

```bash
VITE_API_BASE_URL=http://localhost:5000
```

## 🎨 Componentes Principales

### Autenticación (AuthGuard)

Protege toda la aplicación y maneja los diferentes estados de autenticación.

### Layout Principal

- **Sidebar colapsable** con navegación
- **Header** con notificaciones y info de usuario
- **Toast notifications** para feedback al usuario

### Páginas Principales

1. **Dashboard**: Resumen y estadísticas generales
2. **Business Context**: Gestión de reglas de negocio
3. **Responsables**: Gestión de personas responsables
4. **Sistemas**: Gestión de catálogo de sistemas

## 🔧 Estado Global (Zustand)

El estado se organiza en secciones:

```typescript
interface AdminStore {
  // Data entities
  businessContexts: BusinessContext[];
  responsibles: Responsible[];
  systems: System[];
  dashboardData: DashboardData;

  // UI state
  notifications: NotificationToast[];
  sidebarCollapsed: boolean;
  currentView: 'dashboard' | 'business-context' | 'responsibles' | 'systems';

  // Actions
  // ... métodos para manipular el estado
}
```

### Hooks Especializados

- `useBusinessContextStore()`: Gestión de reglas de negocio
- `useResponsibleStore()`: Gestión de responsables
- `useSystemStore()`: Gestión de sistemas
- `useDashboardStore()`: Datos del dashboard
- `useUIStore()`: Estado de la interfaz

## 📝 Formularios con Ayudas Contextuales

Los formularios incluyen descripciones y ejemplos para facilitar la configuración:

```typescript
interface FormFieldConfig {
  field: string;
  label: string;
  description: string;    // Explicación del campo
  placeholder?: string;
  help_text: string;     // Ayuda contextual
  example?: string;      // Ejemplo de uso
  required: boolean;
}
```

### Campos de Business Context

- **Keywords**: Palabras clave específicas que garantizan asignación
- **Alias**: Términos alternativos o coloquiales
- **Project Manager**: Responsable principal del ámbito
- **Assignment Rules**: Reglas de asignación automática
- **Criticality Hints**: Indicadores de prioridad por palabras clave

## 🎯 Funcionalidades Futuras

Las páginas actuales son placeholders preparados para:

1. **Business Context con descripciones completas**
2. **CRUD completo de Responsables**
3. **CRUD completo de Sistemas**
4. **Dashboard con gráficos y métricas**
5. **Validación en tiempo real**
6. **Import/Export de configuraciones**

## 🔍 Desarrollo y Debug

### Variables de Entorno

```bash
VITE_API_BASE_URL=http://localhost:5000  # URL del backend
```

### Debug de Autenticación

En desarrollo local, la autenticación se simula automáticamente. Para probar el flujo real:

1. Cambiar `isLocalhost` a `false` en `AuthContext.tsx`
2. Abrir desde aplicación principal que proporcione token

### Debug del Store

Zustand incluye devtools integration:

```typescript
export const useAdminStore = create<AdminStore>()(
  devtools(
    (set, get) => ({ /* store implementation */ }),
    { name: 'admin-store' }
  )
);
```

## 📦 Build y Deploy

```bash
# Build para producción
npm run build

# Los archivos generados están en dist/
# Servir como aplicación estática
```

## 🤝 Contribución

1. Mantener consistencia con patrones establecidos
2. Usar TypeScript estricto
3. Seguir convenciones de naming (camelCase)
4. Incluir descripciones en formularios nuevos
5. Mantener estructura de carpetas organizada

---

**Versión**: 1.0.0
**Puerto de desarrollo**: 5175
**Backend requerido**: http://localhost:5000
**Autenticación**: Desde aplicación principal o mock local