import React from 'react';
import { AuthGuard } from './components/auth';
import { Layout } from './components/layout';
import { BusinessContextPage, ResponsiblesPage, SystemsPage } from './pages';
import AIMetricsPage from './pages/AIMetricsPage';
import { useUIStore } from './store';

const App: React.FC = () => {
  const { currentView } = useUIStore();

  const renderCurrentPage = () => {
    switch (currentView) {
      case 'business-context':
        return <BusinessContextPage />;
      case 'responsibles':
        return <ResponsiblesPage />;
      case 'systems':
        return <SystemsPage />;
      case 'ai-metrics':
        return <AIMetricsPage />;
      default:
        return <BusinessContextPage />;
    }
  };

  return (
    <AuthGuard>
      <Layout>
        {renderCurrentPage()}
      </Layout>
    </AuthGuard>
  );
};

export default App;