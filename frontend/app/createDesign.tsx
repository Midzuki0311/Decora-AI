import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useUI } from '../src/components/new-ui/designSystem';
import { useLanguageStore } from '../src/store/languageStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedPressable } from '../src/components/new-ui/AnimatedPressable';
import { ScreenWrapper } from '../src/components/new-ui/ScreenWrapper';
import { AppHeader } from '../src/components/new-ui/AppHeader';

const SCREEN_WIDTH = require('react-native').Dimensions.get('window').width;

export default function CreateDesignScreen() {
  const router = useRouter();
  const { colors, isDark } = useUI();
  const { t } = useLanguageStore();
  const insets = useSafeAreaInsets();
  const [selectedMode, setSelectedMode] = useState<'design' | 'chat' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const takePhoto = async (mode: 'design' | 'chat') => {
    try {
      setIsLoading(true);
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        setIsLoading(false);
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 5],
        quality: 0.92,
      });

      if (!result.canceled && result.assets[0]) {
        if (mode === 'design') {
          // Go to design upload screen
          router.push({
            pathname: '/upload',
            params: { photo: result.assets[0].uri, mode: 'design' },
          });
        } else {
          // Go to AI chat screen
          router.push({
            pathname: '/aiChat',
            params: { photo: result.assets[0].uri },
          });
        }
      }
    } catch (error) {
      console.error('Camera error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const pickFromLibrary = async (mode: 'design' | 'chat') => {
    try {
      setIsLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 5],
        quality: 0.9,
      });

      if (!result.canceled && result.assets[0]) {
        if (mode === 'design') {
          // Go to design upload screen
          router.push({
            pathname: '/upload',
            params: { photo: result.assets[0].uri, mode: 'design' },
          });
        } else {
          // Go to AI chat screen
          router.push({
            pathname: '/aiChat',
            params: { photo: result.assets[0].uri },
          });
        }
      }
    } catch (error) {
      console.error('Gallery error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} translucent backgroundColor="transparent" />

      <ScreenWrapper>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Step 1: Select Mode */}
          <Animated.View entering={FadeInDown.duration(400)}>
            <AppHeader title={t.createDesign || 'Create Design'} showBack />
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500)} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {selectedMode ? '📸 Choose Image Source' : '🎯 Select Mode'}
            </Text>

            {!selectedMode ? (
              // Mode Selection
              <View style={styles.modeGrid}>
                <Animated.View entering={FadeInDown.duration(600)}>
                  <AnimatedPressable
                    onPress={() => setSelectedMode('design')}
                    style={[styles.modeCard, { backgroundColor: colors.surface, borderColor: colors.primary }]}
                    pressScale={0.95}
                  >
                    <View style={[styles.modeIcon, { backgroundColor: '#3B82F6' }]}>
                      <Ionicons name="sparkles" size={32} color="#fff" />
                    </View>
                    <Text style={[styles.modeName, { color: colors.text }]}>AI Design Generator</Text>
                    <Text style={[styles.modeDescription, { color: colors.muted }]}>
                      Transform your space with AI-powered designs
                    </Text>
                    <View style={styles.modeFeatures}>
                      <Text style={[styles.featureText, { color: colors.muted }]}>✓ 5 style variations</Text>
                      <Text style={[styles.featureText, { color: colors.muted }]}>✓ Full 4K rendering</Text>
                      <Text style={[styles.featureText, { color: colors.muted }]}>✓ Material matching</Text>
                    </View>
                  </AnimatedPressable>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(700)}>
                  <AnimatedPressable
                    onPress={() => setSelectedMode('chat')}
                    style={[styles.modeCard, { backgroundColor: colors.surface, borderColor: colors.primary }]}
                    pressScale={0.95}
                  >
                    <View style={[styles.modeIcon, { backgroundColor: '#8B5CF6' }]}>
                      <MaterialCommunityIcons name="chat-outline" size={32} color="#fff" />
                    </View>
                    <Text style={[styles.modeName, { color: colors.text }]}>AI Chat & Prompts</Text>
                    <Text style={[styles.modeDescription, { color: colors.muted }]}>
                      Chat with AI and create custom prompts
                    </Text>
                    <View style={styles.modeFeatures}>
                      <Text style={[styles.featureText, { color: colors.muted }]}>✓ Real-time chat</Text>
                      <Text style={[styles.featureText, { color: colors.muted }]}>✓ Custom prompts</Text>
                      <Text style={[styles.featureText, { color: colors.muted }]}>✓ Save favorites</Text>
                    </View>
                  </AnimatedPressable>
                </Animated.View>
              </View>
            ) : (
              // Image Source Selection
              <>
                <View style={styles.imageSourceGrid}>
                  <Animated.View entering={FadeInDown.duration(600)}>
                    <AnimatedPressable
                      onPress={() => takePhoto(selectedMode)}
                      disabled={isLoading}
                      style={[
                        styles.imageSourceCard,
                        { backgroundColor: colors.primary, opacity: isLoading ? 0.6 : 1 },
                      ]}
                      pressScale={0.93}
                    >
                      <Ionicons name="camera" size={40} color="#fff" />
                      <Text style={[styles.imageSourceTitle, { color: '#fff' }]}>Take Photo</Text>
                      <Text style={[styles.imageSourceSub, { color: 'rgba(255,255,255,0.8)' }]}>
                        Use device camera
                      </Text>
                    </AnimatedPressable>
                  </Animated.View>

                  <Animated.View entering={FadeInDown.duration(700)}>
                    <AnimatedPressable
                      onPress={() => pickFromLibrary(selectedMode)}
                      disabled={isLoading}
                      style={[
                        styles.imageSourceCard,
                        { borderColor: colors.primary, borderWidth: 2, opacity: isLoading ? 0.6 : 1 },
                      ]}
                      pressScale={0.93}
                    >
                      <Ionicons name="image" size={40} color={colors.primary} />
                      <Text style={[styles.imageSourceTitle, { color: colors.text }]}>Choose from Library</Text>
                      <Text style={[styles.imageSourceSub, { color: colors.muted }]}>
                        Select existing photo
                      </Text>
                    </AnimatedPressable>
                  </Animated.View>
                </View>

                <AnimatedPressable
                  onPress={() => setSelectedMode(null)}
                  style={[styles.backButton, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}
                  pressScale={0.96}
                >
                  <Ionicons name="arrow-back" size={18} color={colors.text} />
                  <Text style={[styles.backButtonText, { color: colors.text }]}>Back to Mode Selection</Text>
                </AnimatedPressable>
              </>
            )}
          </Animated.View>

          {/* Help Section */}
          {!selectedMode && (
            <Animated.View entering={FadeInDown.duration(800)} style={styles.helpSection}>
              <Text style={[styles.helpTitle, { color: colors.text }]}>💡 Which mode should I choose?</Text>
              <View style={styles.helpItem}>
                <Text style={[styles.helpLabel, { color: colors.text }]}>Design Generator:</Text>
                <Text style={[styles.helpText, { color: colors.muted }]}>
                  Quick automated transformations with multiple style options. Best for instant ideas.
                </Text>
              </View>
              <View style={styles.helpItem}>
                <Text style={[styles.helpLabel, { color: colors.text }]}>AI Chat:</Text>
                <Text style={[styles.helpText, { color: colors.muted }]}>
                  Interactive chat for detailed design discussions and custom prompt creation.
                </Text>
              </View>
            </Animated.View>
          )}
        </ScrollView>
      </ScreenWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 40, gap: 24 },

  section: { gap: 16 },
  sectionTitle: { fontSize: 22, fontWeight: '800', marginBottom: 8 },

  // Mode Selection
  modeGrid: { gap: 16 },
  modeCard: {
    borderRadius: 24,
    padding: 20,
    gap: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  modeIcon: { width: 70, height: 70, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  modeName: { fontSize: 18, fontWeight: '800' },
  modeDescription: { fontSize: 13, textAlign: 'center', minHeight: 32 },
  modeFeatures: { width: '100%', gap: 6, marginTop: 8 },
  featureText: { fontSize: 12, fontWeight: '600' },

  // Image Source Selection
  imageSourceGrid: { gap: 12 },
  imageSourceCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    minHeight: 160,
  },
  imageSourceTitle: { fontSize: 16, fontWeight: '800' },
  imageSourceSub: { fontSize: 12, textAlign: 'center' },

  backButton: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
  },
  backButtonText: { fontSize: 14, fontWeight: '700' },

  // Help Section
  helpSection: { gap: 12 },
  helpTitle: { fontSize: 16, fontWeight: '800' },
  helpItem: { gap: 4 },
  helpLabel: { fontSize: 14, fontWeight: '700' },
  helpText: { fontSize: 12, lineHeight: 18 },
});
