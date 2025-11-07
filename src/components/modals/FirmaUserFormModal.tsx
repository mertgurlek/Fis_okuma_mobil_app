/**
 * Firma User Form Modal - Firma Kullanıcısı Oluşturma/Düzenleme
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '@hooks';
import {
  spacing as spacingSystem,
  textStyles,
  moderateScale,
  elevation,
  responsiveSpacing,
} from '@theme';
import { CreateFirmaUserData, UpdateFirmaUserData, FirmaUser } from '@types';

const spacing = spacingSystem.spacing;

interface FirmaUserFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: CreateFirmaUserData | UpdateFirmaUserData) => Promise<void>;
  editingUser?: FirmaUser | null;
  firmaId: string;
}

export default function FirmaUserFormModal({
  visible,
  onClose,
  onSubmit,
  editingUser,
  firmaId,
}: FirmaUserFormModalProps) {
  const { colors } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Edit mode ise mevcut değerleri yükle
  useEffect(() => {
    if (editingUser) {
      setUsername(editingUser.username);
      setPassword(''); // Güvenlik için şifre gösterilmez
      setFirstName(editingUser.firstName);
      setLastName(editingUser.lastName);
      setEmail(editingUser.email || '');
      setPhone(editingUser.phone || '');
    } else {
      resetForm();
    }
  }, [editingUser, visible]);

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
  };

  const validateForm = () => {
    if (!username.trim()) {
      Alert.alert('Hata', 'Kullanıcı adı boş olamaz');
      return false;
    }

    if (!editingUser && !password.trim()) {
      Alert.alert('Hata', 'Şifre boş olamaz');
      return false;
    }

    if (!firstName.trim()) {
      Alert.alert('Hata', 'Ad boş olamaz');
      return false;
    }

    if (!lastName.trim()) {
      Alert.alert('Hata', 'Soyad boş olamaz');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      if (editingUser) {
        // Güncelleme
        const updateData: UpdateFirmaUserData = {
          id: editingUser.id,
          username: username.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
        };

        // Şifre değiştirildiyse ekle
        if (password.trim()) {
          updateData.password = password.trim();
        }

        await onSubmit(updateData);
      } else {
        // Yeni kullanıcı
        const createData: CreateFirmaUserData = {
          firmaId,
          username: username.trim(),
          password: password.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
        };

        await onSubmit(createData);
      }

      resetForm();
      onClose();
    } catch (error) {
      console.error('Form submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.modalContent, { backgroundColor: colors.surface }, elevation[4]]}>
          {/* Header */}
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, textStyles.h3, { color: colors.textPrimary }]}>
              {editingUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Oluştur'}
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Text style={[styles.closeButton, { color: colors.textTertiary }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <ScrollView
            style={styles.formContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Kullanıcı Adı */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, textStyles.labelSmall, { color: colors.textSecondary }]}>
                Kullanıcı Adı *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  textStyles.body,
                  {
                    color: colors.textPrimary,
                    backgroundColor: colors.bg,
                    borderColor: colors.border,
                  },
                ]}
                value={username}
                onChangeText={setUsername}
                placeholder="kullanici_adi"
                placeholderTextColor={colors.textTertiary}
                autoCapitalize="none"
                editable={!isSubmitting}
              />
            </View>

            {/* Şifre */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, textStyles.labelSmall, { color: colors.textSecondary }]}>
                {editingUser ? 'Yeni Şifre (boş bırakılırsa değişmez)' : 'Şifre *'}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  textStyles.body,
                  {
                    color: colors.textPrimary,
                    backgroundColor: colors.bg,
                    borderColor: colors.border,
                  },
                ]}
                value={password}
                onChangeText={setPassword}
                placeholder={editingUser ? 'Yeni şifre' : 'Şifre'}
                placeholderTextColor={colors.textTertiary}
                secureTextEntry
                autoCapitalize="none"
                editable={!isSubmitting}
              />
            </View>

            {/* Ad */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, textStyles.labelSmall, { color: colors.textSecondary }]}>
                Ad *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  textStyles.body,
                  {
                    color: colors.textPrimary,
                    backgroundColor: colors.bg,
                    borderColor: colors.border,
                  },
                ]}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Ad"
                placeholderTextColor={colors.textTertiary}
                editable={!isSubmitting}
              />
            </View>

            {/* Soyad */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, textStyles.labelSmall, { color: colors.textSecondary }]}>
                Soyad *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  textStyles.body,
                  {
                    color: colors.textPrimary,
                    backgroundColor: colors.bg,
                    borderColor: colors.border,
                  },
                ]}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Soyad"
                placeholderTextColor={colors.textTertiary}
                editable={!isSubmitting}
              />
            </View>

            {/* E-posta */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, textStyles.labelSmall, { color: colors.textSecondary }]}>
                E-posta
              </Text>
              <TextInput
                style={[
                  styles.input,
                  textStyles.body,
                  {
                    color: colors.textPrimary,
                    backgroundColor: colors.bg,
                    borderColor: colors.border,
                  },
                ]}
                value={email}
                onChangeText={setEmail}
                placeholder="email@example.com"
                placeholderTextColor={colors.textTertiary}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isSubmitting}
              />
            </View>

            {/* Telefon */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, textStyles.labelSmall, { color: colors.textSecondary }]}>
                Telefon
              </Text>
              <TextInput
                style={[
                  styles.input,
                  textStyles.body,
                  {
                    color: colors.textPrimary,
                    backgroundColor: colors.bg,
                    borderColor: colors.border,
                  },
                ]}
                value={phone}
                onChangeText={setPhone}
                placeholder="0532 123 45 67"
                placeholderTextColor={colors.textTertiary}
                keyboardType="phone-pad"
                editable={!isSubmitting}
              />
            </View>
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { backgroundColor: colors.border }]}
              onPress={handleClose}
              disabled={isSubmitting}
            >
              <Text style={[styles.buttonText, { color: colors.textPrimary }]}>
                İptal
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.submitButton,
                { backgroundColor: colors.primary },
                isSubmitting && { opacity: 0.6 },
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={[styles.buttonText, { color: colors.white }]}>
                {isSubmitting ? 'Kaydediliyor...' : editingUser ? 'Güncelle' : 'Oluştur'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: responsiveSpacing(spacing.md),
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontWeight: '700',
  },
  closeButton: {
    fontSize: moderateScale(24),
    fontWeight: '300',
  },
  formContainer: {
    padding: responsiveSpacing(spacing.md),
  },
  inputGroup: {
    marginBottom: responsiveSpacing(spacing.md),
  },
  label: {
    marginBottom: responsiveSpacing(spacing.xs),
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: moderateScale(8),
    padding: responsiveSpacing(spacing.sm),
    fontSize: moderateScale(14),
  },
  actions: {
    flexDirection: 'row',
    padding: responsiveSpacing(spacing.md),
    gap: responsiveSpacing(spacing.sm),
  },
  button: {
    flex: 1,
    padding: responsiveSpacing(spacing.sm),
    borderRadius: moderateScale(8),
    alignItems: 'center',
  },
  cancelButton: {},
  submitButton: {},
  buttonText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
});
