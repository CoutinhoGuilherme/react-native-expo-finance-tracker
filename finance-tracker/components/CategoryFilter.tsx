import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
type IconNames = keyof typeof Ionicons.glyphMap;

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const categoryIcons: { [key: string]: IconNames } = {
  'Food': 'restaurant',
  'Bills': 'shield',
  'Shopping': 'cart',
  'Transport': 'car',
  'Housing': 'home',
  'Entertainment': 'game-controller',
  'Healthcare': 'medical',
  'Education': 'school',
  'Utilities': 'flash',
  'Travel': 'airplane',
  'Insurance': 'shield-checkmark',
  'Personal Care': 'person',
  'Gifts': 'gift',
  'Investments': 'trending-up',
  'Salary': 'cash',
  'Business': 'briefcase',
  'Freelance': 'laptop',
  'Rental': 'key',
  'Refunds': 'return-up-back',
  'Other': 'ellipsis-horizontal',
};

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.sectionTitle, { color: theme.text.secondary }]}>Categorias</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <CategoryChip
          label="Todos"
          icon="apps"
          selected={!selectedCategory}
          onPress={() => onSelectCategory(null)}
          theme={theme}
        />
        {categories.map((category) => (
          <CategoryChip
            key={category}
            label={category}
            icon={categoryIcons[category] || 'help-circle'}
            selected={selectedCategory === category}
            onPress={() => onSelectCategory(category)}
            theme={theme}
          />
        ))}
      </ScrollView>
    </View>
  );
}

interface CategoryChipProps {
  label: string;
  icon: IconNames;
  selected: boolean;
  onPress: () => void;
  theme: any;
}

function CategoryChip({ label, icon, selected, onPress, theme }: CategoryChipProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? theme.primary : theme.surface,
          borderColor: theme.border,
          shadowColor: theme.shadowColor,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
      onPress={onPress}
      android_ripple={{ color: theme.border }}
    >
      <Ionicons 
        name={icon} 
        size={18} 
        color={selected ? '#fff' : theme.text.primary} 
      />
      <Text style={[styles.chipText, { color: selected ? '#fff' : theme.text.primary }]}> {label} </Text>
      {selected && (
        <Ionicons name="checkmark-circle" size={14} color="#fff" style={{ marginLeft: 4 }} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 12,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  container: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingVertical: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  chipText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '500',
  },
});