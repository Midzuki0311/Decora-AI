import React, { useEffect } from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Entry animation duration (default 280ms) */
  duration?: number;
  /** Delay before animation starts (default 0) */
  delay?: number;
}

/**
 * Wraps a screen with smooth fade + scale entry animation.
 * Use this as the root wrapper for every screen content.
 *
 * Entry: opacity 0→1, scale 0.98→1.0 (280ms ease-out)
 */
export function ScreenWrapper({
  children,
  style,
  duration = 280,
  delay = 0,
}: ScreenWrapperProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      progress.value = withTiming(1, {
        duration,
        easing: Easing.out(Easing.cubic),
      });
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 1]),
    transform: [
      { scale: interpolate(progress.value, [0, 1], [0.98, 1]) },
    ],
  }));

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}

interface FadeInViewProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
  /** Slide distance in pixels (default 12) */
  slideDistance?: number;
}

/**
 * Reusable fade-in + slide-up animation for individual elements.
 * Replaces old Animated.Value-based FadeIn components.
 */
export function FadeInView({
  children,
  delay = 0,
  duration = 350,
  style,
  slideDistance = 12,
}: FadeInViewProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      progress.value = withTiming(1, {
        duration,
        easing: Easing.out(Easing.cubic),
      });
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 1]),
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [slideDistance, 0]) },
    ],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}
