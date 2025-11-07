/**
 * Platform Specific Values - Web & Native Optimizasyonları
 * 
 * Web ve Native platform için optimize edilmiş değerler
 * Tek bir yerden yönetim için merkezi helper
 */

import { Platform } from 'react-native';
import { spacing as spacingSystem } from './spacing';
import { moderateScale } from './responsive';

const spacing = spacingSystem;

/**
 * Platform kontrolü
 */
export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

/**
 * Component Heights - Platform Optimized
 */
export const componentHeights = {
  input: {
    small: isWeb ? 36 : moderateScale(40),
    medium: isWeb ? 48 : moderateScale(48),
    large: isWeb ? 56 : moderateScale(56),
  },
  button: {
    small: isWeb ? 36 : moderateScale(36),
    medium: isWeb ? 44 : moderateScale(48),
    large: isWeb ? 52 : moderateScale(56),
  },
  card: {
    minHeight: moderateScale(160),
  },
};

/**
 * Component Padding - Platform Optimized
 */
export const componentPadding = {
  input: {
    vertical: isWeb ? spacing.xs : spacing.sm,
    horizontal: spacing.sm,
  },
  button: {
    small: {
      vertical: isWeb ? spacing.xs : spacing.xs,
      horizontal: spacing.md,
    },
    medium: {
      vertical: isWeb ? spacing.sm : spacing.sm,
      horizontal: spacing.lg,
    },
    large: {
      vertical: isWeb ? spacing.md : spacing.md,
      horizontal: spacing.xl,
    },
  },
  card: {
    vertical: spacing.md,
    horizontal: spacing.md,
  },
};

/**
 * Layout Constraints - Responsive Breakpoints
 */
export const layoutConstraints = {
  maxContentWidth: {
    auth: 480, // Login, Signup gibi auth ekranları için
    tablet: 1200, // Tablet ve üzeri için maksimum genişlik
    desktop: 1400, // Desktop için maksimum genişlik
  },
  gridColumns: {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    largeDesktop: 4,
  },
  breakpoints: {
    mobile: 600,
    tablet: 768,
    desktop: 1024,
    largeDesktop: 1366,
  },
};

/**
 * Helper: Platform'a göre değer döndür
 */
export const platformValue = <T,>(webValue: T, nativeValue: T): T => {
  return isWeb ? webValue : nativeValue;
};

/**
 * Helper: Responsive grid column sayısı hesapla
 * Fiş kartları için optimize edilmiş
 */
export const getResponsiveColumns = (width: number): number => {
  // Mobil: tek kolon
  if (width < layoutConstraints.breakpoints.mobile) return 1;
  // Tablet: 2 kolon
  if (width < layoutConstraints.breakpoints.desktop) return 2;
  // Desktop: 3 kolon
  if (width < layoutConstraints.breakpoints.largeDesktop) return 3;
  // Large Desktop: 4 kolon
  return 4;
};

/**
 * Helper: Ekran genişliğine göre max content width
 */
export const getMaxContentWidth = (width: number): number => {
  if (width < layoutConstraints.breakpoints.tablet) return width;
  if (width < layoutConstraints.breakpoints.desktop) return Math.min(width * 0.9, layoutConstraints.maxContentWidth.tablet);
  return Math.min(width * 0.85, layoutConstraints.maxContentWidth.desktop);
};

/**
 * Component Specific Heights Helper
 */
export const getComponentHeight = (component: 'input' | 'button', size: 'small' | 'medium' | 'large' = 'medium'): number => {
  return componentHeights[component][size];
};

/**
 * Component Specific Padding Helper
 */
export const getComponentPadding = (component: 'input' | 'button' | 'card', size?: 'small' | 'medium' | 'large') => {
  if (component === 'card') {
    return componentPadding.card;
  }
  if (component === 'input') {
    return componentPadding.input;
  }
  if (component === 'button' && size) {
    return componentPadding.button[size];
  }
  return componentPadding.button.medium;
};

export default {
  isWeb,
  isIOS,
  isAndroid,
  componentHeights,
  componentPadding,
  layoutConstraints,
  platformValue,
  getResponsiveColumns,
  getMaxContentWidth,
  getComponentHeight,
  getComponentPadding,
};
