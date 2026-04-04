import React, { useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface Props {
  beforeImage: string | ImageSourcePropType;
  afterImage: string | ImageSourcePropType;
  height?: number;
}

const HANDLE_SIZE = 52;
const LINE_WIDTH = 2;
const EDGE_PADDING = 18;

const toSource = (src: string | ImageSourcePropType): ImageSourcePropType =>
  typeof src === 'string' ? { uri: src } : src;

const clamp = (v: number, min: number, max: number) => {
  'worklet';
  return Math.max(min, Math.min(max, v));
};

export function BeforeAfterSlider({ beforeImage, afterImage, height = 360 }: Props) {
  const [containerWidth, setContainerWidth] = useState(0);
  const containerWidthVal = useSharedValue(0);
  const sliderX = useSharedValue(0);

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0 && containerWidth === 0) {
      containerWidthVal.value = w;
      setContainerWidth(w);
      sliderX.value = withTiming(w / 2, { duration: 300 });
    }
  };

  const panGesture = Gesture.Pan()
    .onBegin((e) => {
      'worklet';
      if (containerWidthVal.value === 0) return;
      const max = containerWidthVal.value - EDGE_PADDING;
      sliderX.value = clamp(e.x, EDGE_PADDING, max);
    })
    .onChange((e) => {
      'worklet';
      if (containerWidthVal.value === 0) return;
      const max = containerWidthVal.value - EDGE_PADDING;
      sliderX.value = clamp(e.x, EDGE_PADDING, max);
    });

  // Since we want Left to be Before, we put After image behind. Before image is clipped on top.
  const beforeClipStyle = useAnimatedStyle(() => ({
    width: sliderX.value,
  }));

  const lineStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: sliderX.value - LINE_WIDTH / 2 }],
  }));

  const handleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: sliderX.value - HANDLE_SIZE / 2 }],
  }));

  const beforeSource = toSource(beforeImage);
  const afterSource = toSource(afterImage);

  return (
    <View style={styles.root}>
      <GestureDetector gesture={panGesture}>
        <View style={[styles.wrap, { height }]} onLayout={onLayout}>
          
          {/* AFTER IMAGE (Behind) - visible on the right */}
          <Image source={afterSource} style={[styles.image, { height }]} resizeMode="cover" />

          {/* BEFORE IMAGE (Clipped on top) - visible on the left strictly inside the clip */}
          {containerWidth > 0 && (
            <Animated.View style={[styles.afterClip, { height }, beforeClipStyle]}>
              <Image 
                source={beforeSource} 
                style={[styles.image, { height }]} 
                resizeMode="cover" 
              />
            </Animated.View>
          )}

          {/* SLIDER LINE & HANDLE */}
          <Animated.View style={[styles.line, { height, left: 0 }, lineStyle]} pointerEvents="none" />
          <Animated.View style={[styles.handle, { top: height / 2 - HANDLE_SIZE / 2, left: 0 }, handleStyle]} pointerEvents="none">
            <Ionicons name="chevron-back" size={14} color="#3525CD" />
            <View style={styles.divider} />
            <Ionicons name="chevron-forward" size={14} color="#3525CD" />
          </Animated.View>

          <View style={styles.badgeLeft} pointerEvents="none"><Text style={styles.badgeText}>Before</Text></View>
          <View style={styles.badgeRight} pointerEvents="none"><Text style={styles.badgeText}>After</Text></View>
        </View>
      </GestureDetector>

      <View style={styles.gallery}>
        <View style={styles.cardFull}>
          <Text style={styles.cardTitle}>After</Text>
          <Image source={afterSource} style={styles.cardImageWide} resizeMode="cover" />
        </View>

        <View style={styles.row}>
          <View style={styles.cardHalf}>
            <Text style={styles.cardTitle}>Before</Text>
            <Image source={beforeSource} style={styles.cardImageTall} resizeMode="cover" />
          </View>
          <View style={styles.cardHalf}>
            <Text style={styles.cardTitle}>After</Text>
            <Image source={afterSource} style={styles.cardImageTall} resizeMode="cover" />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 14,
  },
  wrap: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 6,
  },
  image: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  afterClip: {
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
  },
  line: {
    position: 'absolute',
    width: LINE_WIDTH,
    backgroundColor: '#fff',
  },
  handle: {
    position: 'absolute',
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    borderRadius: HANDLE_SIZE / 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 5,
  },
  divider: {
    width: 1,
    height: 14,
    backgroundColor: 'rgba(53,37,205,0.35)',
    marginHorizontal: 1,
  },
  badgeLeft: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeRight: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  gallery: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  cardFull: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  cardHalf: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#474554',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  cardImageWide: {
    width: '100%',
    height: 180,
    borderRadius: 14,
    backgroundColor: '#ececf1',
  },
  cardImageTall: {
    width: '100%',
    height: 128,
    borderRadius: 14,
    backgroundColor: '#ececf1',
  },
});
