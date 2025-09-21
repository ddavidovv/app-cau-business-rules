import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  BusinessContext,
  Responsible,
  System,
  DashboardData,
  NotificationToast,
  SystemAlert
} from '../types';

// Interfaces para el estado del store
interface AdminState {
  // Business Context
  businessContexts: BusinessContext[];
  businessContextsLoading: boolean;
  selectedBusinessContext: BusinessContext | null;

  // Responsibles
  responsibles: Responsible[];
  responsiblesLoading: boolean;
  selectedResponsible: Responsible | null;

  // Systems
  systems: System[];
  systemsLoading: boolean;
  selectedSystem: System | null;

  // UI State
  notifications: NotificationToast[];
  sidebarCollapsed: boolean;
  currentView: 'business-context' | 'responsibles' | 'systems' | 'ai-metrics';

  // System Alerts
  systemAlerts: SystemAlert[];
}

interface AdminActions {
  // Business Context Actions
  setBusinessContexts: (contexts: BusinessContext[]) => void;
  setBusinessContextsLoading: (loading: boolean) => void;
  setSelectedBusinessContext: (context: BusinessContext | null) => void;
  addBusinessContext: (context: BusinessContext) => void;
  updateBusinessContext: (id: string, updates: Partial<BusinessContext>) => void;
  removeBusinessContext: (id: string) => void;

  // Responsibles Actions
  setResponsibles: (responsibles: Responsible[]) => void;
  setResponsiblesLoading: (loading: boolean) => void;
  setSelectedResponsible: (responsible: Responsible | null) => void;
  addResponsible: (responsible: Responsible) => void;
  updateResponsible: (id: string, updates: Partial<Responsible>) => void;
  removeResponsible: (id: string) => void;

  // Systems Actions
  setSystems: (systems: System[]) => void;
  setSystemsLoading: (loading: boolean) => void;
  setSelectedSystem: (system: System | null) => void;
  addSystem: (system: System) => void;
  updateSystem: (id: string, updates: Partial<System>) => void;
  removeSystem: (id: string) => void;

  // Dashboard Actions
  setDashboardData: (data: DashboardData) => void;
  setDashboardLoading: (loading: boolean) => void;

  // UI Actions
  addNotification: (notification: Omit<NotificationToast, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCurrentView: (view: AdminState['currentView']) => void;

  // System Alerts Actions
  setSystemAlerts: (alerts: SystemAlert[]) => void;
  addSystemAlert: (alert: SystemAlert) => void;
  resolveSystemAlert: (id: string) => void;
}

type AdminStore = AdminState & AdminActions;

// Crear el store de administración
export const useAdminStore = create<AdminStore>()(
  devtools(
    (set, get) => ({
      // Initial State
      businessContexts: [],
      businessContextsLoading: false,
      selectedBusinessContext: null,

      responsibles: [],
      responsiblesLoading: false,
      selectedResponsible: null,

      systems: [],
      systemsLoading: false,
      selectedSystem: null,

      notifications: [],
      sidebarCollapsed: false,
      currentView: 'business-context',

      systemAlerts: [],

      // Business Context Actions
      setBusinessContexts: (contexts) => set({ businessContexts: contexts }),
      setBusinessContextsLoading: (loading) => set({ businessContextsLoading: loading }),
      setSelectedBusinessContext: (context) => set({ selectedBusinessContext: context }),
      addBusinessContext: (context) => set((state) => ({
        businessContexts: [...state.businessContexts, context]
      })),
      updateBusinessContext: (id, updates) => set((state) => ({
        businessContexts: state.businessContexts.map(ctx =>
          ctx.id === id || ctx._id === id ? { ...ctx, ...updates } : ctx
        )
      })),
      removeBusinessContext: (id) => set((state) => ({
        businessContexts: state.businessContexts.filter(ctx => ctx.id !== id && ctx._id !== id),
        selectedBusinessContext: state.selectedBusinessContext?.id === id || state.selectedBusinessContext?._id === id
          ? null
          : state.selectedBusinessContext
      })),

      // Responsibles Actions
      setResponsibles: (responsibles) => set({ responsibles }),
      setResponsiblesLoading: (loading) => set({ responsiblesLoading: loading }),
      setSelectedResponsible: (responsible) => set({ selectedResponsible: responsible }),
      addResponsible: (responsible) => set((state) => ({
        responsibles: [...state.responsibles, responsible]
      })),
      updateResponsible: (id, updates) => set((state) => ({
        responsibles: state.responsibles.map(resp =>
          resp.id === id || resp._id === id ? { ...resp, ...updates } : resp
        )
      })),
      removeResponsible: (id) => set((state) => ({
        responsibles: state.responsibles.filter(resp => resp.id !== id && resp._id !== id),
        selectedResponsible: state.selectedResponsible?.id === id || state.selectedResponsible?._id === id
          ? null
          : state.selectedResponsible
      })),

      // Systems Actions
      setSystems: (systems) => set({ systems }),
      setSystemsLoading: (loading) => set({ systemsLoading: loading }),
      setSelectedSystem: (system) => set({ selectedSystem: system }),
      addSystem: (system) => set((state) => ({
        systems: [...state.systems, system]
      })),
      updateSystem: (id, updates) => set((state) => ({
        systems: state.systems.map(sys =>
          sys.id === id || sys._id === id ? { ...sys, ...updates } : sys
        )
      })),
      removeSystem: (id) => set((state) => ({
        systems: state.systems.filter(sys => sys.id !== id && sys._id !== id),
        selectedSystem: state.selectedSystem?.id === id || state.selectedSystem?._id === id
          ? null
          : state.selectedSystem
      })),

      // Dashboard Actions
      setDashboardData: (data) => set({ dashboardData: data }),
      setDashboardLoading: (loading) => set({ dashboardLoading: loading }),

      // UI Actions
      addNotification: (notification) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newNotification: NotificationToast = {
          ...notification,
          id,
          duration: notification.duration || 5000
        };

        set((state) => ({
          notifications: [...state.notifications, newNotification]
        }));

        // Auto remove notification after duration
        if (newNotification.duration > 0) {
          setTimeout(() => {
            get().removeNotification(id);
          }, newNotification.duration);
        }
      },

      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),

      clearNotifications: () => set({ notifications: [] }),

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      setCurrentView: (view) => set({ currentView: view }),

      // System Alerts Actions
      setSystemAlerts: (alerts) => set({ systemAlerts: alerts }),
      addSystemAlert: (alert) => set((state) => ({
        systemAlerts: [...state.systemAlerts, alert]
      })),
      resolveSystemAlert: (id) => set((state) => ({
        systemAlerts: state.systemAlerts.map(alert =>
          alert.id === id ? { ...alert, resolved: true } : alert
        )
      }))
    }),
    {
      name: 'admin-store',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        currentView: state.currentView
      })
    }
  )
);

