/**
 * Responsive System - Ekran Boyutları ve Breakpoints
 * 
 * Mobil ve tablet desteği için responsive sistem
 */

import { Dimensions, Platform, PixelRatio } from 'react-native';

// Web için window dimensions kullan
const getScreenDimensions = () => {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    // Web'de viewport width ve height'ı kullan
    return {
      width: Math.min(window.innerWidth, window.screen.availWidth || window.innerWidth),
      height: Math.min(window.innerHeight, window.screen.availHeight || window.innerHeight),
    };
  }
  return Dimensions.get('window');
};

// Her çağrıda güncel boyutları al
const getWidth = () => getScreenDimensions().width;
const getHeight = () => getScreenDimensions().height;

/**
 * Breakpoints
 */
export const breakpoints = {
  xs: 320,   // Küçük telefonlar
  sm: 375,   // Normal telefonlar (iPhone SE, 6, 7, 8)
  md: 414,   // Büyük telefonlar (iPhone Plus, XR, 11)
  lg: 768,   // Tabletler (iPad Mini)
  xl: 1024,  // Büyük tabletler (iPad Pro)
  xxl: 1366, // Çok büyük tabletler
} as const;

/**
 * Cihaz Tipleri - Dinamik getter'lar
 */
export const getIsSmallDevice = () => getWidth() < breakpoints.sm;
export const getIsMediumDevice = () => getWidth() >= breakpoints.sm && getWidth() < breakpoints.md;
export const getIsLargeDevice = () => getWidth() >= breakpoints.md && getWidth() < breakpoints.lg;
export const getIsTablet = () => getWidth() >= breakpoints.lg;
export const getIsSmallTablet = () => getWidth() >= breakpoints.lg && getWidth() < breakpoints.xl;
export const getIsLargeTablet = () => getWidth() >= breakpoints.xl;

// Geriye dönük uyumluluk için dinamik değerler (cached değil, her çağrıda yeniden hesaplanır)
export const isSmallDevice = () => getIsSmallDevice();
export const isMediumDevice = () => getIsMediumDevice();
export const isLargeDevice = () => getIsLargeDevice();
export const isTablet = () => getIsTablet();
export const isSmallTablet = () => getIsSmallTablet();
export const isLargeTablet = () => getIsLargeTablet();

/**
 * Platform Kontrolleri
 */
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isWeb = Platform.OS === 'web';

/**
 * Ekran Bilgileri
 */
export const getScreen = () => ({
  width: getWidth(),
  height: getHeight(),
  pixelRatio: PixelRatio.get(),
  fontScale: PixelRatio.getFontScale(),
});

// Dinamik screen getter - cached değil
export const screen = {
  get width() { return getWidth(); },
  get height() { return getHeight(); },
  get pixelRatio() { return PixelRatio.get(); },
  get fontScale() { return PixelRatio.getFontScale(); },
};

/**
 * Responsive Value Selector
 * Ekran boyutuna göre değer seçer
 */
export const responsiveValue = <T,>(values: {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  default: T;
}): T => {
  const width = getWidth();
  if (width >= breakpoints.xl && values.xl !== undefined) return values.xl;
  if (width >= breakpoints.lg && values.lg !== undefined) return values.lg;
  if (width >= breakpoints.md && values.md !== undefined) return values.md;
  if (width >= breakpoints.sm && values.sm !== undefined) return values.sm;
  if (values.xs !== undefined) return values.xs;
  return values.default;
};

/**
 * Responsive Spacing
 * Ekran boyutuna göre dinamik spacing
 */
export const responsiveSpacing = (baseSize: number): number => {
  const width = getWidth();
  if (width < breakpoints.sm) return baseSize * 0.85;
  if (width >= breakpoints.sm && width < breakpoints.md) return baseSize;
  if (width >= breakpoints.md && width < breakpoints.lg) return baseSize * 1.1;
  if (width >= breakpoints.lg) return baseSize * 1.3;
  return baseSize;
};

