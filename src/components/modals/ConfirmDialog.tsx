/**
 * ConfirmDialog Component - Onay Dialog
 * 
 * Kullanıcı onayı için dialog bileşeni
 */

import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '@hooks';
import { spacing, borderRadius, textStyles } from '@theme';
import { Button } from '@components/forms';
import { useUIStore } from '@store';

/**
 * ConfirmDialog Component
 */
export const ConfirmDialog: React.FC = () => {
  const { colors, shadows } = useTheme();
  const { modals, hideConfirmDialog } = useUIStore();

  const { confirmDialog, confirmDialogData } = modals;

  if (!confirmDialog || !confirmDialogData) {
    return null;
  }

  const {
    title,
    message,
    confirmText = 'Onayla',
    cancelText = 'İptal',
    onConfirm,
    onCancel,
    type = 'info',
  } = confirmDialogData;

  const handleConfirm = () => {
    onConfirm();
    hideConfirmDialog();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    hideConfirmDialog();
  };

  // Type'a göre renk
  const typeColors: Record<string, string> = {
    info: colors.info,
    warning: colors.warning,
    danger: colors.error,
  };

  const accentColor = typeColors[type] || colors.primary;

  return (
    <Modal
      visible={confirmDialog}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <TouchableOpacity
        style={[styles.overlay, { backgroundColor: colors.overlay }]}
        activeOpacity={1}
        onPress={handleCancel}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <View
            style={[
              styles.dialog,
              { backgroundColor: colors.surface },
              shadows.xl,
            ]}
          >
            {/* Title */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
              <View style={[styles.accent, { backgroundColor: accentColor }]} />
              <Text
                style={[
                  styles.title,
                  textStyles.h3,
                  { color: colors.textPrimary },
                ]}
              >
                {title}
              </Text>
            </View>

            {/* Message */}
            <View style={styles.content}>
              <Text
                style={[
                  styles.message,
                  textStyles.body,
                  { color: colors.textSecondary },
                ]}
              >
                {message}
              </Text>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <Button
                title={cancelText}
                variant="outline"
                onPress={handleCancel}
                style={[styles.button, { marginLeft: 0 }]}
              />
              <Button
                title={confirmText}
                variant={type === 'danger' ? 'destructive' : 'primary'}
                onPress={handleConfirm}
                style={styles.button}
              />
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  dialog: {
    width: '100%',
    maxWidth: 400,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  header: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
  },
  accent: {
    width: 40,
    height: 4,
    borderRadius: borderRadius.full,
    marginBottom: spacing.sm,
  },
  title: {
    marginBottom: 0,
  },
  content: {
    padding: spacing.lg,
  },
  message: {
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    padding: spacing.md,
  },
  button: {
    flex: 1,
    marginLeft: spacing.sm,
  },
});

export default ConfirmDialog;
