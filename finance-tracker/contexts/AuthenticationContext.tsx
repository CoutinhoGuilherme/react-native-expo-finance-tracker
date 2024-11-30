// contexts/AuthenticationContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthentication: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Verifica o token quando a aplicação inicia
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        setIsAuthenticated(true); // O usuário está autenticado
      } else {
        setIsAuthenticated(false); // O usuário não está autenticado
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação', error);
      setIsAuthenticated(false);
    }
  };

  const login = async (token: string) => {
    try {
      await AsyncStorage.setItem('auth_token', token);
      setIsAuthenticated(true); // Atualiza o estado para autenticado
    } catch (error) {
      console.error('Erro ao armazenar token', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('auth_token');
      setIsAuthenticated(false); // Atualiza o estado para não autenticado
    } catch (error) {
      console.error('Erro ao remover token', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, checkAuthentication }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para usar o AuthContext
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
