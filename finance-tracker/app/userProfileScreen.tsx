import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  Pressable, 
  Alert, 
  ScrollView,
  SafeAreaView,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { Ionicons } from '@expo/vector-icons';
import { formatBirthdayInput } from '../helpers/dateFormatter';
import { nameValidator } from '../helpers/nameValidator';
import { dateValidator } from '../helpers/dateValidator';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function UserProfileScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState({ value: '', error: '' });
  const [lastName, setLastName] = useState({ value: '', error: '' });
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Configurar header como oculto
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const loadUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // const [first, ...rest] = response.data.name.split(' ');
      setFirstName({ value: response.data.first_name, error: '' });
      setLastName({ value: response.data.last_name, error: '' });
      setEmail(response.data.email);
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do usuário.');
    } finally {
      setLoading(false);
    }
  };

  const validateFields = () => {
    const firstNameError = nameValidator(firstName.value);
    const lastNameError = nameValidator(lastName.value);

    setFirstName({ ...firstName, error: firstNameError });
    setLastName({ ...lastName, error: lastNameError });

    return !(firstNameError || lastNameError);
  };

 const updateUser = async () => {
  if (!validateFields()) return;

  if (newPassword && newPassword !== confirmPassword) {
    Alert.alert('Erro', 'As senhas não coincidem.');
    return;
  }

  setSaving(true);
  try {
    const token = await AsyncStorage.getItem('token');
    await api.patch('/users/me', {
      email: email,
      password: newPassword || undefined,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    Alert.alert('Sucesso', 'Dados atualizados com sucesso.');
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    Alert.alert('Erro', 'Não foi possível atualizar os dados do usuário.');
  } finally {
    setSaving(false);
  }
};


  useEffect(() => {
    loadUserData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.text.secondary }]}>
            Carregando perfil...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header com Avatar */}
        <View style={styles.header}>
          <View style={[styles.avatarContainer, { backgroundColor: theme.primary }]}>
            <Ionicons 
              name="person" 
              size={40} 
              color="white" 
            />
          </View>
          <Text style={[styles.title, { color: theme.text.primary }]}>
            Meu perfil
          </Text>
          <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
            Gerenciar suas informações
          </Text>
        </View>

        {/* Card do Formulário */}
        <View style={[styles.formCard, { 
          backgroundColor: theme.surface || theme.background,
          shadowColor: theme.text.primary
        }]}>
          
          {/* First Name */}
          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Ionicons 
                name="person-outline" 
                size={16} 
                color={theme.text.secondary} 
                style={styles.labelIcon}
              />
              <Text style={[styles.label, { color: theme.text.secondary }]}>
                Nome
              </Text>
            </View>
            <View style={[styles.inputContainer, { 
              borderColor: firstName.error ? '#ff4757' : theme.border,
              backgroundColor: theme.inputBackground || theme.surface || theme.background
            }]}>
              <TextInput
                style={[styles.input, { color: theme.text.primary }]}
                value={firstName.value}
                onChangeText={(text) => setFirstName({ value: text, error: '' })}
                editable={false}
                placeholder="Type your first name"
                placeholderTextColor={theme.text.secondary}
              />
            </View>
            {firstName.error && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={14} color="#ff4757" />
                <Text style={styles.errorText}>{firstName.error}</Text>
              </View>
            )}
          </View>

          {/* Last Name */}
          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Ionicons 
                name="person-outline" 
                size={16} 
                color={theme.text.secondary} 
                style={styles.labelIcon}
              />
              <Text style={[styles.label, { color: theme.text.secondary }]}>
                Sobrenome
              </Text>
            </View>
            <View style={[styles.inputContainer, { 
              borderColor: lastName.error ? '#ff4757' : theme.border,
              backgroundColor: theme.inputBackground || theme.surface || theme.background
            }]}>
              <TextInput
                style={[styles.input, { color: theme.text.primary }]}
                value={lastName.value}
                onChangeText={(text) => setLastName({ value: text, error: '' })}
                editable={false}
                placeholder="Type your last name"
                placeholderTextColor={theme.text.secondary}
              />
            </View>
            {lastName.error && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={14} color="#ff4757" />
                <Text style={styles.errorText}>{lastName.error}</Text>
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="mail-outline" size={16} color={theme.text.secondary} style={styles.labelIcon} />
            <Text style={[styles.label, { color: theme.text.secondary }]}>Email</Text>
          </View>
          <View style={[styles.inputContainer, { borderColor: theme.border, backgroundColor: theme.inputBackground || theme.surface }]}>
            <TextInput
              style={[styles.input, { color: theme.text.primary }]}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={theme.text.secondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        
        {/* Nova senha */}
        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="lock-closed-outline" size={16} color={theme.text.secondary} style={styles.labelIcon} />
            <Text style={[styles.label, { color: theme.text.secondary }]}>Nova Senha</Text>
          </View>
          <View style={[styles.inputContainer, { flexDirection: 'row', alignItems: 'center', borderColor: theme.border, backgroundColor: theme.inputBackground || theme.surface }]}>
            <TextInput
              style={[styles.input, { flex: 1, color: theme.text.primary }]}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Senha"
              placeholderTextColor={theme.text.secondary}
              secureTextEntry={!showPassword}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={10}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={theme.text.secondary}
                style={{ paddingHorizontal: 12 }}
              />
            </Pressable>
          </View>
        </View>

        {/* Confirmar nova senha */}
        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="lock-closed-outline" size={16} color={theme.text.secondary} style={styles.labelIcon} />
            <Text style={[styles.label, { color: theme.text.secondary }]}>Confirmar Senha</Text>
          </View>
          <View style={[styles.inputContainer, { flexDirection: 'row', alignItems: 'center', borderColor: theme.border, backgroundColor: theme.inputBackground || theme.surface }]}>
            <TextInput
              style={[styles.input, { flex: 1, color: theme.text.primary }]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirmar senha"
              placeholderTextColor={theme.text.secondary}
              secureTextEntry={!showConfirmPassword}
            />
            <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} hitSlop={10}>
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={theme.text.secondary}
                style={{ paddingHorizontal: 12 }}
              />
            </Pressable>
          </View>
        </View>

          <Pressable 
            style={[styles.saveButton, { 
              backgroundColor: theme.primary,
              opacity: saving ? 0.7 : 1
            }]} 
            onPress={updateUser}
            disabled={saving}
          >
            {saving ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator size="small" color="white" />
                <Text style={styles.buttonText}>Salvando...</Text>
              </View>
            ) : (
              <View style={styles.buttonContent}>
                {/* <Ionicons name="checkmark" size={20} color="white" /> */}
                <Text style={styles.buttonText}>Salvar</Text>
              </View>
            )}
          </Pressable>


          <Pressable
              style={{
                marginTop: 20,
                paddingVertical: 14,
                backgroundColor: '#dc2626',
                borderRadius: 8,
                alignItems: 'center',
              }}
              onPress={() =>
                Alert.alert(
                  'Confirm Deletion',
                  'Are you sure you want to delete your account? This cannot be undone.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: async () => {
                        try {
                          const token = await AsyncStorage.getItem('token');
                          await api.delete('/users/me', {
                            headers: { Authorization: `Bearer ${token}` },
                          });
                          await AsyncStorage.removeItem('token');
                          Alert.alert('Account Deleted', 'Your account has been successfully deleted.');
                          router.replace('/LoginScreen');
                        } catch (error) {
                          console.error('Erro ao excluir usuário:', error);
                          Alert.alert('Error', 'Failed to delete account.');
                        }
                      },
                    },
                  ]
                )
              }
            >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Deletar Conta</Text>
        </Pressable>
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.text.secondary }]}>
            Suas informações pessoais são mantidas em segurança
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  formCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 24,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  inputGroup: {
    marginBottom: 24,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelIcon: {
    marginRight: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  lockBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  inputContainer: {
    borderWidth: 1.5,
    borderRadius: 12,
    overflow: 'hidden',
    transition: 'border-color 0.2s',
  },
  input: {
    padding: 16,
    fontSize: 16,
    minHeight: 50,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  errorText: {
    color: '#ff4757',
    fontSize: 12,
    marginLeft: 4,
    flex: 1,
  },
  saveButton: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.7,
  },
});