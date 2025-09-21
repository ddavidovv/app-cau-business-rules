// Tipos para autenticación (idéntico al sistema del frontend)
export interface User {
  email: string;
  name?: string;
  role?: string;
  department?: string;
}

export interface AuthState {
  user: User | null;
  userEmail: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (email: string) => void;
  logout: () => void;
  clearError: () => void;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

// Token de autenticación recibido de la ventana padre
export interface AuthToken {
  token: string;
  user: User;
  expires_at?: number;
}