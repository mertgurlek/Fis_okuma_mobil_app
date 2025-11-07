/**
 * Button Component - Modern Buton Bileşeni
 * 
 * Responsive, animasyonlu ve gradient destekli button
 * Primary, Secondary, Destructive, Outline, Ghost varyasyonları
 */

import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Animated,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@hooks';
import { 
  spacing as spacingSystem, 
  borderRadius, 
  textStyles,
  responsiveSpacing,
  moderateScale,
  elevation,
  touchResponse,
  getComponentHeight,
  getComponentPadding,
} from '@theme';

const spacing = spacingSystem.spacing;

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'gradient';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
  hapticFeedback?: boolean;
  elevation?: boolean;
}

/**
 * Button Component
 */
export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle: customTextStyle,
  hapticFeedback = true,
  elevation: hasElevation = true,
}) => {
  const { colors, shadows } = useTheme();
  const [scaleValue] = useState(new Animated.Value(1));

  // Variant stilleri
  const variantStyles: Record<string, ViewStyle> = {
    primary: {
      backgroundColor: colors.primary,
      ...(hasElevation ? elevation[2] : {}),
    },
    secondary: {
      backgroundColor: colors.secondary,
      ...(hasElevation ? elevation[2] : {}),
    },
    destructive: {
      backgroundColor: colors.error,
      ...(hasElevation ? elevation[2] : {}),
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: moderateScale(2),
      borderColor: colors.primary,
    },
    ghost: {
      backgroundColor: 'transparent',
    },
    gradient: {
      // Gradient için LinearGradient kullanılacak
    },
  };

  // Text renkleri
  const textColors: Record<string, string> = {
    primary: colors.white,
    secondary: colors.white,
    destructive: colors.white,
    outline: colors.primary,
    ghost: colors.primary,
    gradient: colors.white,
  };

  // Boyut stilleri - responsive
  const sizeStyles: Record<string, ViewStyle> = {
    small: {
      paddingVertical: getComponentPadding('button', 'small').vertical,
      paddingHorizontal: getComponentPadding('button', 'small').horizontal,
      minHeight: getComponentHeight('button', 'small'),
    },
    medium: {
      paddingVertical: getComponentPadding('button', 'medium').vertical,
      paddingHorizontal: getComponentPadding('button', 'medium').horizontal,
      minHeight: getComponentHeight('button', 'medium'),
    },
    large: {
      paddingVertical: getComponentPadding('button', 'large').vertical,
      paddingHorizontal: getComponentPadding('button', 'large').horizontal,
      minHeight: getComponentHeight('button', 'large'),
    },
  };

  // Text boyutları
  const textSizes: Record<string, TextStyle> = {
    small: textStyles.buttonSmall,
    medium: textStyles.button,
    large: textStyles.buttonLarge,
  };

  const isDisabled = disabled || loading;

  // Press animasyonu
  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: touchResponse.scalePress,
      useNativeDriver: true,
      tension: 100,
      friction: 3,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 3,
    }).start();
  };

  const buttonContent = (
    <>
      {loading ? (
        <ActivityIndicator 
          color={textColors[variant]} 
          size={size === 'small' ? 'small' : 'small'}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text
            style={[
              textSizes[size],
              { color: textColors[variant] },
              isDisabled && styles.disabledText,
              customTextStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </>
  );

  const buttonStyle = [
    styles.button,
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
    style,
  ];

  // Gradient variant
  if (variant === 'gradient' && !isDisabled) {
    return (
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isDisabled}
          activeOpacity={1}
        >
          <LinearGradient
            colors={['#3C6BB8', '#1F4B8F', '#16366A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.button,
              sizeStyles[size],
              fullWidth && styles.fullWidth,
              hasElevation && elevation[3],
              { borderRadius: borderRadius.md },
            ]}
          >
            {buttonContent}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        style={buttonStyle}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        activeOpacity={1}
      >
        {buttonContent}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
});

export default Button;
