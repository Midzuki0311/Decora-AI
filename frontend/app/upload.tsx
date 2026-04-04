import React, { useMemo, useState, useEffect } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, View, Switch, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AppHeader } from '../src/components/new-ui/AppHeader';
import { BottomNav } from '../src/components/new-ui/BottomNav';
import { ProcessingModal } from '../src/components/ProcessingModal';
import { demoRooms, STYLE_NAMES, getStyleImage } from '../src/components/new-ui/demoImages';
import { ImageViewerLocal, ImageViewer } from '../src/components/new-ui/ImageViewer';
import { useUI } from '../src/components/new-ui/designSystem';
import { useLanguageStore } from '../src/store/languageStore';
import { ScreenWrapper, FadeInView } from '../src/components/new-ui/ScreenWrapper';
import { AnimatedPressable, AnimatedCard } from '../src/components/new-ui/AnimatedPressable';
import { useScrollStore } from '../src/store/scrollStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function UploadScreen() {
  const router = useRouter();
  const { colors, isDark } = useUI();
  const { t } = useLanguageStore();
  const { updateScroll } = useScrollStore();
  const params = useLocalSearchParams<{ photo?: string; roomId?: string }>();
  const [selectedRoom, setSelectedRoom] = useState(Number(params.roomId) || 1);
  const [selectedStyle, setSelectedStyle] = useState<typeof STYLE_NAMES[number]>('Modern');
  const [generateVariations, setGenerateVariations] = useState(true);
  const [viewSource, setViewSource] = useState<any>(null);
  const [viewUri, setViewUri] = useState('');
  const [imageName, setImageName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<'analyzing' | 'generating' | 'uploading'>('analyzing');
  const [uploadedPhoto, setUploadedPhoto] = useState(params.photo || '');

  const room = useMemo(() => demoRooms.find((r) => r.id === selectedRoom) ?? demoRooms[0], [selectedRoom]);
  const hasPhoto = !!uploadedPhoto;

  const handleClearPhoto = () => {
    setUploadedPhoto('');
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    updateScroll(scrollY);
  };

  // Auto-analyze when style changes
  useEffect(() => {
    if (selectedStyle) {
      setIsProcessing(true);
      setProcessingStatus('analyzing');
      
      // Simulate 2-3 second analysis
      const timer = setTimeout(() => {
        setIsProcessing(false);
      }, 2800);

      return () => clearTimeout(timer);
    }
  }, [selectedStyle]);

  const handleGenerate = async () => {
    setIsProcessing(true);
    setProcessingStatus('generating');
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      router.push({ 
        pathname: '/result', 
        params: { 
          room: String(selectedRoom), 
          style: selectedStyle,
          customImage: uploadedPhoto || ''
        } 
      } as any);
    }, 3500);
  };

  return (
    <View style={[styles.safe, { backgroundColor: colors.bg }]}>
      <AppHeader title={t.createDesign} showBack />

      <ScreenWrapper>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} onScroll={handleScroll} scrollEventThrottle={16}>
          <FadeInView delay={40}>
            <View style={styles.previewSection}>
              <AnimatedCard
                style={[styles.previewCard, { borderColor: colors.border, backgroundColor: colors.surface }]}
                onLongPress={() => hasPhoto ? setViewUri(uploadedPhoto!) : setViewSource(room.before)}
              >
                {hasPhoto ? (
                  <Image source={{ uri: uploadedPhoto }} style={styles.previewImage} resizeMode="cover" />
                ) : (
                  <Image source={room.before} style={styles.previewImage} resizeMode="cover" />
                )}
                <View style={styles.previewTagWrap}>
                  <Text style={styles.previewTag}>{hasPhoto ? t.yourPhoto : t.originalSpace}</Text>
                </View>
              </AnimatedCard>
              
              {hasPhoto && (
                <View style={styles.previewActions}>
                  <AnimatedPressable
                    onPress={handleClearPhoto}
                    style={[styles.clearBtn, { backgroundColor: colors.primary }]}
                    pressScale={0.92}
                  >
                    <MaterialCommunityIcons name="delete" size={18} color="#fff" />
                    <Text style={styles.clearBtnText}>{t.removeImage || 'Clear Image'}</Text>
                  </AnimatedPressable>
                  <Text style={[styles.previewHint, { color: colors.muted }]}>💡 {t.longPressToPreview || 'Long-press to preview full size'}</Text>
                </View>
              )}
            </View>
          </FadeInView>

          <FadeInView delay={120}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t.selectAesthetic}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.styleRow}>
              {STYLE_NAMES.map((style) => {
                const active = selectedStyle === style;
                return (
                  <AnimatedPressable
                    key={style}
                    onPress={() => setSelectedStyle(style)}
                    style={[styles.styleChip, { backgroundColor: isDark ? '#252836' : '#ececf0' }, active && { backgroundColor: colors.primary }]}
                    pressScale={0.93}
                    duration={80}
                  >
                    <Text style={[styles.styleChipText, { color: isDark ? '#9CA3AF' : '#555468' }, active && styles.styleChipTextActive]}>{style}</Text>
                  </AnimatedPressable>
                );
              })}
            </ScrollView>
          </FadeInView>

          <FadeInView delay={180}>
            <Text style={[styles.previewLabel, { color: colors.muted }]}>{t.stylePreview}</Text>
            <AnimatedCard onLongPress={() => setViewSource(getStyleImage(room, selectedStyle))}>
              <Image source={getStyleImage(room, selectedStyle)} style={styles.stylePreview} resizeMode="cover" />
            </AnimatedCard>
          </FadeInView>

          <FadeInView delay={200}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t.nameOptional || "Name (Optional)"}</Text>
            <TextInput
              placeholder="e.g. My Dream Kitchen"
              placeholderTextColor={colors.muted}
              value={imageName}
              onChangeText={setImageName}
              style={[styles.nameInput, { backgroundColor: colors.inputBg, color: colors.text }]}
            />
          </FadeInView>

          <FadeInView delay={220}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t.customDirectives}</Text>
            <TextInput
              multiline
              textAlignVertical="top"
              placeholder={t.addSpecificDetails}
              placeholderTextColor={colors.muted}
              style={[styles.directivesInput, { backgroundColor: colors.inputBg, color: colors.text }]}
            />
          </FadeInView>

          <FadeInView delay={260}>
            <View style={[styles.variationCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View>
                <Text style={[styles.variationTitle, { color: colors.text }]}>{t.generateVariations}</Text>
                <Text style={[styles.variationSub, { color: colors.muted }]}>{t.highResRender}</Text>
              </View>
              <Switch
                value={generateVariations}
                onValueChange={setGenerateVariations}
                trackColor={{ false: '#e0e0e0', true: colors.primary }}
                thumbColor="#fff"
              />
            </View>
          </FadeInView>

          <FadeInView delay={340}>
            <AnimatedPressable
              style={[styles.generateBtn, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
              onPress={handleGenerate}
              disabled={isProcessing}
            >
              <Text style={styles.generateBtnText}>{t.generateDesign}</Text>
            </AnimatedPressable>
          </FadeInView>
        </ScrollView>
      </ScreenWrapper>

      <BottomNav active="create" />
      <ImageViewerLocal visible={!!viewSource} source={viewSource} onClose={() => setViewSource(null)} />
      <ImageViewer visible={!!viewUri} uri={viewUri} onClose={() => setViewUri('')} />
      <ProcessingModal 
        visible={isProcessing} 
        status={processingStatus}
        bgColor={colors.bg}
        primaryColor={colors.primary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 140, gap: 16 },

  previewSection: { gap: 10 },
  previewCard: { borderRadius: 22, overflow: 'hidden', borderWidth: 1, position: 'relative' },
  previewImage: { width: '100%', height: 320 },
  previewTagWrap: { position: 'absolute', left: 14, bottom: 14 },
  previewTag: { backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, fontWeight: '700', fontSize: 12, overflow: 'hidden' },
  
  previewActions: { gap: 8 },
  clearBtn: { height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  clearBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  previewHint: { fontSize: 12, paddingHorizontal: 4, marginTop: 2 },

  sectionTitle: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
  styleRow: { gap: 10, marginBottom: 4 },
  styleChip: { borderRadius: 999, paddingHorizontal: 18, paddingVertical: 11 },
  styleChipText: { fontWeight: '700' },
  styleChipTextActive: { color: '#fff', fontWeight: '700' },

  previewLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 6 },
  stylePreview: { width: '100%', height: 200, borderRadius: 16 },

  nameInput: { height: 54, borderRadius: 20, paddingHorizontal: 16, marginBottom: 4 },
  directivesInput: { minHeight: 100, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 14 },

  variationCard: { borderRadius: 20, borderWidth: 1, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  variationTitle: { fontSize: 16, fontWeight: '800' },
  variationSub: { fontSize: 12, marginTop: 2 },

  roomLabel: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, fontWeight: '800', paddingHorizontal: 4 },
  roomRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  roomChip: { borderRadius: 999, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 9 },
  roomChipText: { fontWeight: '700' },

  generateBtn: {
    marginTop: 4, height: 62, borderRadius: 999, alignItems: 'center', justifyContent: 'center',
    shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8,
  },
  generateBtnText: { color: '#fff', fontSize: 18, fontWeight: '800' },
});
