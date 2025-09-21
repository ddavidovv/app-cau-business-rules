import React from 'react';
import { Settings, Users, Monitor, BarChart3 } from 'lucide-react';
import Header from './Header';
import NotificationToast from './NotificationToast';
import { Tabs } from '../ui';
import { useUIStore } from '../../store';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentView, setCurrentView } = useUIStore();

  const tabs = [
    {
      id: 'business-context' as const,
      label: 'Reglas de Negocio',
      icon: Settings,
    },
    {
      id: 'responsibles' as const,
      label: 'Responsables',
      icon: Users,
    },
    {
      id: 'systems' as const,
      label: 'Sistemas',
      icon: Monitor,
    },
    {
      id: 'ai-metrics' as const,
      label: 'Métricas de IA',
      icon: BarChart3,
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Corporate Header */}
      <Header />

      {/* Tabs Navigation */}
      <Tabs
        tabs={tabs}
        activeTab={currentView}
        onTabChange={setCurrentView}
      />

      {/* Main content area */}
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>

      {/* Toast notifications */}
      <NotificationToast />
    </div>
  );
};

export default Layout;