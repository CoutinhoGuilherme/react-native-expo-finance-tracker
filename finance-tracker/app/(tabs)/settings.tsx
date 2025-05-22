import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  ScrollView, 
  Alert, 
  SafeAreaView,
  Dimensions 
} from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemeToggle } from '../../components/ThemeToggle';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useLanguage } from '../../contexts/LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

type SettingItemProps = {
  icon: { 
    name: keyof typeof Ionicons.glyphMap;
    bg: string 
  };
  title: string;
  subtitle?: string;
  onPress?: () => void;
  children?: React.ReactNode;
  isLast?: boolean;
};

export default function Settings() {
  const { theme } = useTheme();
  const { currency } = useCurrency();
  const { language } = useLanguage();

  const SettingItem = ({ icon, title, subtitle, onPress, children, isLast }: SettingItemProps) => (
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
        <Ionicons name={icon.name} size={22} color="#fff" />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: theme.text.primary }]}>{title}</Text>
        {subtitle && <Text style={[styles.settingSubtitle, { color: theme.text.secondary }]}>{subtitle}</Text>}
      </View>
      <View style={styles.settingAction}>
        {children}
      </View>
    </Pressable>
  );

  const handleLogout = () => {
    Alert.alert(
      'Confirmação',
      'Deseja realmente sair da sua conta?',
      [
        { 
          text: 'Cancelar', 
          style: 'cancel' 
        },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('token');
              await AsyncStorage.removeItem('username');
              router.replace('/LoginScreen');
            } catch (error) {
              console.error('Erro ao fazer logout:', error);
            }
          }
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.headerIconContainer, { backgroundColor: theme.primary }]}>
            <Ionicons name="settings" size={32} color="white" />
          </View>
          <Text style={[styles.title, { color: theme.text.primary }]}>
            Configurações
          </Text>
          <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
            Personalize sua experiência
          </Text>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text.secondary }]}>
            Preferências
          </Text>
          <View style={[
            styles.sectionContent, 
            { 
              backgroundColor: theme.surface || theme.background,
              shadowColor: theme.text.primary
            }
          ]}>
            <SettingItem
              icon={{ name: 'person-outline', bg: '#667eea' }}
              title="Meu Perfil"
              subtitle="Gerencie suas informações pessoais"
              onPress={() => router.push('/userProfileScreen')}
            >
              <Ionicons name="chevron-forward" size={20} color={theme.text.secondary} />
            </SettingItem>

            <SettingItem
              icon={{ name: 'moon-outline', bg: '#764ba2' }}
              title="Modo Escuro"
              subtitle="Altere o tema da aplicação"
            >
              <ThemeToggle />
            </SettingItem>

            <SettingItem
              icon={{ name: 'cash-outline', bg: '#56ab2f' }}
              title="Moeda"
              subtitle={`${currency.code} - ${currency.symbol}`}
              onPress={() => router.push('/currencySelect')}
            >
              <Ionicons name="chevron-forward" size={20} color={theme.text.secondary} />
            </SettingItem>

            <SettingItem
              icon={{ name: 'globe-outline', bg: '#f093fb' }}
              title="Idioma"
              subtitle={`${language.flag} ${language.nativeName || language.name}`}
              onPress={() => router.push('/languageSelect')}
              isLast
            >
              <Ionicons name="chevron-forward" size={20} color={theme.text.secondary} />
            </SettingItem>
          </View>
        </View>

        {/* Legal Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text.secondary }]}>
            Legal
          </Text>
          <View style={[
            styles.sectionContent, 
            { 
              backgroundColor: theme.surface || theme.background,
              shadowColor: theme.text.primary
            }
          ]}>
            <SettingItem
              icon={{ name: 'document-text-outline', bg: '#ff9a9e' }}
              title="Termos & Condições"
              subtitle="Leia nossos termos de uso"
              onPress={() => router.push('/policyModal?type=terms')}
            >
              <Ionicons name="chevron-forward" size={20} color={theme.text.secondary} />
            </SettingItem>

            <SettingItem
              icon={{ name: 'shield-checkmark-outline', bg: '#a8edea' }}
              title="Política de Privacidade"
              subtitle="Como protegemos seus dados"
              onPress={() => router.push('/policyModal?type=privacy')}
              isLast
            >
              <Ionicons name="chevron-forward" size={20} color={theme.text.secondary} />
            </SettingItem>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text.secondary }]}>
            Sobre
          </Text>
          <View style={[
            styles.sectionContent, 
            { 
              backgroundColor: theme.surface || theme.background,
              shadowColor: theme.text.primary
            }
          ]}>
            <SettingItem
              icon={{ name: 'information-circle-outline', bg: '#ffecd2' }}
              title="Versão do App"
              subtitle="1.0.0"
              isLast
            >
              <View style={[styles.versionBadge, { backgroundColor: theme.primaryLight || theme.primary }]}>
                <Text style={styles.versionText}>v1.0</Text>
              </View>
            </SettingItem>
          </View>
        </View>

        {/* Logout Section */}
        <View style={styles.section}>
          <View style={[
            styles.sectionContent, 
            { 
              backgroundColor: theme.surface || theme.background,
              shadowColor: theme.text.primary
            }
          ]}>
            <SettingItem
              icon={{ name: 'log-out-outline', bg: '#ff6b6b' }}
              title="Sair da Conta"
              subtitle="Desconectar do aplicativo"
              onPress={handleLogout}
              isLast
            >
              <Ionicons name="chevron-forward" size={20} color="#ff6b6b" />
            </SettingItem>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.text.secondary }]}>
            Todas as configurações são sincronizadas automaticamente
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
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
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 4,
  },
  sectionContent: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    minHeight: 64,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  settingContent: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    opacity: 0.8,
    lineHeight: 18,
  },
  settingAction: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  versionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    opacity: 0.8,
  },
  versionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 16,
  },
});