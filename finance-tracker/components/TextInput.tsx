import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { TextInput as Input } from "react-native-paper";
import { theme } from "../contexts/ThemeContext";

export default function TextInput({
  errorText,
  description,
  leftIcon,
  rightIcon,
  ...props
}) {
  return (
    <View style={styles.container}>
      <Input
        style={styles.input}
        selectionColor="#1e3a8a"
        underlineColor="transparent"
        mode="outlined"
        left={leftIcon ? <Input.Icon icon={() => leftIcon} /> : undefined}
        right={rightIcon ? <Input.Icon icon={() => rightIcon} /> : undefined}
        {...props}
      />
      {description && !errorText ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 12,
  },
  input: {
    backgroundColor: theme.colors.surface,
  },
  description: {
    fontSize: 13,
    color: theme.colors.secondary,
    paddingTop: 8,
  },
  error: {
    fontSize: 13,
    color: theme.colors.error,
    paddingTop: 8,
  },
});
