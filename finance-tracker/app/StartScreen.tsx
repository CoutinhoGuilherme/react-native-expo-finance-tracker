import React from "react";
import { useRouter } from "expo-router";
import Background from "../components/Background";
import { View, Text, StyleSheet } from 'react-native';
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import Paragraph from "../components/Paragraph";
import { useTheme } from '../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  withSpring, 
  useAnimatedStyle, 
  useSharedValue,
  withSequence,
  withTiming,
  runOnJS
} from 'react-native-reanimated';


export default function StartScreen() {
  const router = useRouter();
  const { theme } = useTheme();  
  
  return (
    <Background>
        <View style={styles.logoContainer}>
          <Ionicons name="wallet" size={100} color="#fff" />
        </View>
      <Header style={styles.title}>FinWise</Header>
      <Paragraph style={styles.subtitle}>
      Smart Money Management
      </Paragraph>
      <Button
        style={{ backgroundColor: '#1e3a8a' }} 
        mode="contained"
        onPress={() => router.navigate("LoginScreen")}
      >
        Log in
      </Button>
      <Button
        style={{ color: '#1e3a8a' }} 
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
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    // marginBottom: 10,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 0.5,
    marginBottom: 50,
  },
}); 