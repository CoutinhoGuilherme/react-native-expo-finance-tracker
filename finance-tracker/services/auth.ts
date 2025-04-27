import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export async function signUp(name: string, email: string, password: string) {
  const response = await api.post('/register', { name, email, password });
  await AsyncStorage.setItem('token', response.data.access_token);
  return response.data;
}

export async function signIn(email: string, password: string) {
  const response = await api.post('/login', { email, password });
  await AsyncStorage.setItem('token', response.data.access_token);
  return response.data;
}

export async function signOut() {
  await AsyncStorage.removeItem('token');
}
