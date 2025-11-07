/**
 * Spacing System - Boşluk Değerleri
 * 
 * 4px base system (8-point grid sistem için 4'ün katları)
 * Tüm margin, padding değerleri bu dosyadan gelir.
 */

/**
 * Base spacing unit: 4px
 */
const BASE = 4;

export const spacing = {
  xxs: BASE,        // 4px  - Çok küçük boşluklar
  xs: BASE * 2,     // 8px  - Küçük boşluklar
  sm: BASE * 3,     // 12px - Orta-küçük boşluklar
  md: BASE * 4,     // 16px - Standart boşluk
  lg: BASE * 5,     // 20px - Büyük boşluk
  xl: BASE * 6,     // 24px - Çok büyük boşluk
  xxl: BASE * 8,    // 32px - Ekstra büyük
  xxxl: BASE * 10,  // 40px - Çok ekstra büyük
  '2xl': BASE * 8,  // 32px - Alias for xxl
  '3xl': BASE * 10, // 40px - Alias for xxxl
  '4xl': BASE * 12, // 48px - Maksimum boşluk
} as const;

/**
 * Padding presets
 */
export const padding = {
  screen: spacing.md,           // 16px - Ekran kenar padding
  card: spacing.md,             // 16px - Kart içi padding
  button: {
    vertical: spacing.sm,       // 12px
    horizontal: spacing.lg,     // 20px
  },
  input: {
    vertical: spacing.sm,       // 12px
    horizontal: spacing.md,     // 16px
  },
  modal: spacing.lg,            // 20px - Modal içi padding
  section: spacing.xl,          // 24px - Bölüm arası boşluk
} as const;

/**
 * Margin presets
 */
export const margin = {
  listItem: spacing.xs,         // 8px - Liste öğeleri arası
  section: spacing.lg,          // 20px - Bölümler arası
  element: spacing.md,          // 16px - Elemanlar arası
  componentGap: spacing.sm,     // 12px - Component içi küçük gap
} as const;

/**
 * Border Radius (Köşe yuvarlaklığı)
 */
export const borderRadius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 999,    // Pill shape (tam yuvarlak)
  circle: '50%', // Daire
} as const;

/**
 * Border Width
 */
export const borderWidth = {
  none: 0,
  thin: 1,
  medium: 2,
  thick: 3,
} as const;

/**
 * Touchable Area (Dokunma Alanı)
 * Minimum dokunma alanı 44x44px (iOS HIG standart)
 */
export const touchable = {
  minHeight: 44,
  minWidth: 44,
} as const;

/**
 * Icon Sizes
 */
export const iconSize = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
  '2xl': 48,
} as const;

/**
 * Layout Presets
 */
export const layout = {
  maxContentWidth: 480,  // Maksimum içerik genişliği (tablet için)
  tabBarHeight: 60,      // Alt tab bar yüksekliği
  topBarHeight: 56,      // Üst bar yüksekliği
  inputHeight: 48,       // Input default yüksekliği
  buttonHeight: 48,      // Button default yüksekliği
  cardMinHeight: 80,     // Kart minimum yüksekliği
} as const;

export default {
  spacing,
  padding,
  margin,
  borderRadius,
  borderWidth,
  touchable,
  iconSize,
  layout,
};
