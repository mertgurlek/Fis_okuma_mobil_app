/**
 * Theme System - Ana Export Dosyası
 * 
 * Tüm tema değişkenleri buradan export edilir.
 * Kullanım: import { colors, spacing, typography } from '@theme';
 */

import colors, { ThemeMode, ThemeColors, statusColors, chipColors } from './colors';
import typography, { textStyles, fontSize, fontWeight, lineHeight } from './typography';
import spacing, { padding, margin, borderRadius, borderWidth, iconSize, layout, touchable } from './spacing';
import shadows, { lightShadows, darkShadows, customShadows, ShadowSize } from './shadows';
import responsive, { 
  breakpoints, 
  deviceInfo, 
  screen,
  responsiveValue,
  responsiveSpacing,
  responsiveFontSize,
  scale,
  moderateScale,
  getHorizontalPadding,
  getContainerWidth,
  getGridColumns,
} from './responsive';
import animations, { 
  duration, 
  easing, 
  presets as animationPresets,
  interpolations,
  touchResponse,
} from './animations';
import effects, {
  gradients,
  gradientDirections,
  glassmorphism,
  elevation,
  overlays,
  glow,
  shimmer,
  ripple,
} from './effects';
import platformSpecific, {
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
} from './platformSpecific';

/**
 * Ana Tema Objesi
 */
export const theme = {
  colors,
  typography,
  spacing,
  shadows,
  statusColors,
  chipColors,
  textStyles,
  fontSize,
  fontWeight,
  lineHeight,
  padding,
  margin,
  borderRadius,
  borderWidth,
  iconSize,
  layout,
  touchable,
  lightShadows,
  darkShadows,
  customShadows,
  // Responsive
  responsive,
  breakpoints,
  deviceInfo,
  screen,
  responsiveValue,
  responsiveSpacing,
  responsiveFontSize,
  scale,
  moderateScale,
  getHorizontalPadding,
  getContainerWidth,
  getGridColumns,
  // Animations
  animations,
  duration,
  easing,
  animationPresets,
  interpolations,
  touchResponse,
  // Effects
  effects,
  gradients,
  gradientDirections,
  glassmorphism,
  elevation,
  overlays,
  glow,
  shimmer,
  ripple,
  // Platform Specific
  platformSpecific,
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

/**
 * Theme Helper - Mod'a göre renk ve gölge döner
 */
export const getThemeColors = (mode: ThemeMode): any => {
  const baseColors = {
    primary: colors.primary,
    primaryLight: colors.primaryLight,
    primaryDark: colors.primaryDark,
    secondary: colors.secondary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    white: colors.white,
    black: colors.black,
  };

  return mode === 'light' 
    ? { ...baseColors, ...colors.light } 
    : { ...baseColors, ...colors.dark };
};

export const getThemeShadows = (mode: ThemeMode) => {
  return mode === 'light' ? lightShadows : darkShadows;
};

/**
 * Type Exports
 */
export type { ThemeMode, ThemeColors, ShadowSize };

/**
 * Default Exports
 */
export {
  // Colors
  colors,
  statusColors,
  chipColors,
  // Typography
  typography,
  textStyles,
  fontSize,
  fontWeight,
  lineHeight,
  // Spacing
  spacing,
  padding,
  margin,
  borderRadius,
  borderWidth,
  iconSize,
  layout,
  touchable,
  // Shadows
  shadows,
  lightShadows,
  darkShadows,
  customShadows,
  // Responsive
  responsive,
  breakpoints,
  deviceInfo,
  screen,
  responsiveValue,
  responsiveSpacing,
  responsiveFontSize,
  scale,
  moderateScale,
  getHorizontalPadding,
  getContainerWidth,
  getGridColumns,
  // Animations
  animations,
  duration,
  easing,
  animationPresets,
  interpolations,
  touchResponse,
  // Effects
  effects,
  gradients,
  gradientDirections,
  glassmorphism,
  elevation,
  overlays,
  glow,
  shimmer,
  ripple,
  // Platform Specific
  platformSpecific,
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

export default theme;