// Hooks especializados para diferentes partes del store
export const useBusinessContextStore = () => {
  const {
    businessContexts,
    businessContextsLoading,
    selectedBusinessContext,
    setBusinessContexts,
    setBusinessContextsLoading,
    setSelectedBusinessContext,
    addBusinessContext,
    updateBusinessContext,
    removeBusinessContext
  } = useAdminStore();

  return {
    businessContexts,
    businessContextsLoading,
    selectedBusinessContext,
    setBusinessContexts,
    setBusinessContextsLoading,
    setSelectedBusinessContext,
    addBusinessContext,
    updateBusinessContext,
    removeBusinessContext
  };
};

export const useResponsibleStore = () => {
  const {
    responsibles,
    responsiblesLoading,
    selectedResponsible,
    setResponsibles,
    setResponsiblesLoading,
    setSelectedResponsible,
    addResponsible,
    updateResponsible,
    removeResponsible
  } = useAdminStore();

  return {
    responsibles,
    responsiblesLoading,
    selectedResponsible,
    setResponsibles,
    setResponsiblesLoading,
    setSelectedResponsible,
    addResponsible,
    updateResponsible,
    removeResponsible
  };
};

export const useSystemStore = () => {
  const {
    systems,
    systemsLoading,
    selectedSystem,
    setSystems,
    setSystemsLoading,
    setSelectedSystem,
    addSystem,
    updateSystem,
    removeSystem
  } = useAdminStore();

  return {
    systems,
    systemsLoading,
    selectedSystem,
    setSystems,
    setSystemsLoading,
    setSelectedSystem,
    addSystem,
    updateSystem,
    removeSystem
  };
};

export const useDashboardStore = () => {
  const {
    dashboardData,
    dashboardLoading,
    setDashboardData,
    setDashboardLoading
  } = useAdminStore();

  return {
    dashboardData,
    dashboardLoading,
    setDashboardData,
    setDashboardLoading
  };
};

export const useUIStore = () => {
  const {
    notifications,
    sidebarCollapsed,
    currentView,
    addNotification,
    removeNotification,
    clearNotifications,
    setSidebarCollapsed,
    setCurrentView
  } = useAdminStore();

  return {
    notifications,
    sidebarCollapsed,
    currentView,
    addNotification,
    removeNotification,
    clearNotifications,
    setSidebarCollapsed,
    setCurrentView
  };
};