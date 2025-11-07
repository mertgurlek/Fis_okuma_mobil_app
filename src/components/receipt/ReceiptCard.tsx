/**
 * ReceiptCard Component - Modern Fiş Kartı
 * 
 * Animasyonlu, responsive ve glassmorphism efektli kart
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@hooks';
import { 
  spacing as spacingSystem, 
  borderRadius, 
  textStyles, 
  statusColors,
  responsiveSpacing,
  moderateScale,
  deviceInfo,
  elevation,
  gradients,
  touchResponse,
} from '@theme';
import { Receipt, ReceiptStatus, ReceiptType, ReceiptSource } from '@types';
import { formatCurrency, formatDate } from '@utils/formatters';
import { RECEIPT_STATUS_LABELS } from '@utils/constants';

const spacing = spacingSystem.spacing;

interface ReceiptCardProps {
  receipt: Receipt;
  onPress: (receipt: Receipt) => void;
  onLongPress?: (receipt: Receipt) => void;
}

/**
 * ReceiptCard Component
 */
export const ReceiptCard: React.FC<ReceiptCardProps> = ({
  receipt,
  onPress,
  onLongPress,
}) => {
  const { colors, shadows } = useTheme();
  const [scaleValue] = useState(new Animated.Value(1));

  // Status badge renkleri
  const statusStyle = statusColors[
    receipt.status === ReceiptStatus.APPROVED
      ? 'approved'
      : receipt.status === ReceiptStatus.VERIFIED
      ? 'info'
      : receipt.status === ReceiptStatus.PROCESSING
      ? 'processing'
      : receipt.status === ReceiptStatus.REJECTED
      ? 'error'
      : receipt.status === ReceiptStatus.DELETED
      ? 'deleted'
      : 'pending'
  ];

  // Kaynak ikonu ve metni
  const getSourceInfo = () => {
    if (receipt.source === ReceiptSource.TAXPAYER) {
      return { icon: '👤', text: 'Mükellef', color: colors.warning };
    }
    return { icon: '💼', text: 'Müşavir', color: colors.info };
  };

  // Fiş tipi ikonu
  const getFisTypeIcon = () => {
    if (receipt.fisType === ReceiptType.Z_RAPORU) {
      return '📊';
    }
    return '📝';
  };

  const sourceInfo = getSourceInfo();

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 100,
      friction: 3,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 3,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        style={[
          styles.card,
          { backgroundColor: colors.surface },
          elevation[2],
        ]}
        onPress={() => onPress(receipt)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onLongPress={() => onLongPress?.(receipt)}
        activeOpacity={1}
      >
      {/* Header - Date, Type & Status */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.fisTypeIcon}>{getFisTypeIcon()}</Text>
          <Text 
            style={[styles.date, textStyles.caption, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {formatDate(receipt.tarih)}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: statusStyle.bg,
              borderColor: statusStyle.border,
            },
          ]}
        >
          <Text style={[styles.statusText, textStyles.badge, { color: statusStyle.text }]}>
            {RECEIPT_STATUS_LABELS[receipt.status]}
          </Text>
        </View>
      </View>

      {/* Main Content - Unvan */}
      <Text
        style={[
          styles.unvan,
          textStyles.labelLarge,
          { color: colors.textPrimary },
        ]}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {receipt.unvan}
      </Text>

      {/* VKN & Source */}
      <View style={styles.infoRow}>
        <Text 
          style={[styles.vkn, textStyles.caption, { color: colors.textTertiary }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          VKN: {receipt.vkn}
        </Text>
        <View style={[styles.sourceBadge, { backgroundColor: sourceInfo.color + '15' }]}>
          <Text style={[styles.sourceText, textStyles.caption, { color: sourceInfo.color }]}>
            {sourceInfo.icon} {sourceInfo.text}
          </Text>
        </View>
      </View>

      {/* Footer - Amount & Edit indicator */}
      <View style={styles.footer}>
        <Text style={[styles.amount, textStyles.labelLarge, { color: colors.primary }]}>
          {formatCurrency(receipt.toplamTutar)}
        </Text>
        {receipt.userEdited && (
          <View
            style={[
              styles.editedBadge,
              { backgroundColor: `${colors.info}20`, borderColor: colors.info },
            ]}
          >
            <Text style={[styles.editedText, textStyles.caption, { color: colors.info }]}>
              📝 Düzenlendi
            </Text>
          </View>
        )}
      </View>
      
        {/* Decorative Gradient Bar */}
        <LinearGradient
          colors={gradients.primaryLight}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientBar}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: moderateScale(borderRadius.lg),
    padding: responsiveSpacing(spacing.md),
    marginBottom: responsiveSpacing(spacing.sm),
    minHeight: moderateScale(160),
    minWidth: 0,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(31, 75, 143, 0.1)',
    justifyContent: 'space-between',
  },
  gradientBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: moderateScale(4),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveSpacing(spacing.sm),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fisTypeIcon: {
    fontSize: moderateScale(14),
    marginRight: spacing.xs,
  },
  date: {
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: responsiveSpacing(spacing.sm),
    paddingVertical: responsiveSpacing(spacing.xxs),
    borderRadius: moderateScale(borderRadius.full),
    borderWidth: moderateScale(1),
  },
  statusText: {
    fontWeight: '600',
  },
  unvan: {
    marginBottom: responsiveSpacing(spacing.xs),
    fontWeight: '600',
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveSpacing(spacing.sm),
  },
  vkn: {
    flex: 1,
    marginRight: spacing.xs,
  },
  sourceBadge: {
    paddingHorizontal: responsiveSpacing(spacing.xs),
    paddingVertical: responsiveSpacing(spacing.xxs),
    borderRadius: moderateScale(borderRadius.xs),
  },
  sourceText: {
    fontSize: 10,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: responsiveSpacing(spacing.xs),
  },
  amount: {
    fontWeight: '700',
  },
  editedBadge: {
    paddingHorizontal: responsiveSpacing(spacing.sm),
    paddingVertical: responsiveSpacing(spacing.xxs),
    borderRadius: moderateScale(borderRadius.sm),
    borderWidth: moderateScale(1),
  },
  editedText: {
    fontSize: 11,
  },
});

export default ReceiptCard;
