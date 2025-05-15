// services/transactionService.ts
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface APITransaction {
  id: number;
  amount: number;
  description: string;
  date: string;
  user_id: number;
}

export interface TransactionCreateDTO {
  amount: number;
  description: string;
  type: string; // "income" or "expense"
}

class TransactionService {
  async getAll(): Promise<APITransaction[]> {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('User not authenticated');

      const response = await api.get('/transaction/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  async getById(id: number | string): Promise<APITransaction> {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('User not authenticated');

      const response = await api.get(`/transaction/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching transaction with id ${id}:`, error);
      throw error;
    }
  }

  async create(data: TransactionCreateDTO): Promise<APITransaction> {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('User not authenticated');
      
      // Adjust the amount based on type
      const finalAmount = data.type === 'expense' 
        ? -Math.abs(data.amount) // Ensure expense is negative
        : Math.abs(data.amount); // Ensure income is positive
      
      const response = await api.post('/transaction/', 
        { 
          amount: finalAmount,
          description: data.description,
          type: data.type
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  async delete(id: number | string): Promise<void> {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('User not authenticated');

      await api.delete(`/transaction/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error(`Error deleting transaction with id ${id}:`, error);
      throw error;
    }
  }
}

export default new TransactionService();