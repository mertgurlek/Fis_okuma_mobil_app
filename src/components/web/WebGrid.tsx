/**
 * WebGrid Component - Responsive Grid Layout
 * Web platformu için CSS Grid sistemi
 */

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useResponsive } from '@hooks';
import { getWebGridColumns, webStyles } from '@utils/webOptimizations';
import { spacing, moderateScale } from '@theme';

interface WebGridProps {
  children: React.ReactNode;
  minItemWidth?: number;
  gap?: number;
  style?: any;
}

export const WebGrid: React.FC<WebGridProps> = ({
  children,
  minItemWidth = 300,
  gap = 16,
  style = {},
}) => {
  const { width } = useResponsive();
  const isWeb = Platform.OS === 'web';

  if (!isWeb) {
    // Mobile'da normal flex layout
    return (
      <View style={[styles.mobileContainer, style]}>
        {children}
      </View>
    );
  }

  const columns = getWebGridColumns(width);
  
  const gridStyles = [
    styles.webGrid,
    {
      gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}px, 1fr))`,
      gap: gap,
    },
    webStyles.noSelect,
    style,
  ];

  return (
    <View style={gridStyles}>
      {children}
    </View>
  );
};

interface WebGridItemProps {
  children: React.ReactNode;
  span?: number;
  style?: any;
}

export const WebGridItem: React.FC<WebGridItemProps> = ({
  children,
  span = 1,
  style = {},
}) => {
  const isWeb = Platform.OS === 'web';

  const itemStyles = [
    isWeb && {
      gridColumn: span > 1 ? `span ${span}` : 'auto',
    },
    isWeb && webStyles.hoverEffect,
    style,
  ];

  return (
    <View style={itemStyles}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  mobileContainer: {
    flex: 1,
  },
  webGrid: {
    display: 'grid' as any,
    width: '100%',
  },
});

export default WebGrid;
