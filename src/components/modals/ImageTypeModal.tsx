/**
 * ImageTypeModal Component - Görüntü Tipi Seçim Modal'ı
 * 
 * Kullanıcı kameradan görüntü çekerken Z Raporu veya Fiş seçmesi için modal
 */

import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { useTheme } from '@hooks';
import { borderRadius, textStyles, gradients } from '@theme';
import { spacing } from '@theme/spacing';
import { LinearGradient } from 'expo-linear-gradient';

export type ImageType = 'receipt' | 'zreport';

interface ImageTypeModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectType: (type: ImageType) => void;
  bottomOffset?: number;
}

/**
 * ImageTypeModal Component
 */
export const ImageTypeModal: React.FC<ImageTypeModalProps> = ({
  visible,
  onClose,
  onSelectType,
  bottomOffset = 80,
}) => {
  const { colors, shadows } = useTheme();

  const handleSelectType = (type: ImageType) => {
    onSelectType(type);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.overlay}
        onPress={onClose}
      >
        <Pressable 
          onPress={(e) => e.stopPropagation()}
          style={[styles.popupContainer, { bottom: bottomOffset }]}
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
              <Text
                style={[
                  styles.title,
                  textStyles.h4,
                  { color: colors.textPrimary },
                ]}
              >
                Ne eklemek istiyorsunuz?
              </Text>
            </View>

            {/* Options */}
            <View style={styles.content}>
              <View style={styles.optionsRow}>
                {/* Fiş Seçeneği */}
                <TouchableOpacity
                  style={[
                    styles.compactOption,
                    { backgroundColor: colors.primaryLight },
                    shadows.sm,
                  ]}
                  onPress={() => handleSelectType('receipt')}
                  activeOpacity={0.7}
                >
                  <View style={styles.compactIconContainer}>
                    <Text style={styles.compactIcon}>🧾</Text>
                  </View>
                  <Text
                    style={[
                      styles.compactTitle,
                      textStyles.label,
                      { color: colors.primary },
                    ]}
                  >
                    Fiş
                  </Text>
                </TouchableOpacity>

                {/* Z Raporu Seçeneği */}
                <TouchableOpacity
                  style={[
                    styles.compactOption,
                    { backgroundColor: colors.successLight },
                    shadows.sm,
                  ]}
                  onPress={() => handleSelectType('zreport')}
                  activeOpacity={0.7}
                >
                  <View style={styles.compactIconContainer}>
                    <Text style={styles.compactIcon}>📊</Text>
                  </View>
                  <Text
                    style={[
                      styles.compactTitle,
                      textStyles.label,
                      { color: colors.success },
                    ]}
                  >
                    Z Raporu
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  popupContainer: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    alignItems: 'center',
  },
  dialog: {
    width: '100%',
    maxWidth: 340,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  header: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  title: {
    fontWeight: '600',
  },
  content: {
    padding: spacing.md,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  compactOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  compactIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  compactIcon: {
    fontSize: 26,
  },
  compactTitle: {
    fontWeight: '600',
  },
});

export default ImageTypeModal;
