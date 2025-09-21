import React from 'react';
import { clsx } from 'clsx';
import {
  Settings,
  Users,
  Monitor,
  BarChart3,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useUIStore } from '../../store';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const { currentView, setCurrentView } = useUIStore();

  const navigationItems = [
    {
      id: 'business-context' as const,
      label: 'Reglas de Negocio',
      icon: Settings,
      description: 'Gestionar contextos y reglas de IA'
    },
    {
      id: 'responsibles' as const,
      label: 'Responsables',
      icon: Users,
      description: 'Gestionar personas responsables'
    },
    {
      id: 'systems' as const,
      label: 'Sistemas',
      icon: Monitor,
      description: 'Gestionar sistemas y aplicaciones'
    },
    {
      id: 'ai-metrics' as const,
      label: 'Métricas de IA',
      icon: BarChart3,
      description: 'Monitoreo y precisión de la IA'
    }
  ];

  return (
    <aside
      className={clsx(
        'bg-gray-900 text-white transition-all duration-300 flex flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo/Header */}
      <div className="p-4 border-b border-gray-700">
        {collapsed ? (
          <div className="h-8 w-8 bg-red-700 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-red-700 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <div>
              <h2 className="font-semibold text-sm">CAU Admin</h2>
              <p className="text-xs text-gray-400">Business Rules</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentView(item.id)}
                  className={clsx(
                    'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors',
                    isActive
                      ? 'bg-red-700 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && (
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.label}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {item.description}
                      </p>
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Toggle Button */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center p-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          title={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;