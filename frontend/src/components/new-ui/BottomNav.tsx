import React, { useCallback } from 'react';
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
} from 'react-native-reanimated';
import { Pressable } from 'react-native';
import { useUI } from './designSystem';

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

  // Update active animation when state changes
  React.useEffect(() => {
    active.value = withTiming(isActive ? 1 : 0, {
      duration: 200,
      easing: Easing.out(Easing.cubic),
    });
  }, [isActive]);

  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.88, {
      duration: 80,
      easing: Easing.out(Easing.cubic),
    });
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 350,
      mass: 0.4,
    });
  }, []);

  const activeBg = isDark ? '#6C5CE7' : '#3525CD';

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: interpolateColor(
      active.value,
      [0, 1],
      ['transparent', activeBg],
    ),
  }));

  const iconColor = isActive ? '#FFFFFF' : (isDark ? '#6B7280' : '#9CA3AF');

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.item, animatedStyle]}>
        <Ionicons
          name={isActive ? tab.activeIcon : tab.icon}
          size={24}
          color={iconColor}
        />
      </Animated.View>
    </Pressable>
  );
}

export function BottomNav({ active }: { active: Tab | 'result' }) {
  const router = useRouter();
  const pathname = usePathname();
  const { colors, isDark } = useUI();

  const handleNav = useCallback((path: string) => {
    if (pathname === path) return;
    // Use replace for tab screens — no screen stacking, no back pile-up
    router.replace(path as any);
  }, [pathname, router]);

  return (
    <View style={styles.outer}>
      <View style={[styles.wrap, {
        backgroundColor: isDark ? 'rgba(26,29,39,0.95)' : 'rgba(255,255,255,0.95)',
        shadowColor: isDark ? '#000' : '#3525CD',
      }]}>
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
  );
}

const styles = StyleSheet.create({
  outer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    paddingHorizontal: 60,
  },
  wrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  item: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
});
