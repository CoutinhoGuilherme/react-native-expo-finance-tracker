import React, { useState, useEffect } from 'react';
import { 
  View, 
  FlatList, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useCurrency, currencies } from '../contexts/CurrencyContext';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

type CurrencyItemProps = {
  item: { code: string; symbol: string; name?: string };
  onSelect: (currency: { code: string; symbol: string }) => void;
  isSelected: boolean;
  theme: any;
};

const CurrencyItem = ({ item, onSelect, isSelected, theme }: CurrencyItemProps) => (
  <TouchableOpacity
    style={[
      styles.currencyItem,
      {
        backgroundColor: theme.surface || theme.background,
        borderColor: isSelected ? theme.primary : theme.border,
        borderWidth: isSelected ? 2 : 1
      }
    ]}
    onPress={() => onSelect(item)}
    activeOpacity={0.7}
  >
    <View style={styles.currencyContent}>
      <View style={[styles.symbolContainer, { 
        backgroundColor: isSelected ? theme.primary : theme.primaryLight || theme.border 
      }]}>
        <Text style={[styles.symbolText, { 
          color: isSelected ? 'white' : theme.text.primary 
        }]}>
          {item.symbol}
        </Text>
      </View>
      <View style={styles.currencyInfo}>
        <Text style={[styles.currencyCode, { color: theme.text.primary }]}>
          {item.code}
        </Text>
        <Text style={[styles.currencyName, { color: theme.text.secondary }]}>
          {item.name || getCurrencyName(item.code)}
        </Text>
      </View>
    </View>
    {isSelected && (
      <View style={[styles.checkIcon, { backgroundColor: theme.primary }]}>
        <Ionicons name="checkmark" size={16} color="white" />
      </View>
    )}
  </TouchableOpacity>
);

// Função auxiliar para obter nomes das moedas
const getCurrencyName = (code: string): string => {
  const currencyNames: { [key: string]: string } = {
    'USD': 'Dólar Americano',
    'EUR': 'Euro',
    'BRL': 'Real Brasileiro',
    'GBP': 'Libra Esterlina',
    'JPY': 'Iene Japonês',
    'CAD': 'Dólar Canadense',
    'AUD': 'Dólar Australiano',
    'CHF': 'Franco Suíço',
    'CNY': 'Yuan Chinês',
    'INR': 'Rupia Indiana',
    'KRW': 'Won Sul-coreano',
    'MXN': 'Peso Mexicano',
    'RUB': 'Rublo Russo',
    'ZAR': 'Rand Sul-africano',
    'SGD': 'Dólar de Singapura',
    'HKD': 'Dólar de Hong Kong',
    'NOK': 'Coroa Norueguesa',
    'SEK': 'Coroa Sueca',
    'DKK': 'Coroa Dinamarquesa',
    'PLN': 'Zloty Polonês'
  };
  return currencyNames[code] || code;
};

export default function CurrencySelect() {
  const { theme } = useTheme();
  const { currency: currentCurrency, setCurrency } = useCurrency();
  const [searchText, setSearchText] = useState('');
  const [filteredCurrencies, setFilteredCurrencies] = useState(currencies);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredCurrencies(currencies);
    } else {
      const filtered = currencies.filter(currency =>
        currency.code.toLowerCase().includes(searchText.toLowerCase()) ||
        getCurrencyName(currency.code).toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredCurrencies(filtered);
    }
  }, [searchText]);

  const handleSelect = async (currency: { code: string; symbol: string }) => {
    setLoading(true);
    try {
      setCurrency(currency);
      setTimeout(() => {
        setLoading(false);
        router.back();
      }, 300);
    } catch (error) {
      setLoading(false);
      console.error('Erro ao selecionar moeda:', error);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={[styles.headerIconContainer, { backgroundColor: theme.primary }]}>
        <Ionicons name="cash" size={28} color="white" />
      </View>
      <Text style={[styles.title, { color: theme.text.primary }]}>
        Selecionar Moeda
      </Text>
      <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
        Escolha sua moeda preferida para exibição
      </Text>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={[styles.searchBar, { 
        backgroundColor: theme.surface || theme.background,
        borderColor: theme.border
      }]}>
        <Ionicons 
          name="search" 
          size={20} 
          color={theme.text.secondary} 
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, { color: theme.text.primary }]}
          placeholder="Buscar moeda..."
          placeholderTextColor={theme.text.secondary}
          value={searchText}
          onChangeText={setSearchText}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchText.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchText('')}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={20} color={theme.text.secondary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="search" size={48} color={theme.text.secondary} />
      <Text style={[styles.emptyText, { color: theme.text.secondary }]}>
        Nenhuma moeda encontrada
      </Text>
      <Text style={[styles.emptySubtext, { color: theme.text.secondary }]}>
        Tente buscar por outro termo
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.text.secondary }]}>
            Aplicando moeda...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={filteredCurrencies}
        keyExtractor={(item) => item.code}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {renderHeader()}
            {renderSearchBar()}
          </>
        }
        ListEmptyComponent={renderEmptyState}
        renderItem={({ item }) => (
          <CurrencyItem
            item={item}
            onSelect={handleSelect}
            isSelected={item.code === currentCurrency.code}
            theme={theme}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      
      {/* Current Selection Footer */}
      <View style={[styles.footer, { 
        backgroundColor: theme.surface || theme.background,
        borderTopColor: theme.border
      }]}>
        <View style={styles.currentSelection}>
          <Text style={[styles.currentLabel, { color: theme.text.secondary }]}>
            Moeda atual:
          </Text>
          <View style={styles.currentCurrency}>
            <Text style={[styles.currentCode, { color: theme.primary }]}>
              {currentCurrency.code}
            </Text>
            <Text style={[styles.currentSymbol, { color: theme.text.primary }]}>
              ({currentCurrency.symbol})
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  headerIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 48,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  clearButton: {
    padding: 4,
  },
  currencyItem: {
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  currencyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  symbolContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  symbolText: {
    fontSize: 18,
    fontWeight: '700',
  },
  currencyInfo: {
    flex: 1,
  },
  currencyCode: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  currencyName: {
    fontSize: 14,
    opacity: 0.8,
  },
  checkIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.8,
    textAlign: 'center',
  },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  currentSelection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  currentCurrency: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentCode: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
  },
  currentSymbol: {
    fontSize: 16,
  },
});