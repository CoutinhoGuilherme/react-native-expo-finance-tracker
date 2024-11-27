import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ModalProvider } from '@/contexts/ModalContext';

export default function AppLayout() {
  return (
    <SafeAreaProvider>
      <ModalProvider>
        <Slot />
      </ModalProvider>
    </SafeAreaProvider>
  );
}