import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { AppHeader } from '../src/components/new-ui/AppHeader';
import { BottomNav } from '../src/components/new-ui/BottomNav';
import { useUI } from '../src/components/new-ui/designSystem';
import { useLanguageStore } from '../src/store/languageStore';
import { ScreenWrapper, FadeInView } from '../src/components/new-ui/ScreenWrapper';
import { demoRooms, STYLE_NAMES, getStyleImage, sourceUri } from '../src/components/new-ui/demoImages';
import { AnimatedCard, AnimatedPressable } from '../src/components/new-ui/AnimatedPressable';

export default function BrowseSamplesScreen() {
  const router = useRouter();
  const { colors, isDark } = useUI();
  const { t } = useLanguageStore();
  const [selectedRoom, setSelectedRoom] = useState(demoRooms[0].id);
  const [showVariations, setShowVariations] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<typeof STYLE_NAMES[number]>('Modern');

  const room = demoRooms.find((r) => r.id === selectedRoom) || demoRooms[0];

  const handleSelectRoom = (roomId: number) => {
    setSelectedRoom(roomId);
    setShowVariations(false);
    setSelectedStyle('Modern');
  };

  const handleUseRoom = () => {
    router.push({
      pathname: '/upload',
      params: { roomId: String(selectedRoom) },
    } as any);
  };

  return (
    <View style={[styles.safe, { backgroundColor: colors.bg }]}>
      <AppHeader title={t.browseSamples || 'Browse Samples'} showBack />

      <ScreenWrapper>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {!showVariations ? (
            <>
              {/* ROOMS GRID */}
              <FadeInView delay={0}>
                <Animated.View entering={FadeInDown.duration(500)}>
                  <Text style={[styles.title, { color: colors.text }]}>
                    {t.selectRoom || 'Select a Room'}
                  </Text>
                  <Text style={[styles.subtitle, { color: colors.muted }]}>
                    {t.chooseRoomToDesign || 'Choose a room to start designing'}
                  </Text>
                </Animated.View>

                <View style={styles.roomsGrid}>
                  {demoRooms.map((r, index) => (
                    <Animated.View 
                      key={r.id} 
                      entering={FadeInUp.duration(600).delay(100 + index * 100)}
                      style={styles.roomCardWrapper}
                    >
                      <Pressable
                        style={[
                          styles.roomCard,
                          {
                            borderColor: selectedRoom === r.id ? colors.primary : colors.border,
                            borderWidth: selectedRoom === r.id ? 3 : 1,
                            backgroundColor: colors.surface,
                          },
                        ]}
                        onPress={() => handleSelectRoom(r.id)}
                      >
                        <Image
                          source={r.before}
                          style={styles.roomImage}
                          resizeMode="cover"
                        />
                        <View style={[styles.roomNameBg, { backgroundColor: colors.primary + '90' }]}>
                          <Text style={[styles.roomName, { color: '#fff' }]}>
                            {r.title}
                          </Text>
                        </View>
                        {selectedRoom === r.id && (
                          <View style={styles.checkmark}>
                            <Ionicons name="checkmark-circle" size={28} color={colors.primary} />
                          </View>
                        )}
                      </Pressable>
                    </Animated.View>
                  ))}
                </View>
              </FadeInView>

              {/* SELECTED ROOM PREVIEW */}
              <FadeInView delay={200}>
                <View style={styles.spacer} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {t.preview || 'Preview'}
                </Text>
                <AnimatedCard
                  style={[styles.previewCard, { borderColor: colors.border }]}
                >
                  <Image
                    source={room.before}
                    style={styles.largePreview}
                    resizeMode="cover"
                  />
                  <View style={styles.previewTag}>
                    <Text style={styles.previewTagText}>{t.beforeDesign || 'Before'}</Text>
                  </View>
                </AnimatedCard>
              </FadeInView>

              {/* VIEW VARIATIONS BUTTON */}
              <FadeInView delay={280}>
                <AnimatedPressable
                  onPress={() => setShowVariations(true)}
                  style={[styles.variationButton, { backgroundColor: colors.primary }]}
                  pressScale={0.95}
                >
                  <Ionicons name="images" size={20} color="#fff" />
                  <Text style={styles.variationButtonText}>
                    {t.viewDesignVariations || 'View Design Variations'}
                  </Text>
                </AnimatedPressable>
              </FadeInView>

              {/* USE THIS ROOM BUTTON */}
              <FadeInView delay={340}>
                <AnimatedPressable
                  onPress={handleUseRoom}
                  style={[styles.useButton, { backgroundColor: colors.primary }]}
                  pressScale={0.95}
                >
                  <Text style={styles.useButtonText}>
                    {t.useThisRoom || 'Use This Room'}
                  </Text>
                </AnimatedPressable>
              </FadeInView>
            </>
          ) : (
            <>
              {/* STYLE VARIATIONS VIEWER */}
              <FadeInView delay={0}>
                <Animated.View entering={FadeInDown.duration(500)}>
                  <Text style={[styles.title, { color: colors.text }]}>
                    Design Variations
                  </Text>
                  <Text style={[styles.subtitle, { color: colors.muted }]}>
                    {room.title} - See different style options
                  </Text>
                </Animated.View>

                {/* STYLE SELECTOR */}
                <View style={styles.styleSelector}>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.styleRow}
                  >
                    {STYLE_NAMES.map((style) => {
                      const active = selectedStyle === style;
                      return (
                        <AnimatedPressable
                          key={style}
                          onPress={() => setSelectedStyle(style)}
                          style={[
                            styles.styleChip,
                            {
                              backgroundColor: active ? colors.primary : (isDark ? '#2a2e3e' : '#ececf0'),
                            },
                          ]}
                          pressScale={0.93}
                        >
                          <Text
                            style={[
                              styles.styleChipText,
                              {
                                color: active ? '#fff' : (isDark ? '#9CA3AF' : '#555'),
                              },
                            ]}
                          >
                            {style}
                          </Text>
                        </AnimatedPressable>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* BEFORE/AFTER SLIDER */}
                <View style={styles.variationContainer}>
                  <View style={[styles.halfView, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Image
                      source={room.before}
                      style={styles.variationImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.variationLabel}>{t.beforeDesign || 'Before'}</Text>
                  </View>

                  <View style={[styles.halfView, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Image
                      source={getStyleImage(room, selectedStyle)}
                      style={styles.variationImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.variationLabel}>{selectedStyle}</Text>
                  </View>
                </View>

                {/* COPY BUTTON */}
                <FadeInView delay={200}>
                  <AnimatedPressable
                    onPress={() => {
                      // Copy design prompt to clipboard
                      const designPrompt = `Design this ${room.title} in ${selectedStyle} style`;
                      alert('Design prompt: ' + designPrompt);
                    }}
                    style={[styles.copyButton, { backgroundColor: colors.surface, borderColor: colors.primary }]}
                    pressScale={0.95}
                  >
                    <Ionicons name="copy" size={18} color={colors.primary} />
                    <Text style={[styles.copyButtonText, { color: colors.primary }]}>
                      {t.copyPrompt || 'Copy Design Prompt'}
                    </Text>
                  </AnimatedPressable>
                </FadeInView>

                {/* USE VARIATION BUTTON */}
                <FadeInView delay={260}>
                  <AnimatedPressable
                    onPress={handleUseRoom}
                    style={[styles.useButton, { backgroundColor: colors.primary }]}
                    pressScale={0.95}
                  >
                    <Text style={styles.useButtonText}>
                      {t.useThisStyle || 'Use This Style'}
                    </Text>
                  </AnimatedPressable>
                </FadeInView>

                {/* BACK BUTTON */}
                <FadeInView delay={320}>
                  <AnimatedPressable
                    onPress={() => setShowVariations(false)}
                    style={[styles.backButton, { backgroundColor: isDark ? '#2a2e3e' : '#f5f5f5' }]}
                    pressScale={0.95}
                  >
                    <Ionicons name="arrow-back" size={18} color={colors.text} />
                    <Text style={[styles.backButtonText, { color: colors.text }]}>
                      {t.backToRooms || 'Back to Rooms'}
                    </Text>
                  </AnimatedPressable>
                </FadeInView>
              </FadeInView>
            </>
          )}

          <View style={{ height: 120 }} />
        </ScrollView>
      </ScreenWrapper>

      <BottomNav active="gallery" />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 24,
  },
  spacer: {
    height: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: -0.3,
  },

  // ROOMS GRID
  roomsGrid: {
    gap: 16,
  },
  roomCardWrapper: {
    width: '100%',
  },
  roomCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
  },
  roomImage: {
    width: '100%',
    height: 200,
  },
  roomNameBg: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '600',
  },
  checkmark: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 14,
  },

  // PREVIEW
  previewCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 16,
  },
  largePreview: {
    width: '100%',
    height: 300,
  },
  previewTag: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  previewTagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  // BUTTONS
  variationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  variationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  useButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  useButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
  },
  copyButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // STYLE VARIATIONS
  styleSelector: {
    marginBottom: 20,
  },
  styleRow: {
    gap: 10,
    paddingBottom: 10,
  },
  styleChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  styleChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  variationContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  halfView: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
  },
  variationImage: {
    width: '100%',
    height: 200,
  },
  variationLabel: {
    color: '#999',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 8,
    textAlign: 'center',
  },
});
