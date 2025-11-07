/**
 * Modern Tab Bar - Futuristik Floating Tab Bar
 * Glassmorphic, animated, modern design
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '@hooks';
import { 
  spacing as spacingSystem, 
  textStyles, 
  moderateScale, 
  elevation,
  responsiveSpacing,
  gradients,
} from '@theme';
import { ImageTypeModal } from '@components/modals';
import type { ImageType } from '@components/modals';

const spacing = spacingSystem.spacing;

export const ModernTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const { colors } = useTheme();
  const [showImageTypeModal, setShowImageTypeModal] = useState(false);

  const handleCameraPress = () => {
    setShowImageTypeModal(true);
  };

  const handleImageTypeSelect = (type: ImageType) => {
    // TODO: Kamera ekranına yönlendir
    console.log('Selected type:', type);
    // navigation.navigate('camera', { type });
  };

  const icons: Record<string, { active: string; inactive: string }> = {
    dashboard: { active: '🏠', inactive: '🏠' },
    index: { active: '📄', inactive: '📄' },
    'new-receipt': { active: '➕', inactive: '➕' },
    account: { active: '👤', inactive: '👤' },
  };

  return (
    <View style={styles.container}>
      {/* Glassmorphic Background */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
        style={[styles.tabBar, elevation[5]]}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel || options.title || route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const icon = icons[route.name] || { active: '•', inactive: '•' };

          // Ortaya kamera butonu eklemek için: 2. elemandan sonra (index === 1)
          const shouldShowCameraAfter = index === 1;

          return (
            <React.Fragment key={route.key}>
              <TouchableOpacity
                onPress={onPress}
                style={styles.tab}
                activeOpacity={0.7}
              >
                {/* Active Indicator with Gradient */}
                {isFocused && (
                  <LinearGradient
                    colors={gradients.primaryLight}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.activeIndicator}
                  />
                )}

                {/* Icon */}
                <View
                  style={[
                    styles.iconContainer,
                    isFocused && [
                      styles.activeIconContainer,
                      { backgroundColor: 'rgba(31, 75, 143, 0.1)' },
                    ],
                  ]}
                >
                  <Text style={[styles.icon, isFocused && styles.activeIcon]}>
                    {isFocused ? icon.active : icon.inactive}
                  </Text>
                </View>

                {/* Glow effect when active */}
                {isFocused && (
                  <View
                    style={[
                      styles.glow,
                      { backgroundColor: `${colors.primary}20` },
                    ]}
                  />
                )}
              </TouchableOpacity>

              {/* Kamera Butonu - 2. elemandan sonra ortaya ekleniyor */}
              {shouldShowCameraAfter && (
                <TouchableOpacity
                  onPress={handleCameraPress}
                  style={styles.tab}
                  activeOpacity={0.8}
                >
                  <View style={[styles.cameraButtonContainer, elevation[4]]}>
                    <LinearGradient
                      colors={gradients.primaryLight}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.cameraGradient}
                    >
                      <Text style={styles.cameraIcon}>📷</Text>
                    </LinearGradient>
                  </View>
                </TouchableOpacity>
              )}
            </React.Fragment>
          );
        })}
      </LinearGradient>

      {/* Image Type Modal */}
      <ImageTypeModal
        visible={showImageTypeModal}
        onClose={() => setShowImageTypeModal(false)}
        onSelectType={handleImageTypeSelect}
        bottomOffset={100}
      />

      {/* Bottom Safe Area */}
      <View
        style={[
          styles.safeArea,
          { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: spacing.sm,
    marginBottom: Platform.OS === 'ios' ? spacing.sm : spacing.xs,
    borderRadius: 20,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(31, 75, 143, 0.1)',
    overflow: 'hidden',
    height: 56, // Daha kompakt yükseklik
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    left: '10%',
    right: '10%',
    height: 2,
    borderRadius: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconContainer: {
    transform: [{ scale: 1.1 }],
  },
  icon: {
    fontSize: 22,
  },
  activeIcon: {
    transform: [{ scale: 1.05 }],
  },
  glow: {
    position: 'absolute',
    width: '80%',
    height: '80%',
    borderRadius: moderateScale(20),
    opacity: 0.3,
  },
  safeArea: {
    height: Platform.OS === 'ios' ? 20 : 0,
  },
  cameraButtonContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
  },
  cameraGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    fontSize: 26,
  },
});

export default ModernTabBar;
