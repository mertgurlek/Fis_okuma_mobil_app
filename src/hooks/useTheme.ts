/**
 * useTheme Hook - Tema Yönetimi
 * 
 * Tema değiştirme, renk ve stil erişimi
 */

import { useUIStore } from '@store';
import { getThemeColors, getThemeShadows, ThemeMode } from '@theme';
import { useColorScheme } from 'react-native';

/**
 * useTheme Hook
 * 
 * @returns Tema state ve fonksiyonları
 * 
 * @example
 * const { theme, colors, shadows, toggleTheme } = useTheme();
 */
export const useTheme = () => {
  const systemTheme = useColorScheme();
  const { theme: userTheme, setTheme, toggleTheme } = useUIStore();

  // Kullanıcı sistem temasını seçmişse, sistem temasını kullan
  const activeTheme: ThemeMode = 
    userTheme === 'system' 
      ? (systemTheme as ThemeMode) || 'light' 
      : userTheme;

  // Aktif tema renklerini al
  const colors = getThemeColors(activeTheme);
  
  // Aktif tema gölgelerini al
  const shadows = getThemeShadows(activeTheme);

  /**
   * Tema değiştir (light/dark toggle)
   */
  const toggle = () => {
    toggleTheme();
  };

  /**
   * Belirli bir temayı ayarla
   */
  const setSpecificTheme = (theme: ThemeMode) => {
    setTheme(theme);
  };

  /**
   * Dark mode aktif mi?
   */
  const isDark = activeTheme === 'dark';

  return {
    theme: activeTheme,
    userTheme,
    colors,
    shadows,
    isDark,
    toggleTheme: toggle,
    setTheme: setSpecificTheme,
  };
};

export default useTheme;
