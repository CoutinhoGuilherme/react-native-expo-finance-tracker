import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@/components/Button';
import { useModal } from '@/hooks/useModal';

export default function HomeScreen() {
  const { openModal } = useModal();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Budget Overview</Text>
      <Button 
        title="Add Transaction" 
        onPress={() => openModal('transactionForm')} 
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
    marginBottom: 16,
  },
});