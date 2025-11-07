/**
 * Renk Paleti - Light & Dark Mode
 * 
 * Tüm renkler bu dosyadan gelir.
 * Hiçbir ekranda hardcoded renk kullanılmaz.
 */

export const colors = {
  // Primary (Ana Mavi - Kurumsal) - Daha Pastel
  primary: '#5B8AC5',
  primaryLight: '#7BA3D6',
  primaryDark: '#3D6BA3',

  // Secondary (Gri-Mavi)
  secondary: '#4D647A',
  secondaryLight: '#6B8299',
  secondaryDark: '#3A4D5C',

  // Status Colors (Durum Renkleri) - Daha Pastel
  success: '#52C67D',       // Onaylı fiş
  successLight: '#EDF9F3',  // Success background
  warning: '#F5D472',       // Kontör azaldı
  warningLight: '#FFF9EB',  // Warning background
  error: '#EF7370',         // Hata
  errorLight: '#FFF2F2',    // Error background
  info: '#5EAFD9',          // Bilgi
  infoLight: '#EBF6FC',     // Info background

  // Light Mode - Daha Pastel ve Yumuşak Tonlar
  light: {
    bg: '#F7F9FC',              // Ana arka plan (daha açık mavi-beyaz)
    surface: '#FFFFFF',          // Kart/modal arka plan
    surfaceAlt: '#FAFBFD',      // Alternatif arka plan (liste satırları)
    textPrimary: '#2D3748',      // Ana metin (daha yumuşak siyah)
    textSecondary: '#718096',    // İkincil metin (daha yumuşak gri)
    textTertiary: '#A0AEC0',     // Yardımcı metin (daha açık gri)
    border: '#E8ECF2',           // Border rengi (daha açık)
    divider: '#E8ECF2',          // Ayırıcı çizgi
    disabled: '#D9E0E8',         // Disabled elemanlar
    placeholder: '#A0AEC0',      // Placeholder text
    overlay: 'rgba(0, 0, 0, 0.4)', // Modal overlay (daha şeffaf)
  },

  // Dark Mode
  dark: {
    bg: '#0F1419',              // Ana arka plan
    surface: '#111827',          // Kart/modal arka plan
    surfaceAlt: '#1F2937',      // Alternatif arka plan
    textPrimary: '#F9FAFB',      // Ana metin
    textSecondary: '#9CA3AF',    // İkincil metin
    textTertiary: '#6B7280',     // Yardımcı metin
    border: '#1F2933',           // Border rengi
    divider: '#1F2933',          // Ayırıcı çizgi
    disabled: '#374151',         // Disabled elemanlar
    placeholder: '#6B7280',      // Placeholder text
    overlay: 'rgba(0, 0, 0, 0.7)', // Modal overlay
  },

  // Common (Her iki modda da aynı)
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

/**
 * Statü renkleri - Badge & Tag için
 */
export const statusColors = {
  approved: {
    bg: colors.successLight,
    text: colors.success,
    border: colors.success,
  },
  pending: {
    bg: colors.warningLight,
    text: '#D97706', // Daha koyu turuncu
    border: '#F59E0B',
  },
  processing: {
    bg: colors.infoLight,
    text: colors.info,
    border: colors.info,
  },
  info: {
    bg: colors.infoLight,
    text: colors.info,
    border: colors.info,
  },
  deleted: {
    bg: '#F3F4F6',
    text: '#6B7280',
    border: '#D1D5DB',
  },
  error: {
    bg: colors.errorLight,
    text: colors.error,
    border: colors.error,
  },
};

/**
 * Firma chip renkleri
 */
export const chipColors = {
  light: {
    bg: '#EDF3FA',
    text: colors.primaryDark,
    border: colors.primaryLight,
  },
  dark: {
    bg: '#1F2937',
    text: '#E5E7EB',
    border: '#374151',
  },
};

/**
 * Type: ThemeColors
 */
export type ThemeMode = 'light' | 'dark';

export type ThemeColors = {
  bg: string;
  surface: string;
  surfaceAlt: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  divider: string;
  disabled: string;
  placeholder: string;
  overlay: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  white: string;
  black: string;
};

export default colors;
