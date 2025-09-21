# CLAUDE.md - CAU Business Rules Admin

Este archivo proporciona orientación a Claude Code (claude.ai/code) al trabajar con el código de administración de reglas de negocio.

## 📋 Visión General del Proyecto

**CAU Business Rules Admin** - Frontend administrativo para la gestión de reglas de negocio del sistema CTT Incidents Report Service.

### 🎯 Propósito
Esta aplicación React + TypeScript proporciona una interfaz administrativa para gestionar:

- **Reglas de Negocio**: Contextos de clasificación para la IA
- **Responsables**: Personas que pueden ser asignadas a tickets
- **Sistemas**: Catálogo de sistemas y aplicaciones
- **Dashboard**: Estadísticas y monitoreo del sistema

---

## 🏗️ Arquitectura del Sistema

```
app-cau-business-rules/
├── src/
│   ├── components/
│   │   ├── auth/           # Autenticación con ventana padre
│   │   ├── layout/         # Layout principal y navegación
│   │   └── ui/            # Componentes base reutilizables
│   ├── contexts/          # AuthContext para comunicación padre
│   ├── hooks/             # Custom hooks especializados
│   ├── pages/             # Páginas principales de administración
│   ├── services/          # Servicios de API con backend
│   ├── store/             # Estado global con Zustand
│   └── types/             # Definiciones TypeScript
├── public/               # Assets estáticos
└── docs/                # Documentación adicional
```

### 🚀 Tecnologías Utilizadas

- **React 18** + **TypeScript** (Base sólida y type-safe)
- **Vite** (Build tool rápido y moderno)
- **Tailwind CSS** (Estilos utility-first)
- **Zustand** (Estado global simple y eficiente)
- **React Hook Form** + **Zod** (Formularios con validación)
- **React Query** (Cache de APIs y sincronización)
- **Lucide React** (Iconografía consistente)

---

## 🔐 Sistema de Autenticación

### Integración con Aplicación Principal

```typescript
// AuthContext.tsx - Autenticación mediante ventana padre
const isLocalhost = window.location.hostname === 'localhost';

if (isLocalhost) {
  // Desarrollo: Usuario mock automático
  setState({
    isAuthenticated: true,
    userEmail: 'admin@cttexpress.com',
    userRole: 'Administrador'
  });
} else {
  // Producción: Comunicación con ventana padre
  window.parent.postMessage({ type: 'REQUEST_AUTH' }, '*');
}
```

### Estados de Autenticación
- **Loading**: Verificando autenticación con ventana padre
- **Error**: Problema de comunicación o token inválido
- **No autenticado**: Debe abrirse desde aplicación principal
- **Autenticado**: Acceso completo a funcionalidades administrativas

---

## 💾 Estado Global con Zustand

### Estructura del Store

```typescript
interface AdminStore {
  // Entidades de datos
  businessContexts: BusinessContext[];
  responsibles: Responsible[];
  systems: System[];
  dashboardData: DashboardData;

  // Estado de la interfaz
  notifications: NotificationToast[];
  sidebarCollapsed: boolean;
  currentView: 'dashboard' | 'business-context' | 'responsibles' | 'systems';

  // Acciones especializadas
  fetchBusinessContexts: () => Promise<void>;
  createBusinessContext: (context: BusinessContext) => Promise<void>;
  updateBusinessContext: (id: string, context: Partial<BusinessContext>) => Promise<void>;
  deleteBusinessContext: (id: string) => Promise<void>;

  // ... métodos similares para responsibles y systems
}
```

### Hooks Especializados
- `useBusinessContextStore()` - Gestión completa de reglas de negocio
- `useResponsibleStore()` - CRUD de personas responsables
- `useSystemStore()` - Gestión de sistemas y aplicaciones
- `useDashboardStore()` - Estadísticas y métricas administrativas
- `useUIStore()` - Estado de la interfaz (sidebar, notificaciones)

---

## 📊 Gestión de Business Context (Reglas de Negocio)

### Estructura de Datos

```typescript
interface BusinessContext {
  id: string;
  name: string;
  description: string;
  keywords: string[];           // Palabras clave específicas
  alias: string[];             // Términos alternativos
  project_manager: string;     // Responsable principal
  assignment_rules: {          // Reglas de asignación automática
    conditions: AssignmentCondition[];
    default_assignee?: string;
  };
  criticality_hints: {         // Indicadores de prioridad
    high_priority_keywords: string[];
    escalation_keywords: string[];
  };
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}
```

