// app/languageSelect.tsx
import React from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { languages } from '../contexts/LanguageContext';
import { router } from 'expo-router';

export default function LanguageSelect() {
  const { theme } = useTheme();

  const handleSelect = (language: { code: string; name: string }) => {
    console.log('Idioma selecionado:', language); // substitua pelo setLanguage()
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={languages}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, { backgroundColor: theme.surface }]}
            onPress={() => handleSelect(item)}
          >
            <Text style={[styles.text, { color: theme.text.primary }]}>
              {item.flag} {item.nativeName || item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  text: {
    fontSize: 16,
  },
});
