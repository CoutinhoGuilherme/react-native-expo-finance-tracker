import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '../contexts/ThemeContext';
import { TransactionProvider } from '../contexts/TransactionContext';
import { CurrencyProvider } from '../contexts/CurrencyContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthenticationContext';
import UserProfileScreen from './userProfileScreen';

// Create a separate component for Stack configuration
function StackNavigator() {
  const { theme } = useTheme();
  
  return (
    <Stack
    screenOptions={{headerShown: false}}>
      <Stack.Screen 
        name="LoginScreen" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="RegisterScreen" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="ResetPasswordScreen" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="StartScreen" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="splash" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="(tabs)" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="UserProfile"
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="transactionForm" 
        options={{
          presentation: 'modal',
          headerShown: false,
          headerTitle: 'Add Transaction',
          headerStyle: {
            backgroundColor: theme.surface,
          },
          headerTintColor: theme.text.primary,
          headerShadowVisible: false,
        }} 
      />
      <Stack.Screen 
        name="currencySelect" 
        options={{
          presentation: 'modal',
          headerShown: false,
          headerTitle: 'Select Currency',
          headerStyle: {
            backgroundColor: theme.surface,
          },
          headerTintColor: theme.text.primary,
          headerShadowVisible: false,
        }} 
      />
      <Stack.Screen 
        name="languageSelect" 
        options={{
          presentation: 'modal',
          headerShown: false,
          headerTitle: 'Select Language',
          headerStyle: {
            backgroundColor: theme.surface,
          },
          headerTintColor: theme.text.primary,
          headerShadowVisible: false,
        }} 
      />
      <Stack.Screen 
        name="policyModal" 
        options={{
          presentation: 'modal',
          headerShown: false,
          headerTitle: 'Privacy Policy',
          headerStyle: {
            backgroundColor: theme.surface,
          },
          headerTintColor: theme.text.primary,
          headerShadowVisible: false,
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
<ThemeProvider>
  <AuthProvider> 
    <GestureHandlerRootView style={styles.container}>
        <TransactionProvider>
          <CurrencyProvider>
            <LanguageProvider>
              <StackNavigator />
            </LanguageProvider>
          </CurrencyProvider>
        </TransactionProvider>
    </GestureHandlerRootView>
  </AuthProvider>
</ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});