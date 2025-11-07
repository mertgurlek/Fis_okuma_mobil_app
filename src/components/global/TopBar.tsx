/**
 * TopBar Component - Modern Üst Başlık Bar
 * 
 * Futuristik glassmorphic header bar
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@hooks';
import { 
  spacing as spacingSystem, 
  textStyles, 
  layout,
  responsiveSpacing,
  moderateScale,
  elevation,
  glassmorphism,
} from '@theme';
import { FirmaChip } from './FirmaChip';
import { useUIStore } from '@store';
import { useFirma } from '@hooks';
import { useDrawer } from '../../contexts/DrawerContext';

const spacing = spacingSystem.spacing;

interface TopBarProps {
  title: string;
  showFirmaChip?: boolean;
  showFilterButton?: boolean;
  showBackButton?: boolean;
  onFilterPress?: (() => void) | undefined;
  onBackPress?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftPress?: () => void;
  onRightPress?: () => void;
}

/**
 * TopBar Component
 */
export const TopBar: React.FC<TopBarProps> = ({
  title,
  showFirmaChip = false,
  showFilterButton = false,
  showBackButton = false,
  onFilterPress = undefined,
  onBackPress,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
}: TopBarProps) => {
  const { colors, shadows } = useTheme();
  const { showModal } = useUIStore();
  const { selectedFirma } = useFirma();
  const { toggleDrawer } = useDrawer();

  const handleMenuPress = () => {
    toggleDrawer();
  };

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    }
  };

  return (
    <LinearGradient
      colors={['rgba(255, 255, 255, 0.98)', 'rgba(255, 255, 255, 0.95)']}
      style={[
        styles.container,
        elevation[3],
      ]}
    >
      {/* Left Side */}
      <View style={styles.leftSide}>
        {/* Back Button or Hamburger Menu */}
        {showBackButton ? (
          <TouchableOpacity
            style={styles.menuButton}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Text style={[styles.backIcon, { color: colors.primary }]}>←</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.menuButton}
            onPress={handleMenuPress}
            activeOpacity={0.7}
          >
            <View style={styles.hamburger}>
              <View style={[styles.hamburgerLine, { backgroundColor: colors.primary }]} />
              <View style={[styles.hamburgerLine, { backgroundColor: colors.primary }]} />
              <View style={[styles.hamburgerLine, { backgroundColor: colors.primary }]} />
            </View>
          </TouchableOpacity>
        )}

        {leftIcon && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onLeftPress}
            disabled={!onLeftPress}
          >
            {leftIcon}
          </TouchableOpacity>
        )}
        <Text
          style={[
            styles.title,
            textStyles.h2,
            { color: colors.textPrimary },
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>

      {/* Right Side */}
      <View style={styles.rightSide}>
        {/* Kontör Sayacı */}
        {showFirmaChip && selectedFirma?.kontor !== undefined && (
          <View style={[styles.kontorBadge, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
            <Text style={styles.kontorIcon}>💳</Text>
            <Text style={[styles.kontorText, { color: colors.primary }]}>
              {selectedFirma.kontor}
            </Text>
          </View>
        )}
        {showFirmaChip && <FirmaChip style={{ marginLeft: responsiveSpacing(spacing.xs) }} />}
        {showFilterButton && (
          <TouchableOpacity
            style={[styles.filterDropdown, { marginLeft: responsiveSpacing(spacing.sm) }]}
            onPress={onFilterPress}
            activeOpacity={0.7}
          >
            <Text style={styles.filterText}>▼</Text>
          </TouchableOpacity>
        )}
        {rightIcon && (
          <TouchableOpacity
            style={[styles.iconButton, { marginLeft: responsiveSpacing(spacing.sm) }]}
            onPress={onRightPress}
            disabled={!onRightPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>

      {/* Futuristik bottom accent */}
      <LinearGradient
        colors={[colors.primaryLight, colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.accent}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: moderateScale(56), // Responsive height
    paddingHorizontal: responsiveSpacing(spacing.md),
    paddingTop: Platform.OS === 'ios' ? 0 : 0,
    borderBottomWidth: 0,
  },
  accent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2, // Daha ince accent
  },
  leftSide: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightSide: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginLeft: responsiveSpacing(spacing.xs),
    fontWeight: '700',
  },
  iconButton: {
    padding: responsiveSpacing(spacing.xs),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(8),
  },
  menuButton: {
    padding: spacing.xs,
    marginRight: spacing.xs,
  },
  hamburger: {
    width: 24,
    height: 18,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    width: '100%',
    height: 2,
    borderRadius: 1,
  },
  backIcon: {
    fontSize: moderateScale(24),
    fontWeight: '700',
  },
  filterDropdown: {
    padding: spacing.xs,
  },
  filterText: {
    fontSize: moderateScale(14),
    color: '#1F4B8F',
    fontWeight: '600',
  },
  kontorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveSpacing(spacing.sm),
    paddingVertical: responsiveSpacing(spacing.xxs),
    borderRadius: moderateScale(12),
    borderWidth: 1,
  },
  kontorIcon: {
    fontSize: moderateScale(14),
    marginRight: spacing.xxs,
  },
  kontorText: {
    fontSize: moderateScale(13),
    fontWeight: '700',
  },
});

export default TopBar;
