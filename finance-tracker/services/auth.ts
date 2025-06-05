import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export async function signUp(firstName: string, lastName: string, email: string, password: string, birthday: string | null) {
  const response = await api.post('/users', { first_name: firstName, last_name: lastName, email, password, birthday });
  await AsyncStorage.setItem('token', response.data.access_token);
  return response.data;
}

export async function signIn(email: string, password: string) {
  const response = await api.post('/token', { email, password });
  await AsyncStorage.setItem('token', response.data.access_token);
  return response.data;
}

export async function signOut() {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('userData');
}
