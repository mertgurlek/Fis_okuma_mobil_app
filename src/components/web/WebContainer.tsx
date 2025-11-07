/**
 * WebContainer Component - Web Layout Wrapper
 * Web platformu için özel container bileşeni
 */

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useResponsive } from '@hooks';
import { getWebContainerWidth, getWebPadding, webStyles } from '@utils/webOptimizations';

interface WebContainerProps {
  children: React.ReactNode;
  centered?: boolean;
  maxWidth?: boolean;
  padding?: boolean;
  style?: any;
}

export const WebContainer: React.FC<WebContainerProps> = ({
  children,
  centered = true,
  maxWidth = true,
  padding = true,
  style = {},
}) => {
  const { width } = useResponsive();
  const isWeb = Platform.OS === 'web';

  if (!isWeb) {
    // Mobile/Native platformlarda normal View döndür
    return (
      <View style={[style]}>
        {children}
      </View>
    );
  }

  const containerStyles = [
    styles.container,
    centered && styles.centered,
    maxWidth && { 
      maxWidth: getWebContainerWidth(width),
      width: '100%'
    },
    padding && { 
      paddingHorizontal: getWebPadding(width)
    },
    webStyles.noSelect,
    style,
  ];

  return (
    <View style={containerStyles}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    alignSelf: 'center',
  },
});

export default WebContainer;
