import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import { useRouter } from "expo-router";
import Background from "../components/Background";
import BackButton from "../components/BackButton";
import Header from "../components/Header";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import { emailValidator } from "../helpers/emailValidator";
import { Ionicons } from '@expo/vector-icons';
import Paragraph from "../components/Paragraph";

export default function ResetPasswordScreen() {
  const router = useRouter();  
  const [email, setEmail] = useState({ value: "", error: "" });

  const sendResetPasswordEmail = () => {
    const emailError = emailValidator(email.value);
    if (emailError) {
      setEmail({ ...email, error: emailError });
      return;
    }
    router.navigate("LoginScreen");
  };

  return (
    <Background>
      <BackButton goBack={router.goBack} />
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Ionicons name="wallet" size={60} color="#2563eb" />
        </View>
      </View>
      <Header style={styles.title}>FinWise</Header>
      <Paragraph style={styles.subtitle}>
        Smart Money Management
      </Paragraph>
      
      <Header style={styles.resetHeader}>Reset your password</Header>
      <Paragraph style={styles.description}>
        Enter your email to receive the reset link
      </Paragraph>

      <TextInput
        label="Email"
        placeholder="Enter your registered email"
        style={styles.input}
        returnKeyType="done"
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

      <Button
        mode="contained"
        onPress={sendResetPasswordEmail}
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        Send Instructions
      </Button>
    </Background>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginBottom: 25,
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
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    letterSpacing: 0.4,
    marginBottom: 30,
  },
  resetHeader: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    marginVertical: 8,
    elevation: 3,
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    paddingHorizontal: 16,
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 28,
    paddingVertical: 16,
    marginTop: 25,
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
});