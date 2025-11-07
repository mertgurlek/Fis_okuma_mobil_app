/**
 * Typography - Font Boyutları ve Stiller
 * 
 * Tüm metin stilleri bu dosyadan gelir.
 * Mobile-first yaklaşım: Telefonda okunabilir boyutlar.
 */

import { TextStyle } from 'react-native';

/**
 * Font Aileleri
 */
export const fontFamily = {
  regular: 'System', // iOS: SF Pro, Android: Roboto
  medium: 'System',
  semiBold: 'System',
  bold: 'System',
};

/**
 * Font Boyutları (px)
 */
export const fontSize = {
  xs: 12,    // Küçük yardımcı metinler
  sm: 13,    // Secondary text, hints
  base: 14,  // Ana metin, form alanları
  md: 15,    // Büyük metin
  lg: 16,    // Kart başlıkları, unvan
  xl: 18,    // Alt başlıklar
  '2xl': 20, // Ekran başlıkları
  '3xl': 22, // Büyük başlıklar
  '4xl': 24, // Splash/özel başlıklar
  '5xl': 28, // Çok büyük başlıklar
};

/**
 * Font Ağırlıkları
 */
export const fontWeight = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semiBold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
};

/**
 * Line Height (Satır Aralığı)
 */
export const lineHeight = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
  loose: 1.8,
};

/**
 * Önceden tanımlanmış Text Stilleri
 */
export const textStyles = {
  // Başlıklar
  h1: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
    lineHeight: fontSize['3xl'] * lineHeight.tight,
  } as TextStyle,

  h2: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.semiBold,
    lineHeight: fontSize['2xl'] * lineHeight.tight,
  } as TextStyle,

  h3: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semiBold,
    lineHeight: fontSize.xl * lineHeight.normal,
  } as TextStyle,

  h4: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semiBold,
    lineHeight: fontSize.lg * lineHeight.normal,
  } as TextStyle,

  // Body (Gövde Metinleri)
  body: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.base * lineHeight.normal,
  } as TextStyle,

  bodyLarge: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.md * lineHeight.normal,
  } as TextStyle,

  bodySmall: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.sm * lineHeight.normal,
  } as TextStyle,

  // Labels (Etiketler)
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.sm * lineHeight.normal,
  } as TextStyle,

  labelLarge: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.base * lineHeight.normal,
  } as TextStyle,

  labelSmall: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.xs * lineHeight.normal,
  } as TextStyle,

  // Caption (Alt Yazılar)
  caption: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.xs * lineHeight.normal,
  } as TextStyle,

  // Button Text
  button: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semiBold,
    lineHeight: fontSize.base * lineHeight.tight,
  } as TextStyle,

  buttonSmall: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.sm * lineHeight.tight,
  } as TextStyle,

  buttonLarge: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semiBold,
    lineHeight: fontSize.lg * lineHeight.tight,
  } as TextStyle,

  // Input Text
  input: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.base * lineHeight.normal,
  } as TextStyle,

  // Special (Özel kullanımlar)
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semiBold,
    lineHeight: fontSize.lg * lineHeight.tight,
  } as TextStyle,

  amount: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.xl * lineHeight.tight,
  } as TextStyle,

  badge: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semiBold,
    lineHeight: fontSize.xs * lineHeight.tight,
  } as TextStyle,
};

export type TextStyleKey = keyof typeof textStyles;

export default {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  textStyles,
};
