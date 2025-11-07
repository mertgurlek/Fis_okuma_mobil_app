/**
 * Animation System - Animasyon ve Easing Fonksiyonları
 * 
 * Smooth ve modern animasyonlar için timing ve preset'ler
 */

import { Animated, Easing } from 'react-native';

/**
 * Animation Durations (ms)
 */
export const duration = {
  instant: 0,
  fast: 150,
  normal: 250,
  slow: 400,
  slower: 600,
  verySlow: 800,
} as const;

/**
 * Easing Functions
 * Modern UI için optimized easing curves
 */
export const easing = {
  // Standard easings
  linear: Easing.linear,
  ease: Easing.ease,
  easeIn: Easing.in(Easing.ease),
  easeOut: Easing.out(Easing.ease),
  easeInOut: Easing.inOut(Easing.ease),
  
  // Quad easings
  quadIn: Easing.in(Easing.quad),
  quadOut: Easing.out(Easing.quad),
  quadInOut: Easing.inOut(Easing.quad),
  
  // Cubic easings (Material Design standart)
  cubicIn: Easing.in(Easing.cubic),
  cubicOut: Easing.out(Easing.cubic),
  cubicInOut: Easing.inOut(Easing.cubic),
  
  // Bezier curves (iOS inspired)
  smooth: Easing.bezier(0.4, 0.0, 0.2, 1),      // Material standard
  decelerate: Easing.bezier(0.0, 0.0, 0.2, 1),  // Material decelerate
  accelerate: Easing.bezier(0.4, 0.0, 1, 1),    // Material accelerate
  sharp: Easing.bezier(0.4, 0.0, 0.6, 1),       // Material sharp
  
  // Special easings
  bounce: Easing.bounce,
  elastic: Easing.elastic(1),
  spring: Easing.bezier(0.25, 0.46, 0.45, 0.94), // Spring-like
} as const;

/**
 * Animation Presets
 * Hazır animasyon konfigürasyonları
 */
export const presets = {
  // Fade animations
  fadeIn: {
    duration: duration.normal,
    easing: easing.easeOut,
    useNativeDriver: true,
  },
  fadeOut: {
    duration: duration.normal,
    easing: easing.easeIn,
    useNativeDriver: true,
  },
  
  // Scale animations
  scaleUp: {
    duration: duration.fast,
    easing: easing.smooth,
    useNativeDriver: true,
  },
  scaleDown: {
    duration: duration.fast,
    easing: easing.smooth,
    useNativeDriver: true,
  },
  
  // Slide animations
  slideIn: {
    duration: duration.normal,
    easing: easing.decelerate,
    useNativeDriver: true,
  },
  slideOut: {
    duration: duration.normal,
    easing: easing.accelerate,
    useNativeDriver: true,
  },
  
  // Modal animations
  modalPresent: {
    duration: duration.slow,
    easing: easing.smooth,
    useNativeDriver: true,
  },
  modalDismiss: {
    duration: duration.normal,
    easing: easing.sharp,
    useNativeDriver: true,
  },
  
  // Spring animations
  spring: {
    tension: 40,
    friction: 7,
    useNativeDriver: true,
  },
  springBounce: {
    tension: 100,
    friction: 7,
    useNativeDriver: true,
  },
} as const;

/**
 * Timing Animation Helper
 */
export const createTimingAnimation = (
  value: Animated.Value,
  toValue: number,
  config?: {
    duration?: number;
    easing?: typeof easing[keyof typeof easing];
    delay?: number;
    useNativeDriver?: boolean;
  }
): Animated.CompositeAnimation => {
  return Animated.timing(value, {
    toValue,
    duration: config?.duration ?? duration.normal,
    easing: config?.easing ?? easing.smooth,
    delay: config?.delay ?? 0,
    useNativeDriver: config?.useNativeDriver ?? true,
  });
};

/**
 * Spring Animation Helper
 */
export const createSpringAnimation = (
  value: Animated.Value,
  toValue: number,
  config?: {
    tension?: number;
    friction?: number;
    delay?: number;
    useNativeDriver?: boolean;
  }
): Animated.CompositeAnimation => {
  return Animated.spring(value, {
    toValue,
    tension: config?.tension ?? 40,
    friction: config?.friction ?? 7,
    delay: config?.delay ?? 0,
    useNativeDriver: config?.useNativeDriver ?? true,
  });
};

/**
 * Sequence Animation Helper
 */
export const createSequence = (
  animations: Animated.CompositeAnimation[]
): Animated.CompositeAnimation => {
  return Animated.sequence(animations);
};

/**
 * Parallel Animation Helper
 */
export const createParallel = (
  animations: Animated.CompositeAnimation[]
): Animated.CompositeAnimation => {
  return Animated.parallel(animations);
};

/**
 * Stagger Animation Helper
 */
export const createStagger = (
  delay: number,
  animations: Animated.CompositeAnimation[]
): Animated.CompositeAnimation => {
  return Animated.stagger(delay, animations);
};

/**
 * Loop Animation Helper
 */
export const createLoop = (
  animation: Animated.CompositeAnimation,
  iterations = -1
): Animated.CompositeAnimation => {
  return Animated.loop(animation, { iterations });
};

/**
 * Interpolation Helpers
 */
export const interpolations = {
  // Fade interpolation
  fade: (animatedValue: Animated.Value) => ({
    opacity: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  }),
  
  // Scale interpolation
  scale: (animatedValue: Animated.Value, from = 0.8, to = 1) => ({
    transform: [{
      scale: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [from, to],
      }),
    }],
  }),
  
  // Slide from bottom
  slideFromBottom: (animatedValue: Animated.Value, distance = 100) => ({
    transform: [{
      translateY: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [distance, 0],
      }),
    }],
  }),
  
  // Slide from right
  slideFromRight: (animatedValue: Animated.Value, distance = 100) => ({
    transform: [{
      translateX: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [distance, 0],
      }),
    }],
  }),
  
  // Slide from left
  slideFromLeft: (animatedValue: Animated.Value, distance = 100) => ({
    transform: [{
      translateX: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-distance, 0],
      }),
    }],
  }),
  
  // Rotate
  rotate: (animatedValue: Animated.Value) => ({
    transform: [{
      rotate: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
      }),
    }],
  }),
};

/**
 * Gesture Response Values
 * Touch feedback için değerler
 */
export const touchResponse = {
  scalePress: 0.95,      // Press'de scale değeri
  opacityPress: 0.6,     // Press'de opacity değeri
  duration: duration.fast,
} as const;

export default {
  duration,
  easing,
  presets,
  interpolations,
  touchResponse,
  createTimingAnimation,
  createSpringAnimation,
  createSequence,
  createParallel,
  createStagger,
  createLoop,
};
