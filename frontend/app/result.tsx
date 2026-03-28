import React from 'react';
import { ScrollView, StyleSheet, Text, View, Share, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppHeader } from '../src/components/new-ui/AppHeader';
import { BottomNav } from '../src/components/new-ui/BottomNav';
import { BeforeAfterSlider } from '../src/components/new-ui/BeforeAfterSlider';
import { getRoomById, sourceUri } from '../src/components/new-ui/demoImages';
import { useUI } from '../src/components/new-ui/designSystem';
import { useLanguageStore } from '../src/store/languageStore';
import { ScreenWrapper, FadeInView } from '../src/components/new-ui/ScreenWrapper';
import { AnimatedPressable } from '../src/components/new-ui/AnimatedPressable';

export default function ResultScreen() {
  const router = useRouter();
  const { colors, isDark } = useUI();
  const { t } = useLanguageStore();
  const { room, style } = useLocalSearchParams<{ room?: string; style?: string }>();

  const roomId = Number(room || 1);
  const roomData = getRoomById(roomId);

  const handleDownload = () => {
    Alert.alert('Download', 'Image saved to your gallery!');
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: `Check out my ${style || 'AI'} room design made with Decora AI!` });
    } catch (e) {}
  };

  return (
    <View style={[styles.safe, { backgroundColor: colors.bg }]}>
      <AppHeader showBack />

      <ScreenWrapper>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <FadeInView delay={40}>
            <View style={{ gap: 8 }}>
              <Text style={[styles.title, { color: colors.text }]}>{t.yourNewSpace}</Text>
              <Text style={[styles.tag, { color: colors.muted }]}>{t.style}: {(style || 'Modern').toUpperCase()}</Text>
            </View>
          </FadeInView>

          <FadeInView delay={120}>
            <BeforeAfterSlider
              beforeImage={sourceUri(roomData.before)}
              afterImage={sourceUri(roomData.after)}
              height={360}
            />
          </FadeInView>

          <FadeInView delay={200}>
            <View style={styles.actions}>
              <AnimatedPressable style={[styles.primaryBtn, { backgroundColor: colors.primary, shadowColor: colors.primary }]} onPress={handleDownload}>
                <Text style={styles.primaryText}>{t.downloadImage}</Text>
              </AnimatedPressable>
              <View style={styles.twoBtns}>
                <AnimatedPressable style={[styles.softBtn, { backgroundColor: colors.surfaceSoft }]} onPress={() => router.push('/upload' as any)}>
                  <Text style={[styles.softText, { color: colors.text }]}>{t.regenerate}</Text>
                </AnimatedPressable>
                <AnimatedPressable style={[styles.softBtn, { backgroundColor: colors.surfaceSoft }]} onPress={handleShare}>
                  <Text style={[styles.softText, { color: colors.text }]}>{t.share}</Text>
                </AnimatedPressable>
              </View>
            </View>
          </FadeInView>

          <FadeInView delay={280}>
            <View style={[styles.cta, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.ctaTitle, { color: colors.text }]}>{t.happyWithResult}</Text>
              <Text style={[styles.ctaSub, { color: colors.muted }]}>{t.registerDescription}</Text>
              <AnimatedPressable style={[styles.ctaBtn, { backgroundColor: colors.text }]} onPress={() => router.push('/auth' as any)}>
                <Text style={[styles.ctaBtnText, { color: colors.bg }]}>{t.registerNow}</Text>
              </AnimatedPressable>
            </View>
          </FadeInView>
        </ScrollView>
      </ScreenWrapper>

      <BottomNav active="result" />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 24, paddingBottom: 140, gap: 16 },
  title: { fontSize: 32, lineHeight: 36, fontWeight: '800' },
  tag: { fontWeight: '700', letterSpacing: 1, fontSize: 12 },
  actions: { gap: 10 },
  primaryBtn: {
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryText: { color: '#fff', fontWeight: '700', fontSize: 17 },
  twoBtns: { flexDirection: 'row', gap: 10 },
  softBtn: { flex: 1, borderRadius: 14, alignItems: 'center', paddingVertical: 14 },
  softText: { fontWeight: '700' },
  cta: {
    marginTop: 8,
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
    gap: 8,
  },
  ctaTitle: { fontSize: 20, fontWeight: '800' },
  ctaSub: { lineHeight: 20 },
  ctaBtn: { marginTop: 4, borderRadius: 12, alignItems: 'center', paddingVertical: 12 },
  ctaBtnText: { fontWeight: '700' },
});
