import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, Image, StyleSheet, Pressable } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";

type Props = {
  goBack: () => void;
};

export default function BackButton({ goBack }: { goBack: () => void }) {
  const { theme } = useTheme();
  
  return (
    <Pressable onPress={goBack} style={styles.container}>
      <Ionicons 
        name="arrow-back" 
        size={24} 
        color={theme.text.primary} 
      />
    </Pressable>
  );
}


const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 10 + getStatusBarHeight(),
    left: 4,
  },
  image: {
    width: 24,
    height: 24,
  },
});