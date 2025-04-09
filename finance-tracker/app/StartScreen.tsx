import React from "react";
import { useRouter } from "expo-router";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import Paragraph from "../components/Paragraph";

export default function StartScreen() {
  const router = useRouter();
    
  return (
    <Background>
      <Logo />
      <Header>Welcome to Exlogrn</Header>
      <Paragraph>
        A starter app template for React Native Expo, featuring a ready-to-use
        login screen.
      </Paragraph>
      <Button
        mode="contained"
        onPress={() => router.navigate("LoginScreen")}
      >
        Log in
      </Button>
      <Button
        mode="outlined"
        onPress={() => router.navigate("RegisterScreen")}
      >
        Create an account
      </Button>
    </Background>
  );
}