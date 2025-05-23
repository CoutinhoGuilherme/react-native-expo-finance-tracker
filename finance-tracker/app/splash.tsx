import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  withSpring, 
  useAnimatedStyle, 
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

export default function SplashScreen() {
  const { theme } = useTheme();
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);
  const offset = useSharedValue(30);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: offset.value }],
    opacity: opacity.value,
  }));

  useEffect(() => {
    scale.value = withSpring(1, { damping: 10, stiffness: 100 });
    offset.value = withSpring(0, { damping: 15 });
    opacity.value = withTiming(1, { duration: 800 });

    const timer = setTimeout(() => {
      router.replace('/StartScreen');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      <Animated.View style={[styles.content, animatedStyle]}>
        <View style={styles.logoCircle}>
          <Ionicons name="wallet" size={60} color="#2563eb" />
        </View>
        <Animated.Text style={styles.title}>FinWise</Animated.Text>
        <Animated.Text style={styles.subtitle}>Smart Money Management</Animated.Text>
      </Animated.View>
    </View>
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
    marginBottom: 25,
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    letterSpacing: 0.5,
    marginTop: 15,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 0.4,
    marginTop: 8,
  },
});