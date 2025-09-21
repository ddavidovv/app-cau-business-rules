import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  idToken: string | null;
  loading: boolean;
  error: string | null;
  userEmail: string | null;
  userRole: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  idToken: null,
  loading: true,
  error: null,
  userEmail: null,
  userRole: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthContextType>({
    isAuthenticated: false,
    idToken: null,
    loading: true,
    error: null,
    userEmail: null,
    userRole: null,
  });

  // Permitir desarrollo local sin autenticación real
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  useEffect(() => {
    if (isLocalhost) {
      setState({
        isAuthenticated: true,
        idToken: 'mock-token-for-local-development',
        loading: false,
        error: null,
        userEmail: 'admin@cttexpress.com',
        userRole: 'Administrador',
      });
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      // Ignorar mensajes de React DevTools
      if (
        event.data?.source === 'react-devtools-content-script' ||
        event.data?.source === 'react-devtools-backend-manager' ||
        event.data?.source === 'react-devtools-bridge'
      ) {
        return;
      }

      if (event.data?.type === 'TOKEN_INIT' || event.data?.type === 'TOKEN_UPDATE') {
        const token = event.data.payload?.idToken;
        if (token && hasValidToken(token)) {
          sessionStorage.setItem('idToken', token);
          const userInfo = getUserInfoFromToken(token);
          setState({
            isAuthenticated: true,
            idToken: token,
            loading: false,
            error: null,
            userEmail: userInfo.email,
            userRole: userInfo.role,
          });
        } else {
          setState({
            isAuthenticated: false,
            idToken: null,
            loading: false,
            error: 'Token inválido',
            userEmail: null,
            userRole: null,
          });
        }
      } else if (event.data?.type === 'TOKEN_EXPIRED') {
        setState({
          isAuthenticated: false,
          idToken: null,
          loading: false,
          error: 'Token expirado',
          userEmail: null,
          userRole: null,
        });
        requestTokenFromOpener();
      }
    };

    const requestTokenFromOpener = () => {
      if (!window.opener) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Esta aplicación debe abrirse desde la aplicación principal',
        }));
        return;
      }
      try {
        window.opener.postMessage(
          {
            type: 'READY_FOR_TOKEN',
            source: 'CHILD_APP'
          },
          '*'
        );
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Error de comunicación con la aplicación principal',
        }));
      }
    };

    const initAuth = () => {
      const storedToken = getIdToken();
      if (storedToken && hasValidToken(storedToken)) {
        const userInfo = getUserInfoFromToken(storedToken);
        setState({
          isAuthenticated: true,
          idToken: storedToken,
          loading: false,
          error: null,
          userEmail: userInfo.email,
          userRole: userInfo.role,
        });
      } else {
        requestTokenFromOpener();
      }
    };

    window.addEventListener('message', handleMessage);
    initAuth();

    let refreshInterval: number | null = null;
    if (window.opener) {
      refreshInterval = window.setInterval(() => {
        if (state.idToken) {
          try {
            window.opener?.postMessage(
              {
                type: 'TOKEN_REFRESH_REQUEST',
                source: 'CHILD_APP'
              },
              '*'
            );
          } catch {}
        }
      }, 4 * 60 * 1000);
    }

    return () => {
      window.removeEventListener('message', handleMessage);
      if (refreshInterval !== null) {
        clearInterval(refreshInterval);
      }
    };
  }, [state.idToken, isLocalhost]);

  return (
    <AuthContext.Provider value={state}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}

// --- Funciones Helper ---
const getIdToken = (): string | null => {
  try {
    return sessionStorage.getItem('idToken');
  } catch {
    return null;
  }
};

const hasValidToken = (token: string): boolean => {
  try {
    const [header, payload, signature] = token.split('.');
    if (!header || !payload || !signature) return false;
    const decodedPayload = JSON.parse(atob(payload));
    const expirationTime = decodedPayload.exp * 1000;
    return expirationTime > Date.now();
  } catch {
    return false;
  }
};

const getUserInfoFromToken = (token: string): { email: string | null; role: string | null } => {
  try {
    const [, payload] = token.split('.');
    const decodedPayload = JSON.parse(atob(payload));
    const email = decodedPayload.email || null;
    const role = decodedPayload.role || decodedPayload.roles?.[0] || decodedPayload['cognito:groups']?.[0] || null;
    return { email, role };
  } catch {
    return { email: null, role: null };
  }
};