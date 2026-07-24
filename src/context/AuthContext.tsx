import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { authApi } from '../services/authApi';
import { tokenStorage, guestTokenStorage } from '../services/apiClient';
import { AuthSession, User } from '../types';

const STAFF_ROLES = ['Administrador', 'Gerente General', 'Finanzas', 'Stock'];

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isStaff: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  setSession: (session: AuthSession) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      if (!tokenStorage.get()) {
        setLoading(false);
        return;
      }
      try {
        const me = await authApi.me();
        setUser(me);
      } catch {
        tokenStorage.clear();
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  const setSession = useCallback((session: AuthSession) => {
    tokenStorage.set(session.access_token);
    guestTokenStorage.clear(); // ya no es invitado, el carrito pasó a la cuenta
    setUser(session.user);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const session = await authApi.login(email, password);
      setSession(session);
      return session.user;
    },
    [setSession]
  );

  const register = useCallback(async (name: string, email: string, password: string) => {
    const { user: newUser } = await authApi.register(name, email, password);
    return newUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // si el token ya estaba vencido/inválido no importa, igual limpiamos local
    }
    tokenStorage.clear();
    setUser(null);
  }, []);

  const isStaff = !!user?.role && STAFF_ROLES.includes(user.role.name);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isStaff,
        login,
        register,
        logout,
        setSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
