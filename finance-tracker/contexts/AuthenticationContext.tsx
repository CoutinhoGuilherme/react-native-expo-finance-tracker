// contexts/AuthenticationContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert } from 'react-native';

interface AuthContextData {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string, birthday: string | null) => Promise<void>;
  signOut: () => void;
}

interface User {
  id: number;
  email: string;
  first_name: string;  // Alterado para campos separados
  last_name: string;   // Alterado para campos separados
  is_active: boolean;
  birthday?: string;   // Novo campo
}



const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null); // Corrigido o tipo
  const [loading, setLoading] = useState(true); // Adicionado controle de loading

  // 🔽 ESSE TRECHO AQUI
  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);

        try {
          const userResponse = await api.get('/users/me', {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          setUser(userResponse.data);
        } catch (error) {
          // console.error('Erro ao buscar user com token salvo', error);
          setToken(null);
          setUser(null);
          await AsyncStorage.removeItem('token');
        }
      }

      setLoading(false);
    };

    loadToken();
  }, []);
  // 🔼 FIM DO TRECHO

  const signIn = async (email: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await api.post('/token', formData.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const { access_token } = response.data;
    await AsyncStorage.setItem('token', access_token);
    setToken(access_token);

    const userResponse = await api.get('/users/me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const user = userResponse.data;

    await AsyncStorage.setItem('userData', JSON.stringify({
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email
    }));

    setUser(user);
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string, birthday: string | null) => {
    try {
      await api.post('/users/', {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        birthday
      });

    await signIn(email, password);

    } catch (error: any) {
  console.error("Erro ao registrar:", error);

  if (error.response) {
    console.log("Detalhes do erro:", JSON.stringify(error.response.data, null, 2));
    Alert.alert("Erro 422", JSON.stringify(error.response.data, null, 2));
  } else {
    console.log("Erro desconhecido:", error.message || error);
    Alert.alert("Erro", error.message || "Erro desconhecido");
  }
}
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

