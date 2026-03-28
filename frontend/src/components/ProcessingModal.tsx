import React, { useEffect } from 'react';
import { Modal, View, StyleSheet, Dimensions, Text } from 'react-native';
import Animated, { 
  FadeIn, 
  FadeOut, 
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface ProcessingModalProps {
  visible: boolean;
  status?: 'analyzing' | 'generating' | 'uploading';
  progress?: number;
  bgColor?: string;
  primaryColor?: string;
}

export function ProcessingModal({ 
  visible, 
  status = 'analyzing',
  progress = 0,
  bgColor = '#1a1a2e',
  primaryColor = '#3525CD'
}: ProcessingModalProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1
      );
    } else {
      scale.value = 1;
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getIcon = () => {
    switch (status) {
      case 'analyzing': return 'sparkles';
      case 'generating': return 'color-palette';
      case 'uploading': return 'cloud-upload';
      default: return 'hourglass';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'analyzing': return 'Analyzing your space...';
      case 'generating': return 'Generating design...';
      case 'uploading': return 'Uploading image...';
      default: return 'Processing...';
    }
  };

  return (
    <Modal visible={visible} transparent statusBarTranslucent>
      <View style={[styles.overlay, { backgroundColor: `${bgColor}dd` }]}>
        <Animated.View 
          style={[styles.container, animatedStyle]}
          entering={visible ? FadeIn.duration(300) : FadeOut.duration(300)}
        >
          {/* Animated Background Circles */}
          <View style={styles.circlesContainer}>
            <Animated.View 
              style={[
                styles.circle, 
                styles.circle1, 
                { borderColor: primaryColor }
              ]}
            />
            <Animated.View 
              style={[
                styles.circle, 
                styles.circle2, 
                { borderColor: primaryColor }
              ]}
            />
            <Animated.View 
              style={[
                styles.circle, 
                styles.circle3, 
                { borderColor: primaryColor }
              ]}
            />
          </View>

          {/* Icon */}
          <Animated.View style={animatedStyle}>
            <Ionicons 
              name={getIcon() as any} 
              size={64} 
              color={primaryColor}
              style={styles.icon}
            />
          </Animated.View>

          {/* Status Text */}
          <Text style={[styles.statusText, { color: '#fff' }]}>
            {getStatusText()}
          </Text>

          {/* Progress Bar */}
          <View style={[styles.progressBar, { backgroundColor: `${primaryColor}30` }]}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  backgroundColor: primaryColor,
                  width: `${progress}%`,
                },
              ]}
            />
          </View>

          <Text style={[styles.progressText, { color: '#aaa' }]}>
            {Math.round(progress)}%
          </Text>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    gap: 24,
  },
  circlesContainer: {
    position: 'relative',
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 70,
  },
  circle1: {
    width: 140,
    height: 140,
    opacity: 0.3,
  },
  circle2: {
    width: 100,
    height: 100,
    opacity: 0.6,
  },
  circle3: {
    width: 60,
    height: 60,
    opacity: 0.9,
  },
  icon: {
    textAlign: 'center',
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  progressBar: {
    width: 200,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
