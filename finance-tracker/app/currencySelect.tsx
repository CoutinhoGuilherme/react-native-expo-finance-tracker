import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { useModal } from '@/hooks/useModal';

export default function CurrencySelectModal() {
  const { closeModal } = useModal();
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const handleSelectCurrency = (currency: string) => {
    setSelectedCurrency(currency);
    closeModal('currencySelect');
  };

  return (
    <Modal identifier="currencySelect">
      <View style={styles.container}>
        <Text style={styles.title}>Select Currency</Text>
        <Button 
          title="USD" 
          onPress={() => handleSelectCurrency('USD')} 
        />
        <Button 
          title="EUR" 
          onPress={() => handleSelectCurrency('EUR')} 
        />
        <Button 
          title="Cancel" 
          onPress={() => closeModal('currencySelect')} 
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});