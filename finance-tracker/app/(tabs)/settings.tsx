import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@/components/Button';
import { useModal } from '@/hooks/useModal';

export default function SettingsScreen() {
  const { openModal } = useModal();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Button 
        title="Select Currency" 
        onPress={() => openModal('currencySelect')} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});