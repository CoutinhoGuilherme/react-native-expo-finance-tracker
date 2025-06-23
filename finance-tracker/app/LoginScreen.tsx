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
import { Ionicons } from '@expo/vector-icons';
import Paragraph from "../components/Paragraph";

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await signIn(email.value, password.value);
      // Alert.alert('Sucesso', 'Login realizado com sucesso');
      router.replace("/(tabs)/home");
    } catch (error) {
      Alert.alert('Erro', 'Credenciais inválidas');
    } finally {
      setIsLoading(false);
    }
  };

  const onLoginPressed = () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }
    handleLogin();
  };

  return (
    <Background>
      <BackButton goBack={router.back} />
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Ionicons name="wallet" size={60} color="#2563eb" />
        </View>
      </View>
      <Header style={styles.title}>FinWise</Header>
      <Paragraph style={styles.subtitle}>
        Smart Money Management
      </Paragraph>

      <TextInput
        label="Email"
        placeholder="Insira seu email"
        style={styles.input}
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: "" })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        leftIcon={<Ionicons name="mail-outline" size={20} color="#64748b" />}
      />

      <TextInput
        label="Senha"
        placeholder="Insira sua senha"
        style={styles.input}
        returnKeyType="done"
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

      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => router.navigate("ResetPasswordScreen")}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Text style={styles.forgot}>Esqueceu sua senha?</Text>
        </TouchableOpacity>
      </View>

      <Button 
        style={styles.loginButton} 
        labelStyle={styles.buttonLabel} 
        mode="contained" 
        onPress={onLoginPressed}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          "Log in"
        )}
      </Button>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Ainda não tem uma conta?</Text>
        <TouchableOpacity 
          onPress={() => router.replace("RegisterScreen")}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Text style={styles.link}>Criar Conta</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCircle: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    width: 120,
    height: 120,
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
    fontSize: 38,
    fontWeight: '800',
    color: '#fff',
    marginTop: 15,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 0.4,
    marginBottom: 30,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    marginVertical: 1,
    elevation: 3,
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    paddingHorizontal: 16,
  },
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 15,
  },
  forgot: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#2563eb',
    borderRadius: 28,
    paddingVertical: 16,
    marginTop: 20,
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
    marginTop: 24,
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