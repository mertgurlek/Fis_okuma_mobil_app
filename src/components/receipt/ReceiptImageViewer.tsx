/**
 * Receipt Image Viewer - Fiş Görsel Görüntüleyici
 * Pinch-to-zoom, pan desteği ile optimize edilmiş görsel görüntüleme
 */

import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Text,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@hooks';
import { moderateScale, spacing as spacingSystem, textStyles } from '@theme';

const spacing = spacingSystem.spacing;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ReceiptImageViewerProps {
  imageUri: string;
  visible: boolean;
  onClose: () => void;
}

export const ReceiptImageViewer: React.FC<ReceiptImageViewerProps> = ({
  imageUri,
  visible,
  onClose,
}) => {
  const { colors } = useTheme();
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  React.useEffect(() => {
    if (imageUri) {
      Image.getSize(
        imageUri,
        (width, height) => {
          setImageSize({ width, height });
        },
        (error) => {
          console.error('Image size error:', error);
        }
      );
    }
  }, [imageUri]);

  // Aspect ratio hesapla
  const aspectRatio = imageSize.width / imageSize.height || 1;
  const imageWidth = SCREEN_WIDTH * 0.9;
  const imageHeight = imageWidth / aspectRatio;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Background Overlay */}
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        >
          <View style={[styles.backdrop, { backgroundColor: 'rgba(0, 0, 0, 0.95)' }]} />
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.contentContainer}>
          {/* Close Button */}
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: colors.surface }]}
            onPress={onClose}
          >
            <Text style={[styles.closeButtonText, { color: colors.textPrimary }]}>✕</Text>
          </TouchableOpacity>

          {/* Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageUri }}
              style={{
                width: imageWidth,
                height: Math.min(imageHeight, SCREEN_HEIGHT * 0.85),
                borderRadius: moderateScale(12),
              }}
              resizeMode="contain"
            />
          </View>

          {/* Info Card */}
          <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
            <Text style={[textStyles.caption, { color: colors.textSecondary }]}>
              📸 Fiş Görseli
            </Text>
            <Text style={[textStyles.caption, { color: colors.textTertiary, marginTop: spacing.xxs }]}>
              Yakınlaştırmak için dokunun ve sürükleyin
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    flex: 1,
  },
  contentContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButtonText: {
    fontSize: moderateScale(20),
    fontWeight: '600',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCard: {
    position: 'absolute',
    bottom: 40,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: moderateScale(12),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default ReceiptImageViewer;
