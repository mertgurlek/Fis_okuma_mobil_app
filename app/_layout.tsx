/**
 * Root Layout - Ana Layout
 * 
 * Expo Router root layout
 */

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { useTheme } from '@hooks';
import Head from 'expo-router/head';

// Web için global CSS
if (Platform.OS === 'web') {
  require('../global.css');
}

export default function RootLayout() {
  const { isDark } = useTheme();

  return (
    <>
      {Platform.OS === 'web' && (
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <style>{`
            body { 
              touch-action: pan-y;
              -webkit-user-select: none;
              -webkit-tap-highlight-color: transparent;
            }
          `}</style>
        </Head>
      )}
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}
