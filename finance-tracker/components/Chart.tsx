import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import PieChart from 'react-native-pie-chart';
import { useTransactions } from '../contexts/TransactionContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Chart() {
  const { transactions } = useTransactions();
  const { theme } = useTheme();
  const [selectedSlice, setSelectedSlice] = useState<string | null>(null);

  const CHART_COLORS = {
    income: '#4CAF50',
    expenses: '#F44336',
  };

  // Calcular os totais de receita e despesas com verificação de valores
  const totals = transactions.reduce(
    (acc, transaction) => {
      if (transaction.amount > 0) {
        acc.income += transaction.amount;
      } else {
        acc.expenses += Math.abs(transaction.amount);
      }
      return acc;
    },
    { income: 0, expenses: 0 }
  );

  const income = totals.income || 0;
  const expenses = totals.expenses || 0;

  // Garantir que a soma dos valores seja maior que 0
  if (income + expenses === 0) {
    return (
      <ScrollView style={{ flex: 1 }}>
        <View style={[styles.container, { backgroundColor: theme.surface }]}>
          <Text style={[styles.title, { color: theme.text.primary }]}>
            There aren't any transactions to be shown.
          </Text>
        </View>
      </ScrollView>
    );
  }

  const series = [income, expenses];
  const sliceColor = [CHART_COLORS.income, CHART_COLORS.expenses];

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: theme.surface }]}>
        <Text style={[styles.title, { color: theme.text.primary }]}>Chart</Text>
        <PieChart
          widthAndHeight={250}
          series={series}
          sliceColor={sliceColor}
        />
        <View style={styles.legendContainer}>
          {['Income', 'Expenses'].map((label, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: sliceColor[index] }]} />
              <Text style={[styles.legendText, { color: theme.text.primary }]}>{label}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    margin: 10,
  },
  legendContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
  },
});
