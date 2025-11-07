/**
 * Input Component - Modern Text Input Bileşeni
 * 
 * Animasyonlu, responsive ve modern tasarımlı input
 * Focus animation, floating label desteği
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  Animated,
} from 'react-native';
import { useTheme } from '@hooks';
import { 
  spacing as spacingSystem, 
  borderRadius, 
  textStyles,
  responsiveSpacing,
  moderateScale,
  elevation,
  duration,
  easing,
  getComponentHeight,
  getComponentPadding,
} from '@theme';

const spacing = spacingSystem.spacing;

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  onRightIconPress?: () => void;
  floatingLabel?: boolean;
  variant?: 'default' | 'filled' | 'outlined';
}

/**
 * Input Component
 */
export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerStyle,
  onRightIconPress,
  style,
  editable = true,
  floatingLabel = false,
  variant = 'outlined',
  value,
  ...textInputProps
}) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const labelAnimation = useRef(new Animated.Value(value ? 1 : 0)).current;
  const borderAnimation = useRef(new Animated.Value(0)).current;

  const hasError = !!error;

  // Border rengi
  const borderColor = hasError
    ? colors.error
    : isFocused
    ? colors.primary
    : colors.border;

  // Floating label animasyonu
  useEffect(() => {
    if (floatingLabel) {
      Animated.timing(labelAnimation, {
        toValue: isFocused || value ? 1 : 0,
        duration: duration.fast,
        easing: easing.smooth,
        useNativeDriver: false,
      }).start();
    }
  }, [isFocused, value, floatingLabel]);

  // Border animasyonu
  useEffect(() => {
    Animated.timing(borderAnimation, {
      toValue: isFocused ? 1 : 0,
      duration: duration.fast,
      easing: easing.smooth,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  const animatedBorderColor = borderAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.primary],
  });

  const labelStyle = floatingLabel
    ? {
        position: 'absolute' as const,
        left: leftIcon ? 40 : 12,
        top: labelAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [16, -8],
        }),
        fontSize: labelAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [14, 11],
        }),
        backgroundColor: colors.surface,
        paddingHorizontal: 4,
        zIndex: 1,
      }
    : {};

  // Variant stilleri
  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'filled':
        return {
          backgroundColor: colors.surfaceAlt,
          borderBottomWidth: 2,
          borderRadius: moderateScale(8),
        };
      case 'outlined':
        return {
          backgroundColor: colors.surface,
          borderWidth: moderateScale(1.5),
          borderRadius: moderateScale(8),
          ...elevation[1],
        };
      default:
        return {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderRadius: moderateScale(8),
        };
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label - Static veya Floating */}
      {label && !floatingLabel && (
        <Text
          style={[
            styles.label,
            { color: hasError ? colors.error : colors.textSecondary },
          ]}
        >
          {label}
        </Text>
      )}

      {/* Input Container */}
      <View style={{ position: 'relative' }}>
        {label && floatingLabel && (
          <Animated.Text
            style={[
              styles.floatingLabel,
              labelStyle,
              { color: hasError ? colors.error : isFocused ? colors.primary : colors.textSecondary },
            ]}
          >
            {label}
          </Animated.Text>
        )}
        
        <Animated.View
          style={[
            styles.inputContainer,
            getVariantStyles(),
            {
              borderColor: hasError ? colors.error : animatedBorderColor,
              backgroundColor: editable ? (variant === 'filled' ? colors.surfaceAlt : colors.surface) : colors.disabled,
            },
            !editable && styles.disabled,
          ]}
        >
        {/* Left Icon */}
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

          {/* Text Input */}
          <TextInput
            style={[
              styles.input,
              textStyles.body,
              { color: colors.textPrimary },
              !editable && { color: colors.textTertiary },
              floatingLabel && { paddingTop: responsiveSpacing(spacing.md) },
              style,
            ]}
            placeholderTextColor={colors.placeholder}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            editable={editable}
            value={value}
            {...textInputProps}
          />

          {/* Right Icon */}
          {rightIcon && (
            <TouchableOpacity
              style={styles.rightIcon}
              onPress={onRightIconPress}
              disabled={!onRightIconPress}
            >
              {rightIcon}
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>

      {/* Helper Text veya Error */}
      {(helperText || error) && (
        <Text
          style={[
            styles.helperText,
            { color: hasError ? colors.error : colors.textSecondary },
          ]}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...textStyles.labelSmall,
    marginBottom: spacing.xxs,
    fontWeight: '500',
  },
  floatingLabel: {
    ...textStyles.labelSmall,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: getComponentPadding('input').horizontal,
    minHeight: getComponentHeight('input', 'medium'),
  },
  input: {
    flex: 1,
    paddingVertical: getComponentPadding('input').vertical,
  },
  leftIcon: {
    marginRight: spacing.xs,
  },
  rightIcon: {
    marginLeft: spacing.xs,
    padding: spacing.xxs,
  },
  disabled: {
    opacity: 0.6,
  },
  helperText: {
    ...textStyles.caption,
    marginTop: spacing.xxs,
  },
});

export default Input;
