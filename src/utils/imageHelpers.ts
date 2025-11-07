/**
 * Image Helpers - Resim İşleme Yardımcıları
 * Web ve native platform uyumluluğu
 */

import { Platform, Dimensions } from 'react-native';

/**
 * Güvenli image boyutu hesaplama
 */
export const getSafeImageSize = (width?: number, height?: number) => {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  // Varsayılan boyutlar
  const defaultWidth = Platform.OS === 'web' ? 300 : screenWidth * 0.8;
  const defaultHeight = Platform.OS === 'web' ? 200 : screenHeight * 0.3;

  return {
    width: width && width > 0 ? Math.min(width, screenWidth) : defaultWidth,
    height: height && height > 0 ? Math.min(height, screenHeight) : defaultHeight,
  };
};

/**
 * Image source güvenlik kontrolü
 */
export const getSafeImageSource = (source?: any) => {
  if (!source) {
    return null;
  }

  // String URI kontrolü
  if (typeof source === 'string') {
    return source.startsWith('http') || source.startsWith('file') || source.startsWith('data:') 
      ? { uri: source } 
      : null;
  }

  // Object source kontrolü
  if (typeof source === 'object' && source.uri) {
    return source;
  }

  return null;
};

/**
 * Web için image loading handle
 */
export const handleImageLoad = (callback?: (size: { width: number, height: number }) => void) => {
  return (event: any) => {
    if (Platform.OS === 'web' && event?.target) {
      const { naturalWidth, naturalHeight } = event.target;
      const safeSize = getSafeImageSize(naturalWidth, naturalHeight);
      callback?.(safeSize);
    }
  };
};

/**
 * Image error handling
 */
export const handleImageError = (callback?: () => void) => {
  return (error: any) => {
    console.warn('Image load error:', error);
    callback?.();
  };
};

export default {
  getSafeImageSize,
  getSafeImageSource,
  handleImageLoad,
  handleImageError,
};
