/**
 * SafeReceiptCard - Güvenli Fiş Kartı Wrapper
 * Web platformu için hata çözümü
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ReceiptCard } from './ReceiptCard';
import { Receipt } from '@types';
import { useTheme } from '@hooks';
import { spacing as spacingSystem, textStyles, moderateScale } from '@theme';

const spacing = spacingSystem.spacing;

interface SafeReceiptCardProps {
  receipt: Receipt;
  onPress: (receipt: Receipt) => void;
  onLongPress?: (receipt: Receipt) => void;
}

/**
 * Safe Receipt Card - Null/undefined kontrolü ile
 */
export const SafeReceiptCard: React.FC<SafeReceiptCardProps> = ({
  receipt,
  onPress,
  onLongPress,
}) => {
  const { colors } = useTheme();

  // Güvenlik kontrolleri
  if (!receipt) {
    return (
      <View style={[styles.errorCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          Fiş verisi yüklenemedi
        </Text>
      </View>
    );
  }

  // Required fields kontrolü
  if (!receipt.id || !receipt.unvan) {
    return (
      <View style={[styles.errorCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          Eksik fiş verisi
        </Text>
      </View>
    );
  }

  // Güvenli veri hazırlama
  const safeReceipt: Receipt = {
    ...receipt,
    // Zorunlu alanların güvenli değerleri
    unvan: receipt.unvan || 'Bilinmeyen Firma',
    vkn: receipt.vkn || 'Bilinmeyen',
    tarih: receipt.tarih || new Date().toISOString(),
    toplamTutar: receipt.toplamTutar || 0,
    status: receipt.status || 'PROCESSING',
    source: receipt.source || 'MAIN_USER',
    fisType: receipt.fisType || 'YAZAR_KASA',
    userEdited: receipt.userEdited || false,
  };

  try {
    return (
      <ReceiptCard
        receipt={safeReceipt}
        onPress={onPress}
        onLongPress={onLongPress}
      />
    );
  } catch (error) {
    console.error('ReceiptCard render error:', error);
    
    return (
      <View style={[styles.errorCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          Render hatası
        </Text>
        <Text style={[styles.errorDetails, { color: colors.textSecondary }]}>
          {receipt.unvan || 'ID: ' + receipt.id}
        </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  errorCard: {
    flex: 1,
    borderRadius: moderateScale(12),
    padding: spacing.md,
    marginBottom: spacing.sm,
    minHeight: moderateScale(100),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffebee',
  },
  errorText: {
    ...textStyles.body,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  errorDetails: {
    ...textStyles.caption,
    textAlign: 'center',
  },
});

export default SafeReceiptCard;
