import { useState, useCallback } from 'react'; // Added useCallback
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Pressable,
  Dimensions, 
  Animated, 
  Alert,
  SafeAreaView // Added
} from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useTransactions } from '../../contexts/TransactionContext';
// TransactionItem import will be effectively replaced by custom rendering for UI consistency
// import TransactionItem from '../../components/TransactionItem'; 
import { Swipeable } from 'react-native-gesture-handler';
import { useCurrency } from '../../contexts/CurrencyContext';
import CategoryFilter from '../../components/CategoryFilter'; // Will style its container
import { expenseCategories, incomeCategories } from '../../constants/categories';

type Transaction = {
  description: string;
  id: number; // Ensure ID is number if used as such for delete/edit
  amount: number;
  type: string;
  category: string;
  date: string | Date;
};

const { width } = Dimensions.get('window');

// Helper function to format currency amounts
const formatCurrencyDisplay = (amount: number, currencySymbol: string, type?: 'income' | 'expense' | 'balance') => {
  const isNegative = type === 'expense' || (type === 'balance' && amount < 0);
  const absAmount = Math.abs(amount).toFixed(2);
  return `${isNegative ? '-' : ''}${currencySymbol}${absAmount}`;
};


const typeIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  all: 'list-outline', // Changed for better visual
  income: 'arrow-up-outline', // Changed for consistency
  expense: 'arrow-down-outline' // Changed for consistency
};

// Category icons mapping (example, expand as needed)
const categoryIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  Alimentação: 'fast-food-outline',
  Salário: 'cash-outline',
  Transporte: 'bus-outline',
  Compras: 'cart-outline',
  Health: 'heart-outline',
  Educação: 'school-outline',
  Contas: 'document-text-outline',
  Lazer: 'film-outline',
  Outros: 'apps-outline',
  Groceries: 'basket-outline',
  Rent: 'home-outline',
  Utilities: 'flash-outline',
  Presente: 'gift-outline'
};


