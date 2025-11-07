/**
 * Signup (Yeni Üyelik Başvurusu) Ekranı
 * CRM'e lead oluşturmak için bilgi toplama
 */

import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
  useWindowDimensions,
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
  gradients,
  elevation,
  getContainerWidth,
} from '@theme';

const spacing = spacingSystem.spacing;

export default function SignupScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { signup, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    phone: '',
    email: '',
    note: '',
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    company: '',
    phone: '',
    email: '',
  });

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'Ad gerekli';
    if (!formData.lastName.trim()) newErrors.lastName = 'Soyad gerekli';
    if (!formData.company.trim()) newErrors.company = 'Şirket gerekli';
    if (!formData.phone.trim()) newErrors.phone = 'Telefon gerekli';
    if (!formData.email.trim()) {
      newErrors.email = 'E-posta gerekli';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta girin';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const result = await signup(formData as any);
    
    if (result.success) {
      Alert.alert(
        'Başarılı!',
        'Başvurunuz alınmıştır. Satış ekibimiz en kısa sürede sizinle iletişime geçecek.',
        [
          {
            text: 'Tamam',
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      Alert.alert('Hata', result.error || 'Başvuru gönderilemedi');
    }
  };

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
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
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, textStyles.h1, { color: colors.white }]}>
              Yeni Üyelik
            </Text>
            <Text style={[styles.subtitle, textStyles.body, { color: 'rgba(255,255,255,0.9)' }]}>
              Bilgilerinizi doldurun, sizinle iletişime geçelim
            </Text>
          </View>

          {/* Form Card */}
          <View style={[styles.formCard, { backgroundColor: colors.white }, elevation[3]]}>
            <View style={{ marginBottom: spacing.md }}>
              <Input
                label="Ad *"
                value={formData.firstName}
                onChangeText={(text: string) => setFormData({ ...formData, firstName: text })}
                error={errors.firstName}
                variant="outlined"
              />
            </View>

            <View style={{ marginBottom: spacing.md }}>
              <Input
                label="Soyad *"
                value={formData.lastName}
                onChangeText={(text: string) => setFormData({ ...formData, lastName: text })}
                error={errors.lastName}
                variant="outlined"
              />
            </View>

            <Input
              label="Şirket *"
              value={formData.company}
              onChangeText={(text: string) => setFormData({ ...formData, company: text })}
              error={errors.company}
              variant="outlined"
            />

            <Input
              label="Telefon *"
              value={formData.phone}
              onChangeText={(text: string) => setFormData({ ...formData, phone: text })}
              error={errors.phone}
              keyboardType="phone-pad"
              variant="outlined"
            />

            <Input
              label="E-posta *"
              value={formData.email}
              onChangeText={(text: string) => setFormData({ ...formData, email: text })}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              variant="outlined"
            />

            <Input
              label="Not / Kullanım Amacı (Opsiyonel)"
              value={formData.note}
              onChangeText={(text: string) => setFormData({ ...formData, note: text })}
              multiline
              numberOfLines={3}
              variant="outlined"
            />

            <Text style={[styles.requiredNote, textStyles.caption, { color: colors.textSecondary }]}>
              * Zorunlu alanlar
            </Text>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <Button
                title="Başvuruyu Gönder"
                variant="gradient"
                onPress={handleSubmit}
                loading={isLoading}
                fullWidth
                elevation
              />

              <View style={{ marginTop: spacing.sm }}>
                <Button
                  title="İptal"
                  variant="ghost"
                  onPress={() => router.back()}
                  fullWidth
                />
              </View>
            </View>
          </View>
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
    padding: responsiveSpacing(spacing.md),
    paddingTop: responsiveSpacing(spacing.xl),
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontWeight: '700',
    marginBottom: spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    textAlign: 'center',
    maxWidth: 300,
  },
  formCard: {
    borderRadius: moderateScale(20),
    padding: responsiveSpacing(spacing.lg),
  },
  requiredNote: {
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  buttonContainer: {
    marginTop: spacing.md,
  },
});
