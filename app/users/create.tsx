/**
 * Kullanıcı Oluştur Ekranı
 * Yeni alt kullanıcı (Müşavir/Mükellef) ekleme formu
 */

import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTheme, useUsers, useFirma } from '@hooks';
import { TopBar, Button, Input } from '@components';
import {
  spacing as spacingSystem,
  textStyles,
  moderateScale,
  elevation,
  responsiveSpacing,
  getContainerWidth,
  gradients,
} from '@theme';
import {
  SubUserRole,
  SUB_USER_ROLE_LABELS,
  CreateSubUserData,
  Firma,
} from '@types';

const spacing = spacingSystem.spacing;

export default function CreateUserScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { createSubUser, isLoading } = useUsers();
  const { firmaList } = useFirma();

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: SubUserRole.MUKELLEF,
    kontorTotal: '',
    assignedFirmaIds: [] as string[],
  });

  const [errors, setErrors] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    kontorTotal: '',
  });

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'Ad gerekli';
    if (!formData.lastName.trim()) newErrors.lastName = 'Soyad gerekli';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefon gerekli';
    } else if (!/^[0-9\s-+()]+$/.test(formData.phone)) {
      newErrors.phone = 'Geçerli bir telefon girin';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'E-posta gerekli';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta girin';
    }
    if (!formData.kontorTotal) {
      newErrors.kontorTotal = 'Kontör gerekli';
    } else if (parseInt(formData.kontorTotal) <= 0) {
      newErrors.kontorTotal = 'Kontör 0\'dan büyük olmalı';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const data: CreateSubUserData = {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      role: formData.role,
      kontorTotal: parseInt(formData.kontorTotal),
      assignedFirmaIds: formData.assignedFirmaIds,
    };

    try {
      await createSubUser(data);
      Alert.alert(
        'Başarılı',
        'Kullanıcı oluşturuldu. Giriş bilgileri e-posta adresine gönderildi.',
        [
          {
            text: 'Tamam',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Hata', 'Kullanıcı oluşturulamadı');
    }
  };

  const toggleFirma = (firmaId: string) => {
    setFormData(prev => ({
      ...prev,
      assignedFirmaIds: prev.assignedFirmaIds.includes(firmaId)
        ? prev.assignedFirmaIds.filter(id => id !== firmaId)
        : [...prev.assignedFirmaIds, firmaId],
    }));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <TopBar title="Yeni Kullanıcı" showFirmaChip showBackButton onBackPress={() => router.back()} />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Form Card */}
          <View style={[styles.formCard, { backgroundColor: colors.surface }, elevation[2]]}>
            {/* Kişisel Bilgiler */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, textStyles.h3, { color: colors.textPrimary }]}>
                Kişisel Bilgiler
              </Text>

              {/* Ad Soyad - Yan Yana */}
              <View style={styles.rowInputs}>
                <View style={styles.halfInput}>
                  <Input
                    label="Ad *"
                    value={formData.firstName}
                    onChangeText={(text: string) => setFormData({ ...formData, firstName: text })}
                    error={errors.firstName}
                    variant="outlined"
                  />
                </View>
                <View style={styles.halfInput}>
                  <Input
                    label="Soyad *"
                    value={formData.lastName}
                    onChangeText={(text: string) => setFormData({ ...formData, lastName: text })}
                    error={errors.lastName}
                    variant="outlined"
                  />
                </View>
              </View>

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
                label="Telefon *"
                value={formData.phone}
                onChangeText={(text: string) => setFormData({ ...formData, phone: text })}
                error={errors.phone}
                keyboardType="phone-pad"
                variant="outlined"
              />
            </View>

            {/* Rol Seçimi */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, textStyles.h3, { color: colors.textPrimary }]}>
                Rol *
              </Text>
              <View style={styles.roleOptions}>
                {Object.values(SubUserRole).map(role => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.roleButton,
                      {
                        backgroundColor:
                          formData.role === role
                            ? colors.primary
                            : colors.surface,
                        borderColor:
                          formData.role === role
                            ? colors.primary
                            : colors.border,
                      },
                      elevation[formData.role === role ? 2 : 0],
                    ]}
                    onPress={() => setFormData({ ...formData, role })}
                  >
                    <Text
                      style={[
                        styles.roleText,
                        {
                          color:
                            formData.role === role
                              ? colors.white
                              : colors.textPrimary,
                        },
                      ]}
                    >
                      {SUB_USER_ROLE_LABELS[role]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Kontör */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, textStyles.h3, { color: colors.textPrimary }]}>
                Kontör Ataması
              </Text>
              <Input
                label="Atanacak Kontör *"
                value={formData.kontorTotal}
                onChangeText={(text: string) => setFormData({ ...formData, kontorTotal: text })}
                error={errors.kontorTotal}
                keyboardType="number-pad"
                variant="outlined"
                placeholder="Örn: 100"
              />
              <Text style={[styles.hint, textStyles.caption, { color: colors.textTertiary }]}>
                Bu kullanıcıya verilecek toplam kontör miktarı
              </Text>
            </View>

            {/* Firma Ataması */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, textStyles.h3, { color: colors.textPrimary }]}>
                Firma Ataması
              </Text>
              <Text style={[styles.hint, textStyles.caption, { color: colors.textTertiary }]}>
                Bu kullanıcının erişebileceği firmaları seçin
              </Text>
              <View style={styles.firmaList}>
                {firmaList.map(firma => (
                  <TouchableOpacity
                    key={firma.id}
                    style={[
                      styles.firmaItem,
                      {
                        backgroundColor: formData.assignedFirmaIds.includes(firma.id)
                          ? colors.primary + '20'
                          : colors.surfaceAlt,
                        borderColor: formData.assignedFirmaIds.includes(firma.id)
                          ? colors.primary
                          : colors.border,
                      },
                    ]}
                    onPress={() => toggleFirma(firma.id)}
                  >
                    <View style={styles.checkbox}>
                      {formData.assignedFirmaIds.includes(firma.id) && (
                        <Text style={[styles.checkmark, { color: colors.primary }]}>✓</Text>
                      )}
                    </View>
                    <View style={styles.firmaInfo}>
                      <Text style={[styles.firmaName, textStyles.body, { color: colors.textPrimary }]}>
                        {firma.shortName}
                      </Text>
                      <Text style={[styles.firmaVkn, textStyles.caption, { color: colors.textSecondary }]}>
                        VKN: {firma.vkn}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Bilgilendirme */}
            <View style={[styles.infoBox, { backgroundColor: colors.info + '15' }]}>
              <Text style={[styles.infoText, textStyles.caption, { color: colors.info }]}>
                💡 Kullanıcı oluşturulduktan sonra, giriş bilgileri otomatik olarak e-posta adresine gönderilecektir.
              </Text>
            </View>

            {/* Submit Button */}
            <Button
              title="Kullanıcıyı Oluştur"
              variant="gradient"
              onPress={handleSubmit}
              loading={isLoading}
              fullWidth
              elevation
            />
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
    paddingBottom: 100,
  },
  formCard: {
    borderRadius: moderateScale(16),
    padding: responsiveSpacing(spacing.lg),
    maxWidth: getContainerWidth(),
    alignSelf: 'center',
    width: '100%',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  rowInputs: {
    flexDirection: 'row',
    marginHorizontal: -spacing.xs,
  },
  halfInput: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  roleOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  roleButton: {
    flex: 1,
    minWidth: '45%',
    padding: responsiveSpacing(spacing.md),
    borderRadius: moderateScale(12),
    borderWidth: 2,
    margin: spacing.xs,
    alignItems: 'center',
  },
  roleText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  hint: {
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  firmaList: {
    marginTop: spacing.sm,
  },
  firmaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: responsiveSpacing(spacing.md),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  checkbox: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(4),
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  checkmark: {
    fontSize: moderateScale(16),
    fontWeight: '700',
  },
  firmaInfo: {
    flex: 1,
  },
  firmaName: {
    fontWeight: '600',
  },
  firmaVkn: {
    marginTop: spacing.xxs,
  },
  infoBox: {
    padding: responsiveSpacing(spacing.md),
    borderRadius: moderateScale(12),
    marginBottom: spacing.lg,
  },
  infoText: {
    lineHeight: 18,
  },
});
