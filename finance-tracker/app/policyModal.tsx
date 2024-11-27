import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { useModal } from '@/hooks/useModal';

export default function PolicyModal() {
  const { closeModal } = useModal();

  return (
    <Modal identifier="policyModal">
      <View style={styles.container}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text>Your privacy policy details here...</Text>
        <Button 
          title="Close" 
          onPress={() => closeModal('policyModal')} 
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
