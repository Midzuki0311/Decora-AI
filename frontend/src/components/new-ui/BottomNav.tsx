import React, { useCallback, useEffect } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  interpolateColor,
  interpolate,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { useUI } from './designSystem';
import { useScrollStore } from '../../store/scrollStore';

type Tab = 'home' | 'create' | 'gallery' | 'profile';

const TABS: Array<{
  key: Tab;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
  path: '/' | '/upload' | '/history' | '/settings';
}> = [
  { key: 'home', icon: 'home-outline', activeIcon: 'home', path: '/' },
  { key: 'create', icon: 'sparkles-outline', activeIcon: 'sparkles', path: '/upload' },
  { key: 'gallery', icon: 'image-outline', activeIcon: 'image', path: '/history' },
  { key: 'profile', icon: 'person-outline', activeIcon: 'person', path: '/settings' },
];

function NavItem({ tab, isActive, onPress, isDark }: {
  tab: typeof TABS[0]; isActive: boolean; onPress: () => void; isDark: boolean;
}) {
  const scale = useSharedValue(1);
  const active = useSharedValue(isActive ? 1 : 0);
  const indicatorScale = useSharedValue(isActive ? 1 : 0);

  React.useEffect(() => {
    active.value = withTiming(isActive ? 1 : 0, {
      duration: 250,
      easing: Easing.out(Easing.cubic),
    });
    indicatorScale.value = withSpring(isActive ? 1 : 0, {
      damping: 14,
      stiffness: 280,
    });
  }, [isActive]);

  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.82, {
      duration: 70,
      easing: Easing.out(Easing.cubic),
    });
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, {
      damping: 12,
      stiffness: 400,
      mass: 0.3,
    });
  }, []);

  // Liquid glass colors
  const activeBg = isDark 
    ? 'rgba(108, 92, 231, 0.85)' 
    : 'rgba(53, 37, 205, 0.9)';

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: interpolateColor(
      active.value,
      [0, 1],
      ['transparent', activeBg],
    ),
    shadowOpacity: interpolate(active.value, [0, 1], [0, 0.4]),
    shadowRadius: interpolate(active.value, [0, 1], [0, 12]),
    elevation: interpolate(active.value, [0, 1], [0, 8]),
  }));

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ scale: indicatorScale.value }],
    opacity: interpolate(indicatorScale.value, [0, 1], [0, 1]),
  }));

  const iconColor = isActive ? '#FFFFFF' : (isDark ? '#555872' : '#9CA3AF');

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.item, animatedStyle, {
        shadowColor: isDark ? '#6C5CE7' : '#3525CD',
        shadowOffset: { width: 0, height: 4 },
      }]}>
        <Ionicons
          name={isActive ? tab.activeIcon : tab.icon}
          size={22}
          color={iconColor}
        />
        {/* Subtle glow indicator dot */}
        {isActive && (
          <Animated.View style={[styles.activeIndicator, indicatorStyle, {
            backgroundColor: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.6)',
          }]} />
        )}
      </Animated.View>
    </Pressable>
  );
}

export function BottomNav({ active }: { active: Tab | 'result' }) {
  const router = useRouter();
  const pathname = usePathname();
  const { colors, isDark } = useUI();
  const { isNavVisible } = useScrollStore();
  const translateY = useSharedValue(0);
  const backdropOpacity = useSharedValue(1);

  useEffect(() => {
    translateY.value = withSpring(isNavVisible ? 0 : 140, {
      damping: 20,
      stiffness: 200,
      mass: 0.8,
    });
    backdropOpacity.value = withTiming(isNavVisible ? 1 : 0, {
      duration: 250,
    });
  }, [isNavVisible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: backdropOpacity.value,
  }));

  const handleNav = useCallback((path: string) => {
    if (pathname === path) return;
    router.replace(path as any);
  }, [pathname, router]);

  return (
    <Animated.View style={[styles.outer, animatedStyle]}>
      {/* Liquid glass container */}
      <BlurView
        intensity={isDark ? 70 : 60}
        tint={isDark ? 'dark' : 'light'}
        style={styles.blurContainer}
      >
        {/* Extra glass overlay */}
        <View style={[styles.glassOverlay, {
          backgroundColor: isDark
            ? 'rgba(20, 22, 34, 0.35)'
            : 'rgba(255, 255, 255, 0.35)',
          borderColor: isDark
            ? 'rgba(255,255,255,0.08)'
            : 'rgba(255,255,255,0.7)',
        }]}>
          {/* Inner shimmer highlight */}
          <View style={[styles.shimmerLine, {
            backgroundColor: isDark
              ? 'rgba(255,255,255,0.06)'
              : 'rgba(255,255,255,0.5)',
          }]} />

          <View style={styles.navContent}>
            {TABS.map((tab) => {
              const isActive = active === tab.key || (active === 'result' && tab.key === 'create');
              return (
                <NavItem
                  key={tab.key}
                  tab={tab}
                  isActive={isActive}
                  isDark={isDark}
                  onPress={() => handleNav(tab.path)}
                />
              );
            })}
          </View>
        </View>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  outer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    paddingHorizontal: 40,
  },
  blurContainer: {
    width: '100%',
    borderRadius: 999,
    overflow: 'hidden',
  },
  glassOverlay: {
    width: '100%',
    borderRadius: 999,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 16,
  },
  shimmerLine: {
    position: 'absolute',
    top: 0,
    left: '10%',
    right: '10%',
    height: 1,
    borderRadius: 1,
  },
  navContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  item: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 6,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
