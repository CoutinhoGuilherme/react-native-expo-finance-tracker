import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import PieChart from 'react-native-pie-chart';
import { useTransactions } from '../contexts/TransactionContext';
import { useTheme } from '../contexts/ThemeContext';
import { expenseCategories } from '../constants/categories';

type CategoryKey = keyof typeof CATEGORY_COLORS;

const CATEGORY_COLORS = {
  'Alimentação': '#FF6B6B',
  'Transporte': '#45B7D1',
  'Compras': '#4ECDC4',
  'Lazer': '#FFEEAD',
  'Contas': '#96CEB4',
  'Outros': '#D4A5A5',
};

const { width } = Dimensions.get('window');

export default function Chart({ selectedMonth, onMonthChange }: { 
  selectedMonth: Date, 
  onMonthChange: (date: Date) => void 
}) {
  const { transactions } = useTransactions();
  const { theme } = useTheme();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  // Filtra transações pelo mês selecionado
  const filteredTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return (
      transactionDate.getMonth() === selectedMonth.getMonth() &&
      transactionDate.getFullYear() === selectedMonth.getFullYear()
    );
  });

  // Gera lista de meses para o scroll horizontal
  const generateMonths = () => {
    const months = [];
    for (let i = 0; i < 12; i++) {
      months.push(new Date(currentYear, i));
    }
    return months;
  };

  // Calcular totais
  const calculateTotals = () => {
    const incomeTotal = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenseTotals = expenseCategories
      .map(category => {
        const total = filteredTransactions
          .filter(t => t.type === 'expense' && t.category === category)
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        return { category, total };
      })
      .filter(item => item.total > 0);

    return { incomeTotal, expenseTotals };
  };

  const { incomeTotal, expenseTotals } = calculateTotals();

  const hasIncome = incomeTotal > 0;
  const series = [
    ...(hasIncome ? [incomeTotal] : []),
    ...expenseTotals.map(t => t.total)
  ];
  
  const sliceColor = [
    ...(hasIncome ? ['#4CAF50'] : []),
    ...expenseTotals.map(t => CATEGORY_COLORS[t.category as CategoryKey])
  ];

  const legendLabels = [
    ...(hasIncome ? ['Receitas'] : []),
    ...expenseTotals.map(t => t.category)
  ];

  const total = series.reduce((a, b) => a + b, 0);

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      {/* Scroll horizontal de meses */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.monthsContainer}
      >
        {generateMonths().map((date, index) => {
          const isSelected = date.getMonth() === selectedMonth.getMonth();
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.monthButton,
                {
                  backgroundColor: isSelected ? theme.primary : theme.background,
                  borderColor: theme.border
                }
              ]}
              onPress={() => onMonthChange(date)}
            >
              <Text style={[
                styles.monthText,
                { color: isSelected ? '#FFF' : theme.text.primary }
              ]}>
                {date.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Gráfico */}
      {total === 0 ? (
        <Text style={[styles.title, { color: theme.text.primary }]}>
          Nenhuma transação neste mês
        </Text>
      ) : (
        <>
          <PieChart
            widthAndHeight={Math.min(width * 0.8, 250)}
            series={series}
            sliceColor={sliceColor}
          />

          {/* Legenda */}
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
        </>
      )}
    </View>
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
    monthsContainer: {
    paddingVertical: 8,
    marginBottom: 16,
  },
    monthButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  monthText: {
    fontSize: 14,
    fontWeight: '500',
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
    // justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
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