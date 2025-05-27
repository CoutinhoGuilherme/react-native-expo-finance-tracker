import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { useTransactions } from '../contexts/TransactionContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RecurringTransactionSettings from '../components/RecurringTransactionSettings';

const expenseCategories = [
  'Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Other'
];

const incomeCategories = [
  'Salary', 'Freelance', 'Investment', 'Gift', 'Other'
];

const TRANSACTION_COLORS = {
  expense: {
    active: '#FF3B30',
    inactive: '#FFF1F0',
    text: {
      active: '#FFFFFF',
      inactive: '#FF3B30'
    },
    gradient: ['#FF3B30', '#FF6B6B']
  },
  income: {
    active: '#34C759',
    inactive: '#F0FFF4',
    text: {
      active: '#FFFFFF',
      inactive: '#34C759'
    },
    gradient: ['#34C759', '#4CD964']
  }
};

export default function TransactionForm() {
  const router = useRouter();
  const { theme } = useTheme();
  const { addTransaction, updateTransaction, deleteTransaction, transactions } = useTransactions();
  const params = useLocalSearchParams<{ transactionId?: string }>();

  const existingTransaction = params.transactionId 
    ? transactions.find(t => t.id === Number(params.transactionId))
    : null;

  const [title, setTitle] = useState(existingTransaction?.description || '');
  const [amount, setAmount] = useState(existingTransaction ? Math.abs(existingTransaction.amount).toString() : '');
  const [category, setCategory] = useState(existingTransaction?.category || 'Other');
  const [date, setDate] = useState(existingTransaction ? new Date(existingTransaction.date) : new Date());
  const [isRecurring, setIsRecurring] = useState(existingTransaction?.is_recurring || false);
  const [recurringType, setRecurringType] = useState<'daily' | 'weekly' | 'monthly' | 'yearly' | undefined>(
    undefined // Placeholder; use if backend supports
  );
const [isInstallment, setIsInstallment] = useState(false);
const [installments, setInstallments] = useState(1);
const [installmentFrequency, setInstallmentFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [recurringEndDate, setRecurringEndDate] = useState<string | null>(
    existingTransaction?.end_date || null
  );
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>(
    existingTransaction ? (existingTransaction.amount < 0 ? 'expense' : 'income') : 'expense'
  );

  const isEditMode = !!params.transactionId;

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

const validateForm = () => {
  const newErrors: { [key: string]: string } = {};
  if (!title.trim()) newErrors.title = 'Título é obrigatório';
  if (!amount.trim()) {
    newErrors.amount = 'Valor é obrigatório';
  } else {
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue)) {
      newErrors.amount = 'Valor deve ser um número válido';
    } else if (amountValue <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero';
    }
  }
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

// Atualize a função handleSubmit
const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    const transactionsToAdd = [];
    const baseAmount = parseFloat(amount) / (isInstallment ? installments : 1);

    for (let i = 0; i < (isInstallment ? installments : 1); i++) {
      const transactionDate = new Date(date);
      
      // Calcular data do parcelamento
      switch (installmentFrequency) {
        case 'monthly':
          transactionDate.setMonth(transactionDate.getMonth() + i);
          break;
        case 'weekly':
          transactionDate.setDate(transactionDate.getDate() + (i * 7));
          break;
        case 'yearly':
          transactionDate.setFullYear(transactionDate.getFullYear() + i);
          break;
        case 'daily':
          transactionDate.setDate(transactionDate.getDate() + i);
          break;
      }

      transactionsToAdd.push({
        id: Number(params.transactionId),
        amount: transactionType === 'expense' ? -baseAmount : baseAmount,
        description: `${title} (${i + 1}/${installments})`,
        type: transactionType,
        date: transactionDate.toISOString(),
        is_recurring: isRecurring,
        category,
        installmentData: isInstallment ? {
          total: installments,
          current: i + 1,
          frequency: installmentFrequency
        } : null
      });
    }

    if (isEditMode && params.transactionId) {
      await updateTransaction(transactionsToAdd[0]);
    } else {
      await Promise.all(transactionsToAdd.map(t => addTransaction(t)));
    }

    router.replace('/(tabs)/home');
  } catch (error) {
    Alert.alert('Erro', 'Falha ao salvar transação');
  }
};

  const handleDelete = async () => {
    if (params.transactionId) {
      await deleteTransaction(Number(params.transactionId));
      router.replace('/(tabs)/home');
    }
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.form}>
        <View style={styles.typeSelector}>
          <Pressable
            style={[
              styles.typeButton,
              { 
                backgroundColor: transactionType === 'expense' 
                  ? TRANSACTION_COLORS.expense.active 
                  : TRANSACTION_COLORS.expense.inactive,
                borderWidth: transactionType === 'expense' ? 0 : 1,
                transform: [{ scale: transactionType === 'expense' ? 1 : 0.95 }]
              }
            ]}
            onPress={() => setTransactionType('expense')}
          >
            <View style={styles.typeContent}>
              <Ionicons 
                name="arrow-down-circle" 
                size={32}  // Increased size
                color={transactionType === 'expense' 
                  ? TRANSACTION_COLORS.expense.text.active 
                  : TRANSACTION_COLORS.expense.text.inactive
                } 
              />
              <Text style={[
                styles.typeText,
                { 
                  color: transactionType === 'expense' 
                    ? TRANSACTION_COLORS.expense.text.active 
                    : TRANSACTION_COLORS.expense.text.inactive,
                  fontWeight: transactionType === 'expense' ? '700' : '500'
                }
              ]}>
                Expense
              </Text>
            </View>
          </Pressable>
          
          <Pressable
            style={[
              styles.typeButton,
              { 
                backgroundColor: transactionType === 'income' 
                  ? TRANSACTION_COLORS.income.active 
                  : TRANSACTION_COLORS.income.inactive,
                borderColor: transactionType === 'income' 
                  ? TRANSACTION_COLORS.income.active 
                  : theme.border,
                transform: [{ scale: transactionType === 'income' ? 1 : 0.98 }]
              }
            ]}
            onPress={() => setTransactionType('income')}
          >
            <Ionicons 
              name="arrow-up-circle" 
              size={24} 
              color={transactionType === 'income' 
                ? TRANSACTION_COLORS.income.text.active 
                : TRANSACTION_COLORS.income.text.inactive
              } 
              style={styles.typeIcon}
            />
            <Text style={[
              styles.typeText,
              { 
                color: transactionType === 'income' 
                  ? TRANSACTION_COLORS.income.text.active 
                  : TRANSACTION_COLORS.income.text.inactive,
                fontWeight: transactionType === 'income' ? '600' : '400'
              }
            ]}>
              Income
            </Text>
          </Pressable>
        </View>

        <View style={[
          styles.inputContainer,
          { 
            backgroundColor: theme.surface,
            borderColor: transactionType === 'expense' 
              ? TRANSACTION_COLORS.expense.active 
              : TRANSACTION_COLORS.income.active,
          }
        ]}>
          <TextInput
              style={[styles.amountInput, { color: theme.text.primary }]}
              placeholder="0.00"
              placeholderTextColor={theme.text.secondary}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={(text) => {
                // Remove caracteres não numéricos exceto ponto decimal
                const cleanedText = text.replace(/[^0-9.]/g, '');
                // Garante apenas um ponto decimal
                const parts = cleanedText.split('.');
                if (parts.length <= 2) {
                  setAmount(cleanedText);
                }
              }}
            />

            // Adicione mensagens de erro abaixo dos inputs
            {errors.title && (
              <Text style={[styles.errorText, { color: theme.danger }]}>
                {errors.title}
              </Text>
            )}

            {errors.amount && (
              <Text style={[styles.errorText, { color: theme.danger }]}>
                {errors.amount}
              </Text>
            )}
          <TextInput
            style={[styles.titleInput, { color: theme.text.primary }]}
            placeholder="Transaction Title"
            placeholderTextColor={theme.text.secondary}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <Pressable
          style={[styles.input, { 
            borderColor: theme.border,
            backgroundColor: theme.surface
          }]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={{ color: theme.text.primary }}>
            {date.toLocaleDateString()}
          </Text>
        </Pressable>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (selectedDate) {
                setDate(selectedDate);
              }
            }}
          />
        )}

        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Categories</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
        >
          {(transactionType === 'expense' ? expenseCategories : incomeCategories).map((cat) => (
            <Pressable
              key={cat}
              style={[
                styles.categoryChip,
                { 
                  backgroundColor: category === cat ? theme.primary : theme.surface,
                  borderColor: theme.border
                }
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text style={{ 
                color: category === cat ? '#fff' : theme.text.primary 
              }}>
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

<View style={styles.sectionContainer}>
  <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
    Recurring Settings
  </Text>
  <RecurringTransactionSettings
    isRecurring={isRecurring}
    recurringType={recurringType}
    recurringEndDate={recurringEndDate}
    onRecurringChange={setIsRecurring}
    onRecurringTypeChange={setRecurringType}
    onEndDateChange={setRecurringEndDate}
  />

  <View style={styles.sectionContainer}>
  <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
    Parcelamento
  </Text>
  <View style={styles.installmentRow}>
    <Pressable
      style={[styles.toggleButton, isInstallment && styles.activeToggle]}
      onPress={() => setIsInstallment(!isInstallment)}
    >
      <Text style={{ color: isInstallment ? '#fff' : theme.text.primary }}>
        {isInstallment ? 'Ativo' : 'Inativo'}
      </Text>
    </Pressable>
    
    {isInstallment && (
      <>
        <TextInput
          style={[styles.installmentInput, { color: theme.text.primary }]}
          keyboardType="numeric"
          value={String(installments)}
          onChangeText={(t) => setInstallments(Math.max(1, parseInt(t) || 1))}
        />
        <Picker
          selectedValue={installmentFrequency}
          onValueChange={(itemValue) => setInstallmentFrequency(itemValue)}
          style={{ flex: 1 }}
        >
          <Picker.Item label="Mensal" value="monthly" />
          <Picker.Item label="Semanal" value="weekly" />
          <Picker.Item label="Anual" value="yearly" />
          <Picker.Item label="Diário" value="daily" />
        </Picker>
      </>
    )}
  </View>
</View>
</View>
          <Pressable 
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={() => {
              Alert.alert(
                isEditMode ? 'Confirm Update' : 'Confirm Add',
                isEditMode 
                  ? 'Are you sure you want to update this transaction?'
                  : 'Are you sure you want to add this transaction?',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: isEditMode ? 'Update' : 'Add',
                    onPress: handleSubmit,
                  },
                ]
              );
            }}
          >
          <Text style={styles.buttonText}>
            {isEditMode ? 'Update' : 'Add'} Transaction
          </Text>
        </Pressable>

        {isEditMode && (
          <Pressable 
    style={[styles.button, { backgroundColor: '#F44336', marginTop: 12 }]}
    onPress={() => {
      Alert.alert(
        'Confirm Delete',
        'Are you sure you want to delete this transaction? This action cannot be undone.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: handleDelete,
            style: 'destructive',
          },
        ]
      );
    }}
  >
    <Text style={styles.buttonText}>Delete Transaction</Text>
  </Pressable>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 1,
  },
  button: {
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 16,
    paddingHorizontal: 8,
  },
  typeButton: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  typeContent: {
    alignItems: 'center',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 12,
    marginLeft: 4,
  },
  typeIcon: {
    marginRight: 8,
  },
  typeText: {
    fontSize: 18,
    fontWeight: '600',
  },
  inputContainer: {
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
    marginBottom: 24,
    backgroundColor: '#FFF',
  },
  amountInput: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  titleInput: {
    fontSize: 16,
    textAlign: 'center',
  },

  sectionContainer: {
  marginTop: 24,
  marginBottom: 16,
},
}); 