/**
 * Login Screen - Modern Giriş Ekranı
 * Responsive, animasyonlu ve gradient efektli
 */

import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTheme, useAuth } from '@hooks';
import { Button, Input } from '@components';
import { 
  spacing as spacingSystem, 
  textStyles,
  responsiveSpacing,
  moderateScale,
  getContainerWidth,
  deviceInfo,
  gradients,
  elevation,
  duration,
  easing,
} from '@theme';
import { isValidEmail } from '@utils/validators';
import { useFirmaStore } from '@store';

const spacing = spacingSystem.spacing;

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { login, loginDemo, isLoading } = useAuth();
  const { fetchFirmaList } = useFirmaStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ username: '', password: '' });
  
  // Animasyonlar
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: duration.slow,
        easing: easing.smooth,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validate = () => {
    const newErrors = { username: '', password: '' };
    let isValid = true;

    if (!username.trim()) {
      newErrors.username = 'Kullanıcı adı gerekli';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Şifre gerekli';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalı';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    const result = await login({ username, password });
    if (result.success) {
      router.replace('/(tabs)');
    } else {
      setErrors({ ...errors, password: result.error || 'Giriş başarısız' });
    }
  };

  const handleDemoLogin = async () => {
    const result = await loginDemo();
    if (result.success) {
      // Firma listesini otomatik yükle
      await fetchFirmaList();
      router.replace('/(tabs)');
    }
  };

  const handleSignup = () => {
    router.push('/(auth)/signup');
  };

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={gradients.primaryLight}
        style={StyleSheet.absoluteFill}
      />
      
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            style={[
              styles.contentContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={[styles.logoContainer, elevation[4]]}>
                <Text style={styles.logoText}>📄</Text>
              </View>
              <Text style={[styles.title, textStyles.h1, { color: colors.white }]}>
                Hoş Geldiniz
              </Text>
              <Text style={[styles.subtitle, textStyles.body, { color: 'rgba(255, 255, 255, 0.9)' }]}>
                Devam etmek için giriş yapın
              </Text>
            </View>

            {/* Form Card */}
            <View style={[styles.formCard, { backgroundColor: colors.surface }, elevation[3]]}>
              <Input
                label="Kullanıcı Adı"
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  setErrors({ ...errors, username: '' });
                }}
                error={errors.username}
                autoCapitalize="none"
                autoCorrect={false}
                variant="outlined"
              />

              <Input
                label="Şifre"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrors({ ...errors, password: '' });
                }}
                error={errors.password}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                variant="outlined"
              />

              <Button
                title="Giriş Yap"
                onPress={handleLogin}
                loading={isLoading}
                fullWidth
                variant="gradient"
                elevation={true}
              />
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: 'rgba(255, 255, 255, 0.3)' }]} />
              <Text style={[styles.dividerText, textStyles.caption, { color: 'rgba(255, 255, 255, 0.9)' }]}>
                veya
              </Text>
              <View style={[styles.dividerLine, { backgroundColor: 'rgba(255, 255, 255, 0.3)' }]} />
            </View>

            {/* Demo & Signup */}
            <View style={styles.actions}>
              <Button
                title="Demo Modunda Deneyin"
                variant="ghost"
                onPress={handleDemoLogin}
                fullWidth
                textStyle={{ color: colors.white }}
              />

              <View style={[styles.signupCard, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}>
                <Text style={[textStyles.caption, { color: 'rgba(255, 255, 255, 0.9)', textAlign: 'center' }]}>
                  Hesabınız yok mu?
                </Text>
                <Button
                  title="Hesap Oluştur"
                  variant="outline"
                  onPress={handleSignup}
                  fullWidth
                  textStyle={{ color: colors.white }}
                  style={{ borderColor: colors.white, marginTop: spacing.xs }}
                />
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    minHeight: '100%',
    padding: responsiveSpacing(spacing.md),
    justifyContent: 'center',
  },
  contentContainer: {
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: responsiveSpacing(spacing.xl),
  },
  logoContainer: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsiveSpacing(spacing.sm),
  },
  logoText: {
    fontSize: moderateScale(40),
  },
  title: {
    fontWeight: 'bold',
    marginBottom: responsiveSpacing(spacing.xs),
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    textAlign: 'center',
  },
  formCard: {
    borderRadius: moderateScale(16),
    padding: responsiveSpacing(spacing.lg),
    marginBottom: responsiveSpacing(spacing.lg),
  },
  signupCard: {
    borderRadius: moderateScale(12),
    padding: responsiveSpacing(spacing.md),
    marginTop: responsiveSpacing(spacing.md),
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveSpacing(spacing.md),
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: responsiveSpacing(spacing.md),
    fontWeight: '600',
  },
  actions: {
    marginTop: responsiveSpacing(spacing.md),
  },
});