export default function Transactions() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const { transactions, deleteTransaction } = useTransactions();
  const { currency } = useCurrency();

  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredTransactions = transactions
  .flatMap((transaction) => {
    const transactionsToShow = [transaction];
    
    // Gerar próxima ocorrência apenas se for transação recorrente
    if (transaction.isRecurring) {
      const currentDate = new Date(transaction.date);
      const periodsToShow = 2; // Mostrar próximos 2 períodos

      for (let i = 1; i <= periodsToShow; i++) {
        const nextDate = new Date(currentDate);
        
        switch (transaction.recurringType) {
          case 'daily':
            nextDate.setDate(nextDate.getDate() + i);
            break;
          case 'weekly':
            nextDate.setDate(nextDate.getDate() + (i * 7));
            break;
          case 'monthly':
            nextDate.setMonth(nextDate.getMonth() + i);
            break;
          case 'yearly':
            nextDate.setFullYear(nextDate.getFullYear() + i);
            break;
        }

        // Verificar se a data gerada não ultrapassa a data final (se existir)
        if (!transaction.end_date || nextDate <= new Date(transaction.end_date)) {
          transactionsToShow.push({
            ...transaction,
            id: transaction.id + i, // ID único para instâncias
            date: nextDate.toISOString(),
            isRecurringInstance: true // Marcar como instância gerada
          });
        }
      }
    }
    return transactionsToShow;
  })
  .filter(transaction => {
    const typeMatch = selectedType === 'all' || transaction.type === selectedType;
    const categoryMatch = !selectedCategory || transaction.category === selectedCategory;
    const searchMatch = transaction.description
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return typeMatch && categoryMatch && searchMatch;
  })
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const currentCategories = selectedType === 'income' ? incomeCategories : 
                          selectedType === 'expense' ? expenseCategories :
                          [...new Set([...incomeCategories, ...expenseCategories])].sort();

  const handleDelete = useCallback((id: number) => {
    Alert.alert(
      "Excluir Transação",
      "Tem certeza que deseja excluir esta transação?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          onPress: async () => {
            try {
              await deleteTransaction(id);
            } catch (error) {
              Alert.alert('Erro', 'Falha ao excluir transação.');
            }
          },
          style: "destructive"
        }
      ]
    );
  }, [deleteTransaction]);

  const handleEdit = useCallback((id: number) => { // Ensure id is number
    router.push({
      pathname: '/transactionForm',
      params: { transactionId: String(id) } // Convert id to string for params
    });
  }, [router]);

  const renderRightActions = (id: number, dragX: Animated.AnimatedInterpolation<number>) => {
    const trans = dragX.interpolate({
      inputRange: [-80, 0], // Shorter swipe distance for action
      outputRange: [0, 80],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View 
        style={{ 
          width: 80, 
          transform: [{ translateX: trans }], 
          flexDirection: 'row', 
          height: '100%' // Ensure it takes full height of the item
        }}
      >
        <Pressable // Changed to Pressable for consistency
          style={[styles.swipeAction, { backgroundColor: theme.danger || '#FF3B30' }]}
          onPress={() => handleDelete(id)}
          android_ripple={{ color: 'rgba(255,255,255,0.3)'}}
        >
          <Ionicons name="trash-outline" size={22} color="#fff" />
          {/* <Text style={styles.swipeActionText}>Delete</Text> */}
        </Pressable>
      </Animated.View>
    );
  };

// Correções: usar filteredTransactions para refletir filtros aplicados
const totalIncome = filteredTransactions
  .filter(t => t.type === 'income')
  .reduce((sum, t) => sum + t.amount, 0); // ← LINHA ALTERADA

const totalExpense = filteredTransactions
  .filter(t => t.type === 'expense')
  .reduce((sum, t) => sum + t.amount, 0); // ← LINHA ALTERADA

// Substituir o cálculo atual do netBalance por:
const netBalance = filteredTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);


  // Reusable SettingItem-like component for transactions
  const TransactionRowItem = ({ item, isLast }: { item: Transaction, isLast: boolean }) => {
    const itemIcon = categoryIcons[item.category] || (item.type === 'income' ? typeIcons.income : typeIcons.expense);
    const iconBg = item.type === 'income' ? (theme.success || '#4CAF50') : (theme.danger || '#F44336');

    return (
      <Swipeable
        friction={2}
        overshootFriction={8}
        rightThreshold={40}
        renderRightActions={(progress, dragX) => renderRightActions(item.id, dragX)}
        containerStyle={{ 
          backgroundColor: theme.surface || theme.background, // Ensures swipe background matches item
          borderBottomColor: theme.border,
          borderBottomWidth: isLast ? 0 : 1,
        }}
      >
        <Pressable
          style={[styles.settingItem]} // No dynamic background or border here, handled by Swipeable container
          onPress={() => handleEdit(item.id)}
          android_ripple={{ color: theme.border }}
        >
          <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
            <Ionicons name={itemIcon} size={20} color="#fff" />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: theme.text.primary }]} numberOfLines={1}>{item.description}</Text>
            <Text style={[styles.settingSubtitle, { color: theme.text.secondary }]} numberOfLines={1}>
              {new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric' })} - {item.category}
            </Text>
          </View>
        <View style={styles.transactionDetails}>
            <Text style={[styles.transactionAmount, { color: item.type === 'income' ? (theme.success ||'#4CAF50') : (theme.danger || '#F44336') }]}>
              {formatCurrencyDisplay(item.amount, currency.symbol, item.type as 'income' | 'expense')}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={theme.text.secondary} style={{ marginLeft: 4 }}/>
          </View>
        </Pressable>
      </Swipeable>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      
      {/* Header (Settings Style) */}
      <View style={styles.pageHeader}>
        <View style={[styles.pageHeaderIconContainer, { backgroundColor: theme.primary }]}>
          <Ionicons name="list-circle-outline" size={32} color="white" />
        </View>
        <Text style={[styles.pageTitle, { color: theme.text.primary }]}>
          Histórico de Transações
        </Text>
        <Text style={[styles.pageSubtitle, { color: theme.text.secondary }]}>
          Gerencie suas movimentações financeiras
        </Text>
      </View>

      {/* Fixed Content Area: Summary, Search, Filters */}
      <View style={styles.fixedContentContainer}>
        {/* Summary Card Section */}
        <View style={[styles.summaryCard, { backgroundColor: theme.surface, shadowColor: theme.shadow || theme.text.primary }]}>
          <View style={styles.balanceSection}>
            <Text style={[styles.balanceLabel, { color: theme.text.secondary }]}>Saldo Total</Text>
            <Text style={[styles.balanceValue, { color: netBalance >= 0 ? (theme.success || '#4CAF50') : (theme.danger || '#F44336')}]}>
              {formatCurrencyDisplay(netBalance, currency.symbol, 'balance')}
            </Text>
          </View>
          <View style={styles.summaryStatsRow}>
            <View style={styles.summaryStatItem}>
              <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 4}}>
                <View style={[styles.summaryDot, { backgroundColor: theme.success || '#4CAF50' }]} />
                <Text style={[styles.summaryStatLabel, { color: theme.text.secondary }]}>Receitas</Text>
              </View>
              <Text style={[styles.summaryStatValue, { color: theme.success || '#4CAF50' }]}>
                {formatCurrencyDisplay(totalIncome, currency.symbol, 'income')}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryStatItem}>
              <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 4}}>
                <View style={[styles.summaryDot, { backgroundColor: theme.danger || '#F44336' }]} />
                <Text style={[styles.summaryStatLabel, { color: theme.text.secondary }]}>Despesas</Text>
              </View>
              <Text style={[styles.summaryStatValue, { color: theme.danger || '#F44336' }]}>
                {formatCurrencyDisplay(totalExpense, currency.symbol, 'expense')}
              </Text>
            </View>
          </View>
        </View>

        {/* Search Bar Section */}
        <View style={[styles.searchBarContainer, { backgroundColor: theme.surface, shadowColor: theme.shadow || theme.text.primary }]}>
          <Ionicons name="search-outline" size={20} color={theme.text.secondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.text.primary }]}
            placeholder="Buscar transações..."
            placeholderTextColor={theme.text.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={theme.text.secondary} />
            </Pressable>
          ) : null}
        </View>

        {/* Filters Section */}
        <View style={styles.filtersSection}>
          <Text style={[styles.sectionTitleAlt, { color: theme.text.secondary, marginLeft: 0 }]}>Filtrar por Tipo</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChipsContainer}>
            {['all', 'income', 'expense'].map((type) => (
              <Pressable
                key={type}
                style={[
                  styles.filterChip,
                  { 
                    backgroundColor: selectedType === type ? theme.primary : theme.surface,
                    borderColor: selectedType === type ? theme.primary : theme.border,
                    shadowColor: theme.shadow || theme.text.primary
                  }
                ]}
                onPress={() => { setSelectedType(type as any); setSelectedCategory(null); }}
                android_ripple={{ color: selectedType === type ? 'rgba(255,255,255,0.3)' : theme.border }}
              >
                <Ionicons 
                  name={typeIcons[type as keyof typeof typeIcons]} 
                  size={16} 
                  color={selectedType === type ? '#fff' : theme.text.primary} 
                  style={{ marginRight: 6 }}
                />
                <Text style={{ color: selectedType === type ? '#fff' : theme.text.primary, fontSize: 13, fontWeight: '600' }}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
          
          { (selectedType === 'income' || selectedType === 'expense') && currentCategories.length > 0 && (
            <>
              <Text style={[styles.sectionTitleAlt, { color: theme.text.secondary, marginLeft: 0, marginTop: 12 }]}>
                Filtrar por Categoria ({selectedType === 'income' ? 'Receitas' : 'Despesas'})
              </Text>
              <CategoryFilter // Assuming CategoryFilter handles its own internal styling based on theme
                categories={currentCategories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                // Pass theme if CategoryFilter supports it, or style container
              />
            </>
          )}
        </View>
      </View>
      

      {/* Transactions List Section */}
      <View style={[styles.section, { flex: 1, paddingHorizontal: 0 /* Section padding handled by list content */}]}>
        <View style={[styles.sectionContent, { 
          flex: 1, 
          backgroundColor: 'transparent', // Section content is just a wrapper here
          shadowOpacity: 0, // No shadow for the wrapper itself, items will have it via swipeable
          elevation: 0,
          borderRadius: 0, // No border radius for wrapper, items might have it
          marginHorizontal: 20, // Add horizontal margin to the list section
          marginTop: 0, // Reduce top margin as fixed content has its own
        }]}>
          <FlatList
            data={filteredTransactions}
            keyExtractor={(item) => String(item.id)}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => <TransactionRowItem item={item} isLast={index === filteredTransactions.length - 1} />}
            ListEmptyComponent={
              <View style={styles.emptyListContainer}>
                <MaterialCommunityIcons name="magnify-scan" size={50} color={theme.text.secondary} />
                <Text style={[styles.emptyListTitle, { color: theme.text.primary }]}>Nenhuma Transação Encontrada</Text>
                <Text style={[styles.emptyListText, { color: theme.text.secondary }]}>
                  Ajuste os filtros ou adicione uma nova transação.
                </Text>
              </View>
            }
            contentContainerStyle={{ paddingBottom: 80 }} // Space for FAB
          />
        </View>
      </View>

      {/* FAB */}
      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: theme.primary }]}
        activeOpacity={0.8}
        onPress={() => router.push('/transactionForm')}
      >
        <Ionicons name="add-outline" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  // Page Header (Settings Style)
  pageHeader: {
    alignItems: 'center',
    paddingVertical: 24, // Reduced padding
    paddingHorizontal: 20,
    // borderBottomWidth: 1, // Optional: if you want a separator
    // borderBottomColor: theme.border, // Needs theme access or pass inline
  },
  pageHeaderIconContainer: {
    width: 56, // Slightly smaller
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  pageSubtitle: {
    fontSize: 15,
    textAlign: 'center',
    opacity: 0.8,
  },

  // Fixed Content Area (Summary, Search, Filters)
  fixedContentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16, // Space before list starts
    borderBottomWidth: 1,
    // borderBottomColor: theme.border, // Needs theme or pass inline
  },
  summaryCard: {
    borderRadius: 16, // Consistent with sectionContent
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  balanceSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.7,
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 26,
    fontWeight: '700',
  },
  summaryStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  summaryStatLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.7,
  },
  summaryStatValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  summaryDivider: {
    width: 1,
    // height: '80%', // Or fixed height
    backgroundColor: 'rgba(0,0,0,0.1)', // theme.border
    alignSelf: 'center',
    height: 30,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
//     paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    borderRadius: 12, // Consistent
    marginBottom: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  filtersSection: {
    marginBottom: 8, // Space before list starts
  },
  sectionTitleAlt: { // For filter titles
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterChipsContainer: {
    paddingBottom: 8, // if horizontal scroll has many items
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20, // Pill shape
    marginRight: 10,
    borderWidth: 1, // For non-active state
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  
  // Section styles from Settings.js
  section: { 
    marginBottom: 0, // Adjusted as list is main content
    // paddingHorizontal: 20, // Moved to fixedContentContainer and list's sectionContent margin
  },
  sectionContent: { 
    borderRadius: 16,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  // Styles for TransactionRowItem (based on SettingItem)
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 64, // Good touch target
    // backgroundColor is handled by Swipeable container for border effect
  },
  iconContainer: {
    width: 38, 
    height: 38, 
    borderRadius: 10, 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
    marginRight: 12,
    justifyContent: 'center',
    gap: 2,
  },
  settingTitle: {
    fontSize: 12, 
    fontWeight: '600',
    marginBottom: 3,
  },
  settingSubtitle: {
    fontSize: 12, 
    opacity: 0.8,
    lineHeight: 16,
    textAlign: 'left',
    marginLeft: -40,
  },
  transactionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: '30%',
    flexShrink: 0,
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: '600',
  },
  swipeAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80, // Match Animated.View width
    height: '100%',
  },
  swipeActionText: { // If you want text in swipe action
    color: '#fff',
    fontSize: 13,
    marginTop: 2,
  },

  // Empty List
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: 40, // Give some space from filters
  },
  emptyListTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyListText: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 20,
  },

  // FAB
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});