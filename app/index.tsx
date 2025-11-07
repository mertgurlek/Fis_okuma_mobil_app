/**
 * Splash Screen - Giriş Ekranı
 * 
 * Uygulama başlangıç ekranı
 */

import { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme, useAuth } from '@hooks';
import { spacing, textStyles } from '@theme';

export default function SplashScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isAuthenticated, checkAuth } = useAuth();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // 1 saniye splash göster
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Kimlik doğrulamasını kontrol et
        const authValid = await checkAuth();

        // Yönlendirme
        if (authValid && isAuthenticated) {
          router.replace('/(tabs)');
        } else {
          router.replace('/(auth)/login');
        }
      } catch (error) {
        console.error('Splash error:', error);
        router.replace('/(auth)/login');
      }
    };

    initializeApp();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      {/* Logo Area */}
      <View style={styles.logoContainer}>
        <Text style={[styles.logo, textStyles.h1, { color: colors.white }]}>
          📄
        </Text>
        <Text style={[styles.title, textStyles.h1, { color: colors.white }]}>
          Fiş Okuma
        </Text>
        <Text style={[styles.subtitle, textStyles.body, { color: colors.white }]}>
          Fiş ve fatura yönetimi
        </Text>
      </View>

      {/* Loading */}
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.white} />
        <Text style={[styles.loadingText, textStyles.caption, { color: colors.white }]}>
          Yükleniyor...
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  logo: {
    fontSize: 80,
    marginBottom: spacing.md,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  subtitle: {
    opacity: 0.9,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: spacing.xxxl,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.sm,
    opacity: 0.8,
  },
});
