import React from "react";
import { useRouter } from "expo-router";
import Background from "../components/Background";
import { View, Text, StyleSheet } from 'react-native';
import Header from "../components/Header";
import Button from "../components/Button";
import Paragraph from "../components/Paragraph";
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function StartScreen() {
  const router = useRouter();

  return (
    <Background style={styles.container}>
      <StatusBar hidden />
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Ionicons name="wallet" size={60} color="#2563eb" />
        </View>
      </View>
      <Header style={styles.title}>FinWise</Header>
      <Paragraph style={styles.subtitle}>
        Smart Money Management
      </Paragraph>
      
      <Button
        style={styles.primaryButton}
        labelStyle={styles.buttonLabel}
        mode="contained"
        onPress={() => router.navigate("LoginScreen")}
      >
        Log in
      </Button>
      
      <Button
        style={styles.secondaryButton}
        labelStyle={styles.secondaryButtonLabel}
        mode="outlined"
        onPress={() => router.navigate("RegisterScreen")}
      >
        Create an account
      </Button>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
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
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    borderRadius: 28,
    paddingVertical: 16,
    marginVertical: 10,
    elevation: 5,
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  secondaryButton: {
    borderColor: '#2563eb',
    borderWidth: 2,
    borderRadius: 28,
    paddingVertical: 14,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  secondaryButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
  },
});