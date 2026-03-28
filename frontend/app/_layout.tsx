import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '../src/store/authStore';
import { useThemeStore } from '../src/store/themeStore';
import { useLanguageStore } from '../src/store/languageStore';

export default function RootLayout() {
  const loadStoredAuth = useAuthStore((s) => s.loadStoredAuth);
  const { mode, colors: theme, loadTheme } = useThemeStore();
  const loadLanguage = useLanguageStore((s) => s.loadLanguage);

  useEffect(() => {
    loadStoredAuth();
    loadTheme();
    loadLanguage();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.bg }}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.bg },
          animation: 'default',
          animationDuration: 230,
          freezeOnBlur: true,
          gestureEnabled: true,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="upload" />
        <Stack.Screen name="camera" />
        <Stack.Screen name="history" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="result" />
        <Stack.Screen name="accountInfo" />
        <Stack.Screen name="appSettings" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="admin" />
      </Stack>
    </GestureHandlerRootView>
  );
}
