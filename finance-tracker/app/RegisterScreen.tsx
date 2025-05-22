import React, { useState } from "react";
import { useAuth } from "../contexts/AuthenticationContext";
import { TouchableOpacity, StyleSheet, View, Text, Alert } from "react-native";
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
import { formatBirthdayInput } from "../helpers/dateFormatter";

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [name, setName] = useState({ value: "", error: "" });
  const [lastName, setLastName] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [birthday, setBirthday] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [confirmPassword, setConfirmPassword] = useState({ value: "", error: "" });

  const handleRegister = async () => {
    try {
      await signUp(
        email.value,
        password.value,
        `${name.value} ${lastName.value}`,
        birthday.value
      );
      Alert.alert("Success", "User registered successfully");
      router.push("/(tabs)/home");
    } catch (error: any) {
      console.error("Registration error:", error);
      Alert.alert("Error", error.message || "Failed to register user");
    }
  };

  const onSignUpPressed = () => {
    const nameError = nameValidator(name.value);
    const lastNameError = nameValidator(lastName.value);
    const emailError = emailValidator(email.value);
    const birthdayError = dateValidator(birthday.value);
    const passwordError = passwordValidator(password.value);
    const confirmPasswordError =
      password.value !== confirmPassword.value ? "Passwords don't match" : "";

    if (
      nameError ||
      lastNameError ||
      emailError ||
      birthdayError ||
      passwordError ||
      confirmPasswordError
    ) {
      setName({ ...name, error: nameError });
      setLastName({ ...lastName, error: lastNameError });
      setEmail({ ...email, error: emailError });
      setBirthday({ ...birthday, error: birthdayError });
      setPassword({ ...password, error: passwordError });
      setConfirmPassword({ ...confirmPassword, error: confirmPasswordError });
      return;
    }
    handleRegister();
  };

  return (
    <Background>
      <BackButton goBack={router.goBack} />
      <View style={styles.logoContainer}>
        <Ionicons name="wallet" size={100} color="#fff" />
      </View>
      <Header style={styles.title}>FinWise</Header>
      <Paragraph style={styles.subtitle}>Smart Money Management</Paragraph>

      <TextInput
        label="First Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text, error: "" })}
        error={!!name.error}
        errorText={name.error}
      />

      <TextInput
        label="Last Name"
        returnKeyType="next"
        value={lastName.value}
        onChangeText={(text) => setLastName({ value: text, error: "" })}
        error={!!lastName.error}
        errorText={lastName.error}
      />

      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: "" })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        label="Birthday (DD/MM/YYYY)"
        returnKeyType="next"
        value={birthday.value}
        onChangeText={(text) => {
          const formatted = formatBirthdayInput(text);
          setBirthday({ value: formatted, error: "" });
        }}
        error={!!birthday.error}
        errorText={birthday.error}
        placeholder="DD/MM/YYYY"
        keyboardType="number-pad"
        maxLength={10}
      />

      <TextInput
        label="Password"
        returnKeyType="next"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: "" })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />

      <TextInput
        label="Confirm Password"
        returnKeyType="done"
        value={confirmPassword.value}
        onChangeText={(text) =>
          setConfirmPassword({ value: text, error: "" })
        }
        error={!!confirmPassword.error}
        errorText={confirmPassword.error}
        secureTextEntry
      />

      <Button
        style={{ backgroundColor: "#1e3a8a" }}
        mode="contained"
        onPress={onSignUpPressed}
      >
        Create account
      </Button>

      <View style={styles.row}>
        <Text style={styles.text}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.replace("LoginScreen")}>
          <Text style={styles.link}> Login</Text>
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
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  link: {
    fontWeight: "bold",
    color: "#fff",
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    color: "rgba(255,255,255,0.8)",
    letterSpacing: 0.5,
    marginBottom: 50,
  },
});
