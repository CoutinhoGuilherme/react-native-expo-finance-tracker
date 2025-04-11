import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
// import { Text } from "react-native-paper";
import { useRouter } from "expo-router";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import BackButton from "../components/BackButton";
import { theme } from "../contexts/ThemeContext";
import { emailValidator } from "../helpers/emailValidator";
import { passwordValidator } from "../helpers/passwordValidator";
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
import Paragraph from "../components/Paragraph";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });

  const onLoginPressed = () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }
    router.replace('/(tabs)/home');
  };

  return (
    <Background>
      <BackButton goBack={router.goBack} />
      <View style={styles.logoContainer}>
        <Ionicons name="wallet" size={100} color="#fff" />
      </View>
            <Header style={styles.title}>FinWise</Header>
            <Paragraph style={styles.subtitle}>
            Smart Money Management
            </Paragraph>
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: "" })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: "" })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => router.navigate("ResetPasswordScreen")}
        >
          <Text style={styles.forgot}>Forgot your password ?</Text>
        </TouchableOpacity>
      </View>
      <Button style={{ backgroundColor: '#1e3a8a' }} mode="contained" onPress={onLoginPressed}>
        Log in
      </Button>
      <Button icon="logo-google" style={{ backgroundColor: '#000' }} mode="contained" onPress={onLoginPressed}>
        Log in with Google
      </Button>
      <View style={styles.row}>
        <Text>Don't have an account yet ?</Text>
      </View>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => router.replace("RegisterScreen")}>
          <Text style={styles.link}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    marginBottom: 20,
  },
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  forgot: {
    fontWeight: "bold",
    fontSize: 13,
    color: "#fff",
  },
  link: {
    fontWeight: "bold",
    color: "#fff",
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