/**
 * Responsive Font Size
 * Ekran boyutuna göre dinamik font boyutu
 */
export const responsiveFontSize = (baseSize: number): number => {
  const width = getWidth();
  const scale = width / breakpoints.md;
  const newSize = baseSize * scale;
  
  if (width < breakpoints.sm) {
    return Math.round(newSize * 0.9);
  } else if (width >= breakpoints.lg) {
    return Math.round(newSize * 1.2);
  }
  
  return Math.round(newSize);
};

/**
 * Scale Size
 * Tasarım boyutuna göre scale eder
 */
export const scale = (size: number): number => {
  const guidelineBaseWidth = 375; // iPhone 8 base
  return (getWidth() / guidelineBaseWidth) * size;
};

/**
 * Vertical Scale
 */
export const verticalScale = (size: number): number => {
  const guidelineBaseHeight = 812; // iPhone X base
  return (getHeight() / guidelineBaseHeight) * size;
};

/**
 * Moderate Scale
 * Daha dengeli scaling
 */
export const moderateScale = (size: number, factor = 0.5): number => {
  return size + (scale(size) - size) * factor;
};

/**
 * Responsive Horizontal Padding
 * Kenar boşlukları responsive
 */
export const getHorizontalPadding = (): number => {
  const width = getWidth();
  if (width < breakpoints.sm) return 12;
  if (width >= breakpoints.sm && width < breakpoints.md) return 16;
  if (width >= breakpoints.md && width < breakpoints.lg) return 20;
  if (width >= breakpoints.lg && width < breakpoints.xl) return 32;
  if (width >= breakpoints.xl) return 48;
  return 16;
};

/**
 * Responsive Container Width
 * İçerik için maksimum genişlik
 */
export const getContainerWidth = (): number => {
  const width = getWidth();
  
  // Mobile'da tam genişlik
  if (width < breakpoints.lg) {
    return width;
  }
  
  // Tablet'te 85% ama maksimum 1200px
  return Math.min(width * 0.85, 1200);
};

/**
 * Grid Columns
 * Grid sistemi için kolon sayısı
 */
export const getGridColumns = (): number => {
  const width = getWidth();
  if (width < breakpoints.sm) return 1;
  if (width >= breakpoints.sm && width < breakpoints.lg) return 2;
  if (width >= breakpoints.lg && width < breakpoints.xl) return 3;
  if (width >= breakpoints.xl) return 4;
  return 2;
};

/**
 * Orientation
 */
export const getIsPortrait = () => getHeight() > getWidth();
export const getIsLandscape = () => getWidth() > getHeight();

// Dinamik orientation değerleri
export const isPortrait = () => getIsPortrait();
export const isLandscape = () => getIsLandscape();

/**
 * Safe Area Estimates
 * Güvenli alan tahminleri
 */
export const safeArea = {
  get top() { return isIOS ? (isLandscape() ? 0 : 44) : 0; },
  get bottom() { return isIOS ? (isLandscape() ? 21 : 34) : 0; },
  get left() { return isIOS && isLandscape() ? 44 : 0; },
  get right() { return isIOS && isLandscape() ? 44 : 0; },
};

/**
 * Device Info Object
 */
export const deviceInfo = {
  get isSmallDevice() { return isSmallDevice(); },
  get isMediumDevice() { return isMediumDevice(); },
  get isLargeDevice() { return isLargeDevice(); },
  get isTablet() { return isTablet(); },
  get isSmallTablet() { return isSmallTablet(); },
  get isLargeTablet() { return isLargeTablet(); },
  isIOS,
  isAndroid,
  isWeb,
  get isPortrait() { return isPortrait(); },
  get isLandscape() { return isLandscape(); },
  screen,
  safeArea,
};

export default {
  breakpoints,
  deviceInfo,
  screen,
  responsiveValue,
  responsiveSpacing,
  responsiveFontSize,
  scale,
  verticalScale,
  moderateScale,
  getHorizontalPadding,
  getContainerWidth,
  getGridColumns,
};
