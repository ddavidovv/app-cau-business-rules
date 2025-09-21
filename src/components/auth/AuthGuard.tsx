import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingScreen from './LoadingScreen';
import ErrorScreen from './ErrorScreen';
import UnauthenticatedScreen from './UnauthenticatedScreen';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, loading, error } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
  }

  if (!isAuthenticated) {
    return <UnauthenticatedScreen />;
  }

  return <>{children}</>;
};

export default AuthGuard;