### Configuración de Formularios con Ayuda Contextual

```typescript
interface FormFieldConfig {
  field: string;
  label: string;
  description: string;    // Explicación del campo
  placeholder?: string;
  help_text: string;     // Ayuda contextual detallada
  example?: string;      // Ejemplo práctico de uso
  required: boolean;
}

// Ejemplo: Campo Keywords
{
  field: 'keywords',
  label: 'Palabras Clave',
  description: 'Términos específicos que garantizan la asignación a este contexto',
  help_text: 'La IA priorizará estos términos para clasificar tickets automáticamente',
  example: 'facturación, billing, invoices, pagos',
  required: true
}
```

---

## 📡 Integración con Backend

### APIs Administrativas Esperadas

```typescript
// Business Context Management
POST   /api/admin/business-context          // Crear nueva regla
GET    /api/admin/business-context          // Listar todas las reglas
PUT    /api/admin/business-context/:id      // Actualizar regla existente
DELETE /api/admin/business-context/:id      // Eliminar regla

// Responsibles Management
GET    /api/catalog/responsibles            // Lista simple para selectors
POST   /api/admin/responsibles              // Crear responsable
PUT    /api/admin/responsibles/:id          // Actualizar responsable
DELETE /api/admin/responsibles/:id          // Eliminar responsable

// Systems Management
GET    /api/catalog/systems                 // Lista simple para selectors
POST   /api/admin/systems                   // Crear sistema
PUT    /api/admin/systems/:id               // Actualizar sistema
DELETE /api/admin/systems/:id               // Eliminar sistema

// Dashboard & Statistics
GET    /api/admin/dashboard                 // Resumen administrativo
GET    /api/admin/context-stats             // Estadísticas de uso
GET    /api/admin/system-health             // Estado del sistema
```

### Configuración de API

```bash
# .env - Variables de entorno
VITE_API_BASE_URL=http://localhost:5000
```

---

## 🎨 Componentes y Páginas

### Layout Principal
- **Sidebar colapsable** con navegación entre secciones
- **Header administrativo** con notificaciones y perfil de usuario
- **Toast notifications** para feedback inmediato al usuario
- **Breadcrumbs** para navegación contextual

### Páginas Principales

#### 1. Dashboard Administrativo
- Resumen de reglas de negocio activas
- Estadísticas de uso y efectividad de la IA
- Métricas de asignación automática
- Estado de salud del sistema

#### 2. Business Context Management
- Listado completo con filtros y búsqueda
- Formulario de creación/edición con ayudas contextuales
- Validación en tiempo real de reglas
- Preview de efectividad de clasificación IA

#### 3. Responsables Management
- CRUD completo de personas responsables
- Validación de emails únicos
- Estado activo/inactivo por responsable
- Estadísticas de tickets asignados

#### 4. Systems Management
- Gestión de catálogo de sistemas
- Categorización por tipo de sistema
- Validación de nombres únicos
- Estadísticas de incidencias por sistema

---

## 🚀 Desarrollo Local

### Comandos Principales

```bash
# Instalación de dependencias
npm install

# Servidor de desarrollo (Puerto 5175)
npm run dev

# Build para producción
npm run build

# Preview del build local
npm run preview

# Linting con ESLint
npm run lint
```

### Variables de Entorno Requeridas

```bash
# .env.local
VITE_API_BASE_URL=http://localhost:5000  # Backend principal
```

---

## 🧪 Testing y Validación

### Estrategia de Testing
- **Unit Tests**: Componentes y hooks con Jest + React Testing Library
- **Integration Tests**: Flujos completos de CRUD
- **E2E Tests**: Casos de uso administrativo con Playwright
- **API Tests**: Validación de endpoints con backend

### Comandos de Testing

```bash
# Suite completa de tests
npm run test

# Tests en modo watch
npm run test:watch

# Coverage report
npm run test:coverage

# E2E tests
npm run test:e2e
```

---

## 📈 Performance y Optimización

