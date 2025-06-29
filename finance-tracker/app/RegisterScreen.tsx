import React, { useState } from "react";
import { useAuth } from "../contexts/AuthenticationContext";
import { TouchableOpacity, StyleSheet, View, Text, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import Background from "../components/Background";
import Header from "../components/Header";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import BackButton from "../components/BackButton";
import { emailValidator } from "../helpers/emailValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { nameValidator } from "../helpers/nameValidator";
import { Ionicons } from "@expo/vector-icons";
import Paragraph from "../components/Paragraph";
import { dateValidator } from "../helpers/dateValidator";
import { formatBirthdayInput, formatToISO } from "../helpers/dateFormatter";

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [firstName, setFirstName] = useState({ value: "", error: "" });
  const [lastName, setLastName] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [birthday, setBirthday] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [confirmPassword, setConfirmPassword] = useState({ value: "", error: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setIsLoading(true);
      
      const isoBirthday: string = formatToISO(birthday.value) || '';
   
      await signUp(
        email.value,
        password.value,
        firstName.value,
        lastName.value,
        isoBirthday
      );
      
      Alert.alert("Success", "User registered successfully");
      router.push("/(tabs)/home");
    } catch (error: any) {
      console.error("Registration error:", error.response?.data || error);
      let errorMessage = "Failed to register user";
      
      // Tratar erros específicos da API
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = error.response.data.detail || "Invalid data provided";
        } else if (error.response.status === 409) {
          errorMessage = "Email already registered";
        }
      }
      
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onSignUpPressed = () => {
    const firstNameError = nameValidator(firstName.value, "First name");
    const lastNameError = nameValidator(lastName.value, "Last name");
    const emailError = emailValidator(email.value);
    const birthdayError = dateValidator(birthday.value);
    const passwordError = passwordValidator(password.value);
    const confirmPasswordError =
      password.value !== confirmPassword.value ? "Passwords don't match" : "";

    if (
      firstNameError ||
      lastNameError ||
      emailError ||
      birthdayError ||
      passwordError ||
      confirmPasswordError
    ) {
      setFirstName({ ...firstName, error: firstNameError });
      setLastName({ ...lastName, error: lastNameError });
      setEmail({ ...email, error: emailError });
      // setBirthday({ ...birthday, error: birthdayError });
      setPassword({ ...password, error: passwordError });
      setConfirmPassword({ ...confirmPassword, error: confirmPasswordError });
      return;
    }
    handleRegister();
  };

  return (
    <Background style={styles.container}>
      <BackButton goBack={router.back} />
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Ionicons name="wallet" size={60} color="#2563eb" />
        </View>
      </View>
      <Header style={styles.title}>FinWise</Header>
      <Paragraph style={styles.subtitle}>Smart Money Management</Paragraph>

      <View style={styles.nameContainer}>
        <TextInput
          label="Nome"
          placeholder="Insira seu nome"
          style={styles.input}
          returnKeyType="next"
          value={firstName.value}
          onChangeText={(text) => setFirstName({ value: text, error: "" })}
          error={!!firstName.error}
          errorText={firstName.error}
          autoCapitalize="words"
          leftIcon={<Ionicons name="person-outline" size={20} color="#64748b" />}
        />
      
        <TextInput
          label="Sobrenome"
          placeholder="Insira seu sobrenome"
          style={styles.input}
          returnKeyType="next"
          value={lastName.value}
          onChangeText={(text) => setLastName({ value: text, error: "" })}
          error={!!lastName.error}
          errorText={lastName.error}
          autoCapitalize="words"
          leftIcon={<Ionicons name="people-outline" size={20} color="#64748b" />}
        />
      </View>

      <TextInput
        label="Email"
        placeholder="example@email.com"
        style={styles.input}
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: "" })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        keyboardType="email-address"
        leftIcon={<Ionicons name="mail-outline" size={20} color="#64748b" />}
      />

      <TextInput
        label="Data de Nascimento"
        placeholder="DD/MM/YYYY"
        style={styles.input}
        returnKeyType="next"
        value={birthday.value}
        onChangeText={(text) => {
          const formatted = formatBirthdayInput(text);
          setBirthday({ value: formatted, error: "" });
        }}
        error={!!birthday.error}
        errorText={birthday.error}
        keyboardType="number-pad"
        maxLength={10}
        leftIcon={<Ionicons name="calendar-outline" size={20} color="#64748b" />}
      />

      <TextInput
        label="Senha"
        placeholder="No mínimo 8 caracteres"
        style={styles.input}
        returnKeyType="next"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: "" })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry={!showPassword}
        leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#64748b" />}
        rightIcon={
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Ionicons 
              name={showPassword ? "eye-off-outline" : "eye-outline"} 
              size={20} 
              color="#64748b" 
            />
          </TouchableOpacity>
        }
      />

      <TextInput
        label="Confirmar senha"
        placeholder="Confirmar senha"
        style={styles.input}
        returnKeyType="done"
        value={confirmPassword.value}
        onChangeText={(text) => setConfirmPassword({ value: text, error: "" })}
        error={!!confirmPassword.error}
        errorText={confirmPassword.error}
        secureTextEntry={!showConfirmPassword}
        leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#64748b" />}
        rightIcon={
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Ionicons 
              name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
              size={20} 
              color="#64748b" 
            />
          </TouchableOpacity>
        }
      />

      <Button
        style={styles.registerButton}
        labelStyle={styles.buttonLabel}
        mode="contained"
        onPress={onSignUpPressed}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          "Criar Conta"
        )}
      </Button>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Já tem uma conta?</Text>
        <TouchableOpacity 
          onPress={() => router.replace("LoginScreen")}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logoCircle: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    width: 80,
    height: 80,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#fff',
    marginTop: 5,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 0.4,
    marginBottom: 20,
  },
  nameContainer: {
    flexDirection: 'column',
    gap: 1,
    width: '100%',
  },
  nameInput: {
    flex: 1,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    marginVertical: 0,
    elevation: 3,
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    paddingHorizontal: 16,
  },
  inputContainer: {
    flex: 1,
},
  registerButton: {
    backgroundColor: '#2563eb',
    borderRadius: 28,
    paddingVertical: 14,
    marginTop: 15,
    elevation: 5,
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 1,
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(0, 0, 0, 0.9)',
    fontSize: 14,
  },
  link: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});