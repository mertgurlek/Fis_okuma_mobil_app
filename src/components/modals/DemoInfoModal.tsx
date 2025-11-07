/**
 * Demo Bilgilendirme Modalı
 * Demo kullanım kısıtlarını açıklayan modal
 */

import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTheme } from '@hooks';
import { Button } from '@components';
import {
  spacing as spacingSystem,
  textStyles,
  moderateScale,
  elevation,
} from '@theme';
import { useUIStore } from '@store';

const spacing = spacingSystem.spacing;

export const DemoInfoModal: React.FC = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { modals, hideModal } = useUIStore();

  const isVisible = modals.demoInfo || false;

  const handleStartDemo = () => {
    hideModal('demoInfo');
    // Demo zaten başlatılmış, sadece modal'ı kapat
  };

  const handleRequestMembership = () => {
    hideModal('demoInfo');
    router.push('/(auth)/signup');
  };

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={() => hideModal('demoInfo')}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => hideModal('demoInfo')}
        />

        <View style={[styles.modalContainer, elevation[5]]}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.98)', 'rgba(255, 255, 255, 0.95)']}
            style={styles.gradientContainer}
          >
            {/* Icon */}
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>🎭</Text>
            </View>

            {/* Title */}
            <Text style={[styles.title, textStyles.h2, { color: colors.textPrimary }]}>
              Demo Modu
            </Text>

            {/* Description */}
            <View style={styles.content}>
              <View style={styles.infoItem}>
                <Text style={styles.bullet}>📸</Text>
                <Text style={[styles.infoText, textStyles.body, { color: colors.textSecondary }]}>
                  En fazla <Text style={styles.highlight}>5 fiş</Text> okutabilirsiniz
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.bullet}>⏱️</Text>
                <Text style={[styles.infoText, textStyles.body, { color: colors.textSecondary }]}>
                  Fişleriniz <Text style={styles.highlight}>7 gün</Text> saklanır
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.bullet}>🔒</Text>
                <Text style={[styles.infoText, textStyles.body, { color: colors.textSecondary }]}>
                  Tüm özellikler <Text style={styles.highlight}>sınırlı</Text> olarak gösterilir
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.bullet}>💡</Text>
                <Text style={[styles.infoText, textStyles.body, { color: colors.textSecondary }]}>
                  API entegrasyonu <Text style={styles.highlight}>devre dışı</Text>
                </Text>
              </View>
            </View>

            {/* Note */}
            <View style={[styles.noteBox, { backgroundColor: 'rgba(31, 75, 143, 0.1)' }]}>
              <Text style={[styles.noteText, textStyles.caption, { color: colors.primary }]}>
                💼 Tüm özellikleri kullanmak için üyelik oluşturun
              </Text>
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <Button
                title="Demo'ya Başla"
                variant="gradient"
                onPress={handleStartDemo}
                fullWidth
                elevation
              />

              <View style={{ marginTop: spacing.sm }}>
                <Button
                  title="Üyelik Talep Et"
                  variant="outline"
                  onPress={handleRequestMembership}
                  fullWidth
                />
              </View>
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    overflow: 'hidden',
  },
  gradientContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  iconContainer: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
    backgroundColor: 'rgba(31, 75, 143, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  icon: {
    fontSize: moderateScale(40),
  },
  title: {
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  content: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  bullet: {
    fontSize: moderateScale(20),
  },
  infoText: {
    flex: 1,
    lineHeight: 22,
    marginLeft: spacing.sm,
  },
  highlight: {
    fontWeight: '600',
    color: '#1F4B8F',
  },
  noteBox: {
    width: '100%',
    padding: spacing.md,
    borderRadius: moderateScale(12),
    marginBottom: spacing.lg,
  },
  noteText: {
    textAlign: 'center',
    fontWeight: '600',
  },
  buttonContainer: {
    width: '100%',
  },
});

export default DemoInfoModal;