### Métricas Objetivo
- **Tiempo de carga inicial**: < 2 segundos
- **Creación de regla de negocio**: < 500ms
- **Actualización de datos**: < 300ms
- **Búsqueda y filtros**: < 200ms

### Optimizaciones Implementadas
- **Code Splitting**: Carga lazy de páginas
- **React Query**: Cache inteligente de APIs
- **Memoización**: Componentes optimizados con React.memo
- **Bundle Analysis**: Monitoreo de tamaño de build

---

## 🔧 Configuración Avanzada

### Estructura de Formularios con Validación

```typescript
// Ejemplo: FormConfig para Business Context
export const businessContextFormConfig: FormFieldConfig[] = [
  {
    field: 'keywords',
    label: 'Palabras Clave Específicas',
    description: 'Términos que garantizan la asignación a este contexto',
    help_text: 'La IA priorizará estos términos. Usar palabras técnicas precisas.',
    example: 'facturación, billing, invoices, cobros, pagos',
    required: true
  },
  {
    field: 'alias',
    label: 'Términos Alternativos',
    description: 'Sinónimos o términos coloquiales relacionados',
    help_text: 'Incluir variaciones que los usuarios podrían utilizar.',
    example: 'facturas, bills, recibos, cuenta, dinero',
    required: false
  }
  // ... más campos
];
```

---

## 🎯 Funcionalidades Futuras Planificadas

1. **Validación en Tiempo Real**
   - Preview de efectividad de reglas IA
   - Simulación de clasificación con ejemplos

2. **Import/Export de Configuraciones**
   - Backup de reglas en formato JSON
   - Migración entre entornos

3. **Dashboard Avanzado**
   - Gráficos de tendencias de tickets
   - Análisis de efectividad por contexto
   - Alertas de configuración

4. **Gestión de Versiones**
   - Historial de cambios en reglas
   - Rollback a versiones anteriores

---

## 🔍 Debug y Troubleshooting

### Debugging de Autenticación

```typescript
// Para probar flujo real de producción
// Cambiar isLocalhost a false en AuthContext.tsx
const isLocalhost = false; // Forzar flujo de producción
```

### Debug del Store Zustand

```typescript
// DevTools integration habilitada
export const useAdminStore = create<AdminStore>()(
  devtools(
    (set, get) => ({ /* implementación */ }),
    { name: 'admin-business-rules-store' }
  )
);
```

### Logs de API para Debugging

```typescript
// Interceptor de errores en apiService.ts
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data);
    useUIStore.getState().addNotification({
      type: 'error',
      title: 'Error de API',
      message: error.response?.data?.message || 'Error desconocido'
    });
    return Promise.reject(error);
  }
);
```

---

## 📦 Build y Deploy

### Configuración de Build

```bash
# Build optimizado para producción
npm run build

# Archivos generados en dist/
# Servir como aplicación estática desde servidor web
```

### Deploy Checklist
- ✅ Variables de entorno configuradas
- ✅ Backend APIs funcionando
- ✅ Autenticación desde aplicación principal
- ✅ MongoDB Atlas con colecciones necesarias
- ✅ Tests pasando correctamente

---

## 🤝 Guías de Contribución

### Convenciones de Código
1. **TypeScript estricto** habilitado
2. **CamelCase** para frontend (conversión automática desde snake_case backend)
3. **Componentes funcionales** con hooks
4. **Nombres descriptivos** para funciones y variables
5. **Comentarios solo cuando sea necesario** para lógica compleja

### Estructura de Commits
```bash
feat(business-context): add form validation for keywords field
fix(auth): resolve token refresh issue in production
refactor(store): optimize API calls with React Query
docs(readme): update installation instructions
```

---

## 📚 Recursos y Referencias

### Documentación Externa
- [React 18 Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com/)

### Documentación del Sistema
- **Backend APIs**: Ver documentación en proyecto principal
- **Estructuras de datos**: Consultar tipos en `/src/types/`
- **Autenticación**: Revisar `AuthContext.tsx` para detalles

---

**Versión**: 1.0.0
**Puerto de desarrollo**: 5175
**Backend requerido**: http://localhost:5000
**Autenticación**: Integración con aplicación principal vía ventana padre

---

*Creado para optimizar la gestión de reglas de negocio del sistema CTT Incidents Report Service*