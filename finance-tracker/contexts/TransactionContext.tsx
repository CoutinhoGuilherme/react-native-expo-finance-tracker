import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Transaction {
  id: number;
  amount: number;
  description: string;
  type: string;
  date: string;
  is_recurring?: boolean;
  category: string;
  end_date?: string | null;
  user_id: number;
  created_at: string;
  updated_at?: string | null;
}

interface TransactionContextType {
  transactions: Transaction[];
  isLoading: boolean;
  addTransaction: (data: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTransaction: (data: Transaction) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
  refreshTransactions: () => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    refreshTransactions();
  }, []);

  const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem('token');
  if (!token) throw new Error('Token não encontrado');
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

  const refreshTransactions = async () => {
    setIsLoading(true);
    try {
      const config = await getAuthHeader();
      const response = await api.get('/transactions/', config);
      setTransactions(response.data);
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTransaction = async (data: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
  try {
    const config = await getAuthHeader();
    console.log('Enviando para API:', data);
    await api.post('/transactions/', data, config);
    await refreshTransactions();
  } catch (error) {
    console.error('Erro ao adicionar transação:', error);
  }
};

const updateTransaction = async (data: Transaction) => {
  try {
    const config = await getAuthHeader();
    await api.put(`/transactions/${data.id}`, data, config);
    await refreshTransactions();
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    throw error;
  }
};


  const deleteTransaction = async (id: number) => {
    try {
      const config = await getAuthHeader();
      await api.delete(`/transactions/${id}`, config);
      await refreshTransactions();
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
    }
  };

  return (
    <TransactionContext.Provider value={{
      transactions,
      isLoading,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      refreshTransactions
    }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
}
