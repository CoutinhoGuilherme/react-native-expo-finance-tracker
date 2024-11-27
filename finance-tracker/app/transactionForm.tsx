import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { useModal } from '@/hooks/useModal';

export default function TransactionFormModal() {
  const { closeModal } = useModal();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    // TODO: Implement transaction submission logic
    closeModal('transactionForm');
  };

  return (
    <Modal identifier="transactionForm">
      <View style={styles.container}>
        <Text style={styles.title}>Add Transaction</Text>
        {/* Add form inputs for amount, description, etc. */}
        <Button title="Submit" onPress={handleSubmit} />
        <Button title="Cancel" onPress={() => closeModal('transactionForm')} />
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