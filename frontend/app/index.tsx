import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AppHeader } from '../src/components/new-ui/AppHeader';
import { BottomNav } from '../src/components/new-ui/BottomNav';
import { PremiumHeroSlider } from '../src/components/PremiumHeroSlider';
import { StylePreviewChips } from '../src/components/StylePreviewChips';
import { FloatingCTA } from '../src/components/FloatingCTA';
import { ScreenWrapper, FadeInView } from '../src/components/new-ui/ScreenWrapper';
import { useUI } from '../src/components/new-ui/designSystem';
import { useLanguageStore } from '../src/store/languageStore';

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useUI();
  const { t } = useLanguageStore();
  const [selectedStyle, setSelectedStyle] = useState<string>('Modern');

  const handleStartRedesign = () => {
    router.push('/camera' as any);
  };

  return (
    <View style={[styles.safe, { backgroundColor: colors.bg }]}>
      <AppHeader title="Decora AI" showSearch={false} />

      <ScreenWrapper>
        <ScrollView 
          contentContainerStyle={styles.content} 
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
        >
          {/* HERO SECTION - BEFORE/AFTER SLIDER */}
          <FadeInView delay={0}>
            <View style={styles.heroSection}>
              {/* Title */}
              <Animated.View entering={FadeInDown.duration(500)}>
                <Text style={[styles.mainTitle, { color: colors.text }]}>
                  {t.transformYourSpace}
                </Text>
              </Animated.View>

              {/* Before/After Slider */}
              <View style={[styles.sliderWrapper, { shadowColor: colors.primary }]}>
                <PremiumHeroSlider height={380} autoPlay={true} />
              </View>
            </View>
          </FadeInView>

          {/* STYLE SELECTOR */}
          <FadeInView delay={150}>
            <View style={styles.styleSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Choose Style
              </Text>
              <StylePreviewChips
                onStyleSelect={setSelectedStyle}
                selectedStyle={selectedStyle}
                isDark={colors.bg === '#000' || colors.bg === '#1a1a1a'}
                primaryColor={colors.primary}
              />
            </View>
          </FadeInView>

          {/* SPACING */}
          <View style={{ height: 140 }} />
        </ScrollView>
      </ScreenWrapper>

      {/* FLOATING CTA */}
      <FloatingCTA
        onPress={handleStartRedesign}
        primaryColor={colors.primary}
        isDark={true}
        label="✨ Start redesign"
      />

      <BottomNav active="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { 
    paddingTop: 20,
    paddingBottom: 20,
    gap: 40,
  },
  
  // HERO SECTION
  heroSection: {
    alignItems: 'center',
    gap: 28,
    paddingHorizontal: 16,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  sliderWrapper: {
    width: '100%',
    borderRadius: 28,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.22,
    shadowRadius: 28,
    elevation: 12,
  },

  // STYLE SECTION
  styleSection: {
    gap: 14,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
});
