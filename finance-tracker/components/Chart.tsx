import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import PieChart from 'react-native-pie-chart';
import { useTransactions } from '../contexts/TransactionContext';
import { useTheme } from '../contexts/ThemeContext';
import { expenseCategories } from '../constants/categories';

type CategoryKey = keyof typeof CATEGORY_COLORS;

const CATEGORY_COLORS = {
  'Food': '#FF6B6B',
  'Transport': '#45B7D1',
  'Shopping': '#4ECDC4',
  'Entertainment': '#FFEEAD',
  'Bills': '#96CEB4',
  'Other': '#D4A5A5',
};


export default function Chart() {
  const { transactions } = useTransactions();
  const { theme } = useTheme();
  const [selectedSlice, setSelectedSlice] = useState<string | null>(null);

  const CHART_COLORS = {
    income: '#4CAF50',
    // expenses: '#F44336',
  };

  // Calcular total de receitas
  const incomeTotal = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  // Calcular totais por categoria de despesa
  const expenseTotals = expenseCategories
    .map(category => {
      const total = transactions
        .filter(t => t.type === 'expense' && t.category === category)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      return { category, total };
    })
    .filter(item => item.total > 0);

  // Preparar dados para o gráfico
  const hasIncome = incomeTotal > 0;
  const series = [
    ...(hasIncome ? [incomeTotal] : []),
    ...expenseTotals.map(t => t.total)
  ];
  
  const sliceColor = [
    ...(hasIncome ? [CHART_COLORS.income] : []),
    ...expenseTotals.map(t => CATEGORY_COLORS[t.category as CategoryKey])
  ];

  // Legendas do gráfico
  const legendLabels = [
    ...(hasIncome ? ['Income'] : []),
    ...expenseTotals.map(t => t.category)
  ];

  // Verificar se há dados para exibir
  const total = series.reduce((a, b) => a + b, 0);
  if (total === 0) {
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

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: theme.surface }]}>
        <Text style={[styles.title, { color: theme.text.primary }]}>Chart</Text>
        <PieChart
          widthAndHeight={250}
          series={series}
          sliceColor={sliceColor}
        />

      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.legendScrollContent}
      >
        <View style={styles.legendContainer}>
          {legendLabels.map((label, index) => {
            const percentage = ((series[index] / total) * 100).toFixed(1);
            return (
              <View key={index} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: sliceColor[index] }]} />
                <Text style={[styles.legendText, { color: theme.text.primary }]}>
                  {label} ({percentage}%)
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
      </View>
    </ScrollView>
  );
}

// Os estilos permanecem EXATAMENTE os mesmos
const styles = StyleSheet.create({
    legendScrollContent: {
    paddingHorizontal: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    minHeight: 40,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    paddingVertical: 4,
  },
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