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

const { width } = Dimensions.get('window');

export default function UserProfileScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState({ value: '', error: '' });
  const [lastName, setLastName] = useState({ value: '', error: '' });
  const [birthday, setBirthday] = useState({ value: '', error: '' });
  const [email, setEmail] = useState('');
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
      
      const [first, ...rest] = response.data.name.split(' ');
      setFirstName({ value: first, error: '' });
      setLastName({ value: rest.join(' '), error: '' });
      setBirthday({ value: response.data.birthday, error: '' });
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
    const birthdayError = dateValidator(birthday.value);

    setFirstName({ ...firstName, error: firstNameError });
    setLastName({ ...lastName, error: lastNameError });
    setBirthday({ ...birthday, error: birthdayError });

    return !(firstNameError || lastNameError || birthdayError);
  };

  const updateUser = async () => {
    if (!validateFields()) return;

    setSaving(true);
    try {
      const token = await AsyncStorage.getItem('token');
      await api.put('/users/me', { 
        name: `${firstName.value} ${lastName.value}`,
        birthday: birthday.value
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
            Loading profile...
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
            My profile
          </Text>
          <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
            Manage your informations
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
                Name
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
                Last Name
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

          {/* Birthday */}
          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Ionicons 
                name="calendar-outline" 
                size={16} 
                color={theme.text.secondary} 
                style={styles.labelIcon}
              />
              <Text style={[styles.label, { color: theme.text.secondary }]}>
                Birthday
              </Text>
            </View>
            <View style={[styles.inputContainer, { 
              borderColor: birthday.error ? '#ff4757' : theme.border,
              backgroundColor: theme.inputBackground || theme.surface || theme.background
            }]}>
              <TextInput
                style={[styles.input, { color: theme.text.primary }]}
                value={birthday.value}
                onChangeText={(text) => {
                  const formatted = formatBirthdayInput(text);
                  setBirthday({ value: formatted, error: '' });
                }}
                placeholder="DD/MM/AAAA"
                placeholderTextColor={theme.text.secondary}
                keyboardType="number-pad"
                maxLength={10}
              />
            </View>
            {birthday.error && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={14} color="#ff4757" />
                <Text style={styles.errorText}>{birthday.error}</Text>
              </View>
            )}
          </View>

          {/* Email (não editável) */}
          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Ionicons 
                name="mail-outline" 
                size={16} 
                color={theme.text.secondary} 
                style={styles.labelIcon}
              />
              <Text style={[styles.label, { color: theme.text.secondary }]}>
                Email
              </Text>
              <View style={[styles.lockBadge, { backgroundColor: theme.surfaceDisabled || theme.border }]}>
                <Ionicons name="lock-closed" size={10} color={theme.text.secondary} />
              </View>
            </View>
            <View style={[styles.inputContainer, { 
              borderColor: theme.border,
              backgroundColor: theme.surfaceDisabled || theme.border,
              opacity: 0.7
            }]}>
              <TextInput
                style={[styles.input, { color: theme.text.secondary }]}
                value={email}
                editable={false}
                placeholder="Email não editável"
                placeholderTextColor={theme.text.secondary}
              />
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
                <Text style={styles.buttonText}>Saving...</Text>
              </View>
            ) : (
              <View style={styles.buttonContent}>
                {/* <Ionicons name="checkmark" size={20} color="white" /> */}
                <Text style={styles.buttonText}>Save</Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.text.secondary }]}>
            Your personal information is kept safe
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