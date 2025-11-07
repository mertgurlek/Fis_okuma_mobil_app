/**
 * useResponsive Hook - Responsive Değerleri Dinler
 * 
 * Ekran boyutu değiştiğinde component'leri otomatik re-render eder
 */

import { useWindowDimensions } from 'react-native';
import { useMemo } from 'react';
import {
  breakpoints,
  getIsSmallDevice,
  getIsMediumDevice,
  getIsLargeDevice,
  getIsTablet,
  getIsSmallTablet,
  getIsLargeTablet,
  getIsPortrait,
  getIsLandscape,
} from '@theme/responsive';

/**
 * useResponsive Hook
 * 
 * Ekran boyutu değişikliklerini dinler ve responsive değerleri döner
 */
export const useResponsive = () => {
  const { width, height } = useWindowDimensions();

  // Memoize edilen değerler - sadece width/height değişince yeniden hesaplanır
  const responsive = useMemo(() => ({
    width,
    height,
    
    // Device types
    isSmallDevice: getIsSmallDevice(),
    isMediumDevice: getIsMediumDevice(),
    isLargeDevice: getIsLargeDevice(),
    isTablet: getIsTablet(),
    isSmallTablet: getIsSmallTablet(),
    isLargeTablet: getIsLargeTablet(),
    
    // Orientation
    isPortrait: getIsPortrait(),
    isLandscape: getIsLandscape(),
    
    // Breakpoints
    breakpoints,
  }), [width, height]);

  return responsive;
};

export default useResponsive;
