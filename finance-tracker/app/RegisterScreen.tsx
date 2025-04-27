import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import { signUp } from "../services/auth";
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
import { nameValidator } from "../helpers/nameValidator";
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


export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });

  async function handleRegister() {
    try {
      await signUp(name.value, email.value, password.value);
      router.replace('LoginScreen');
    } catch (err) {
      console.error(err);
    }
  }

  const onSignUpPressed = () => {
    const nameError = nameValidator(name.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || passwordError || nameError) {
      setName({ ...name, error: nameError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }
    handleRegister();
    // router.replace('/(tabs)/home');
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
        label="Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text, error: "" })}
        error={!!name.error}
        errorText={name.error}
      />
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
      <Button
        style={{ backgroundColor: '#1e3a8a' }} 
        mode="contained"
        // onPress={handleRegister}
        onPress={onSignUpPressed}
      >
        Create account
      </Button>
      <View style={styles.row}>
        <Text>I already have an account !</Text>
      </View>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => router.replace("LoginScreen")}>
          <Text style={styles.link}>Log in</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
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