import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, // Mudado de TouchableOpacity para Pressable para consistência
  ScrollView, 
  SafeAreaView, // Adicionado
  Platform 
} from 'react-native';
// import { Link } from 'expo-router'; // Não usado diretamente para itens de lista aqui
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useTransactions } from '../../contexts/TransactionContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import Chart from '../../components/Chart';
// TransactionItem não será mais usado diretamente, vamos re-renderizar no estilo SettingItem
// import TransactionItem from '../../components/TransactionItem'; 
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
// import Transactions from './transactions'; // Não parece estar sendo usado no código fornecido

// Importando Dimensions como na tela Settings, caso necessário para estilos futuros
import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

// Definindo o tipo para o nosso novo TransactionSettingItem, similar ao SettingItemProps
type TransactionSettingItemProps = {
  icon: { 
    name: keyof typeof Ionicons.glyphMap;
    bg: string 
  };
  title: string;
  subtitle?: string;
  amount: string;
  amountColor: string;
  onPress?: () => void;
  isLast?: boolean;
};

export default function Home() {
  const { theme } = useTheme();
  const { transactions } = useTransactions();
  const { currency } = useCurrency();
  const router = useRouter();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const loadUsername = async () => {
      const name = await AsyncStorage.getItem('username');
      if (name) setUsername(name);
    };
    loadUsername();
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('token').then(token => {
      if (!token) {
        router.replace('/LoginScreen'); 
      }
    });
  }, []);
  
  const totals = transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === 'income') {
        acc.income += transaction.amount;
      } else {
        acc.expenses += Math.abs(transaction.amount);
      }
      acc.balance = acc.income - acc.expenses;
      return acc;
    },
    { balance: 0, income: 0, expenses: 0 }
  );

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const handleAddTransaction = () => {
    router.push('/transactionForm');
  };

  // Componente TransactionSettingItem para replicar o visual do SettingItem da tela de Configurações
  const TransactionSettingItem = ({ icon, title, subtitle, amount, amountColor, onPress, isLast }: TransactionSettingItemProps) => (
    <Pressable
      style={[
        styles.settingItem, 
        { 
          backgroundColor: theme.surface || theme.background,
          borderBottomColor: theme.border,
          borderBottomWidth: isLast ? 0 : 1
        }
      ]}
      onPress={onPress}
      android_ripple={{ color: theme.border }}
    >
      <View style={[styles.iconContainer, { backgroundColor: icon.bg }]}>
        <Ionicons name={icon.name} size={20} color="#fff" />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: theme.text.primary }]} numberOfLines={1}>{title}</Text>
        {subtitle && <Text style={[styles.settingSubtitle, { color: theme.text.secondary }]}>{subtitle}</Text>}
      </View>
      <View style={styles.transactionDetails}>
        <Text style={[styles.transactionAmount, { color: amountColor }]}>{amount}</Text>
        <Ionicons name="chevron-forward" size={20} color={theme.text.secondary} style={{ marginLeft: 4 }}/>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* Header Adaptado */}
        <View style={styles.header}>
          <View style={[styles.headerIconContainer, { backgroundColor: theme.primary }]}>
            <Ionicons name="wallet-outline" size={32} color="white" />
          </View>
          <Text style={[styles.headerTitle, { color: theme.text.primary }]}>
            Saldo Atual: {currency.symbol}{totals.balance.toFixed(2)}
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.text.secondary }]}>
            Olá, {username} 👋 ({new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric' })})
          </Text>
        </View>

        {/* Stats Cards Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text.secondary, marginLeft: 4 }]}>Resumo Financeiro</Text>
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: theme.surface, shadowColor: theme.shadow || theme.text.primary }]}>
              <View style={[styles.statIconContainer, { backgroundColor: '#4CAF50'}]}>
                <Ionicons name="arrow-up-outline" size={22} color="#fff" />
              </View>
              <Text style={[styles.statLabel, { color: theme.text.secondary }]}>Receitas</Text>
              <Text style={[styles.statAmount, { color: theme.text.primary }]}>
                {currency.symbol}{totals.income.toFixed(2)}
              </Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.surface, shadowColor: theme.shadow || theme.text.primary }]}>
              <View style={[styles.statIconContainer, { backgroundColor: '#F44336'}]}>
                <Ionicons name="arrow-down-outline" size={22} color="#fff" />
              </View>
              <Text style={[styles.statLabel, { color: theme.text.secondary }]}>Despesas</Text>
              <Text style={[styles.statAmount, { color: theme.text.primary }]}>
                {currency.symbol}{totals.expenses.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      
        {/* Chart Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text.secondary, marginLeft: 4 }]}>Visão Geral Gráfica</Text>
          <View style={[styles.sectionContent, { backgroundColor: theme.surface, shadowColor: theme.shadow || theme.text.primary, padding: 10 }]}>
            <Chart /> 
          </View>
        </View>

        {/* Add Transaction Button - Estilo mais robusto */}
        <View style={styles.addButtonContainer}>
          <Pressable 
            style={({ pressed }) => [
              styles.addButton, 
              { backgroundColor: theme.primary },
              pressed && { opacity: 0.8 }
            ]}
            onPress={handleAddTransaction}
            android_ripple={{ color: theme.primaryDark || theme.primary }}
          >
            <Ionicons name="add-circle-outline" size={24} color="#fff" style={{marginRight: 10}} />
            <Text style={styles.addButtonText}>Adicionar Transação</Text>
          </Pressable>
        </View>

        {/* Recent Transactions Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text.secondary, marginLeft: 4 }]}>Transações Recentes</Text>
          <View style={[styles.sectionContent, { backgroundColor: theme.surface, shadowColor: theme.shadow || theme.text.primary }]}>
            {recentTransactions.length > 0 ? recentTransactions.map((transaction, index) => (
              <TransactionSettingItem
                key={transaction.id}
                icon={{ 
                  name: transaction.type === 'income' ? 'arrow-up' : 'arrow-down', 
                  bg: transaction.type === 'income' ? '#4CAF50' : '#F44336' 
                }}
                title={transaction.description}
                subtitle={new Date(transaction.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                amount={`${transaction.type === 'income' ? '+' : '-'}${currency.symbol}${Math.abs(transaction.amount).toFixed(2)}`}
                amountColor={transaction.type === 'income' ? (theme.success || '#4CAF50') : (theme.danger || '#F44336')}
                onPress={() => router.push({ 
                  pathname: '/transactionForm', 
                  params: { transactionId: String(transaction.id) } 
                })}
                isLast={index === recentTransactions.length - 1}
              />
            )) : (
              <View style={styles.emptyStateContainer}>
                <Ionicons name="reader-outline" size={48} color={theme.text.secondary} />
                <Text style={[styles.emptyStateText, {color: theme.text.secondary}]}>Nenhuma transação recente.</Text>
              </View>
            )}
          </View>
        </View>

        {/* Footer (opcional, mas para manter consistência com Settings) */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.text.secondary }]}>
            Dados financeiros atualizados.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20, // Similar to Settings
  },
  header: { // Adaptado do Settings Header
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderBottomWidth: 1, // Pode adicionar uma borda se quiser separar visualmente
    // borderBottomColor: theme.border, // Precisa do theme aqui ou passar via inline style
  },
  headerIconContainer: { // Do Settings
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
  headerTitle: { // Adaptado do Settings 'title'
    fontSize: 22, // Um pouco menor para acomodar o saldo
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: { // Adaptado do Settings 'subtitle'
    fontSize: 15,
    textAlign: 'center',
    opacity: 0.8,
  },
  section: { // Do Settings
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: { // Do Settings
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5, // Ajustado para melhor leitura
    paddingHorizontal: 4, 
  },
  sectionContent: { // Do Settings
    borderRadius: 16,
    overflow: 'hidden', // Para que os SettingItems internos respeitem o borderRadius
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, // Suavizado
    shadowRadius: 10, // Suavizado
    elevation: 3, // Ajustado
  },
  statsRow: { // Original do Home, mas dentro de uma 'section'
    flexDirection: 'row',
    gap: 16, // Espaçamento entre os cards
  },
  statCard: { // Estilização refinada
    flex: 1,
    padding: 16,
    borderRadius: 12, // Consistente com iconContainer
    alignItems: 'center', // Centraliza conteúdo do card
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  statIconContainer: { // Similar ao iconContainer dos SettingItems
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8, // Espaço antes do label
  },
  statLabel: {
    fontSize: 13, // Menor para dar destaque ao valor
    opacity: 0.8,
    marginBottom: 4,
  },
  statAmount: {
    fontSize: 17, // Ajustado
    fontWeight: '600',
  },
  addButtonContainer: { // Para centralizar ou dar margem ao botão
    paddingHorizontal: 20,
    marginVertical: 8, // Espaço antes e depois do botão
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14, // Mais confortável ao toque
    paddingHorizontal: 20,
    borderRadius: 12, // Consistente
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16, // Ajustado
    fontWeight: '600',
  },
  // Estilos para TransactionSettingItem (baseados no SettingItem de Settings)
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14, // Ajustado
    paddingHorizontal: 16, // Ajustado
    minHeight: 60, // Ajustado
  },
  iconContainer: { // Do Settings
    width: 36, // Ajustado para transações
    height: 36, // Ajustado
    borderRadius: 10, // Ajustado
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: { // Do Settings
    flex: 1,
    marginRight: 12,
    justifyContent: 'center', // Alinha melhor o texto se o subtitulo for curto
  },
  settingTitle: { // Do Settings
    fontSize: 15, // Ajustado
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: { // Do Settings
    fontSize: 12, // Ajustado
    opacity: 0.8,
    lineHeight: 16,
  },
  transactionDetails: { // Para o valor e chevron nas transações
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: '600',
  },
  emptyStateContainer: {
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    marginTop: 8,
    fontSize: 14,
    opacity: 0.7,
  },
  footer: { // Do Settings
    paddingHorizontal: 20,
    paddingTop: 20, // Adiciona espaço acima do footer
    paddingBottom: Platform.OS === 'ios' ? 0 : 10, // Para evitar corte em alguns androids
    alignItems: 'center',
  },
  footerText: { // Do Settings
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 16,
  },
});