/**
 * Visual Effects - Modern UI Efektleri
 * 
 * Gradients, glassmorphism, blur ve diğer modern efektler
 */

import { ViewStyle, TextStyle } from 'react-native';

/**
 * Gradient Definitions
 * LinearGradient için hazır renk kombinasyonları
 */
export const gradients = {
  // Primary gradients - Daha Pastel
  primaryLight: ['#7BA3D6', '#5B8AC5', '#3D6BA3'],
  primaryDark: ['#3D6BA3', '#5B8AC5', '#7BA3D6'],
  
  // Accent gradients - Daha Pastel
  ocean: ['#5EAFD9', '#5B8AC5', '#3D6BA3'],
  sunset: ['#F5B678', '#F28B82', '#E07B7B'],
  forest: ['#52C67D', '#45B56E', '#3A9B5C'],
  purple: ['#B47FE5', '#9B67D1', '#8556BD'],
  
  // Status gradients - Daha Pastel
  success: ['#52C67D', '#45B56E'],
  warning: ['#F5D472', '#F5B678'],
  error: ['#EF7370', '#E07B7B'],
  info: ['#5EAFD9', '#4A9EC9'],
  
  // Neutral gradients - Daha Pastel
  lightGray: ['#FAFBFD', '#F7F9FC', '#EBF0F5'],
  darkGray: ['#374151', '#1F2937', '#111827'],
  
  // Special gradients
  glass: ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'],
  glassDark: ['rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0.1)'],
  shimmer: ['#E5E7EB', '#F9FAFB', '#E5E7EB'],
  
  // Card gradients - Daha Pastel
  cardLight: ['#FFFFFF', '#FAFBFD'],
  cardDark: ['#1F2937', '#111827'],
} as const;

/**
 * Gradient Directions
 * Gradient yönleri için başlangıç ve bitiş koordinatları
 */
export const gradientDirections = {
  vertical: { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
  horizontal: { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  diagonal: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  diagonalReverse: { start: { x: 1, y: 0 }, end: { x: 0, y: 1 } },
  radial: { start: { x: 0.5, y: 0.5 }, end: { x: 1, y: 1 } },
} as const;

/**
 * Glassmorphism Styles
 * Modern cam efekti stilleri
 */
export const glassmorphism = {
  light: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    // Note: BlurView kullanılacak
  } as ViewStyle,
  
  dark: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  } as ViewStyle,
  
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  } as ViewStyle,
  
  cardDark: {
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  } as ViewStyle,
} as const;

/**
 * Neumorphism Styles
 * Soft UI / Neumorphic tasarım stilleri
 */
export const neumorphism = {
  light: {
    backgroundColor: '#E5E7EB',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -6, height: -6 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  } as ViewStyle,
  
  dark: {
    backgroundColor: '#1F2937',
    shadowColor: '#000000',
    shadowOffset: { width: -6, height: -6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  } as ViewStyle,
  
  pressed: {
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  } as ViewStyle,
} as const;

/**
 * Overlay Styles
 * Modal ve backdrop overlay'leri
 */
export const overlays = {
  light: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  } as ViewStyle,
  
  medium: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  } as ViewStyle,
  
  dark: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  } as ViewStyle,
  
  blur: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  } as ViewStyle,
} as const;

/**
 * Shimmer/Skeleton Loading
 */
export const shimmer = {
  background: '#E5E7EB',
  highlight: '#F9FAFB',
  duration: 1500,
} as const;

/**
 * Glow Effects
 * İkon ve text için parıltı efektleri
 */
export const glow = {
  primary: {
    textShadowColor: 'rgba(31, 75, 143, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  } as TextStyle,
  
  success: {
    textShadowColor: 'rgba(39, 174, 96, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  } as TextStyle,
  
  warning: {
    textShadowColor: 'rgba(242, 201, 76, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  } as TextStyle,
  
  error: {
    textShadowColor: 'rgba(235, 87, 87, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  } as TextStyle,
} as const;

/**
 * Border Gradients
 * Gradient border efekti için
 */
export const borderGradients = {
  primary: {
    borderWidth: 2,
    // LinearGradient wrapper kullanılacak
  } as ViewStyle,
  
  premium: {
    borderWidth: 2,
    // Gold gradient border için
  } as ViewStyle,
} as const;

/**
 * Card Elevation Levels
 * Material Design inspired elevation
 */
export const elevation = {
  0: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  } as ViewStyle,
  
  1: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  } as ViewStyle,
  
  2: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  } as ViewStyle,
  
  3: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  } as ViewStyle,
  
  4: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 4,
  } as ViewStyle,
  
  5: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 5,
  } as ViewStyle,
} as const;

/**
 * Blur Intensity
 * BlurView için intensity değerleri
 */
export const blurIntensity = {
  light: 20,
  medium: 50,
  strong: 80,
  extraStrong: 100,
} as const;

/**
 * Backdrop Filters
 * CSS backdrop-filter benzeri efektler (web için)
 */
export const backdropFilters = {
  blur: 'blur(10px)',
  blurLight: 'blur(5px)',
  blurHeavy: 'blur(20px)',
  brightness: 'brightness(1.1)',
  contrast: 'contrast(1.2)',
  saturate: 'saturate(1.3)',
} as const;

/**
 * Ripple Effect Configuration
 * Android ripple için
 */
export const ripple = {
  light: {
    color: 'rgba(0, 0, 0, 0.08)',
    borderless: false,
  },
  
  dark: {
    color: 'rgba(255, 255, 255, 0.12)',
    borderless: false,
  },
  
  primary: {
    color: 'rgba(31, 75, 143, 0.2)',
    borderless: false,
  },
} as const;

export default {
  gradients,
  gradientDirections,
  glassmorphism,
  neumorphism,
  overlays,
  shimmer,
  glow,
  borderGradients,
  elevation,
  blurIntensity,
  backdropFilters,
  ripple,
};
