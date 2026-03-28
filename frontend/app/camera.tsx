import React from 'react';
import { View, ScrollView, StyleSheet, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { AppHeader } from '../src/components/new-ui/AppHeader';
import { BottomNav } from '../src/components/new-ui/BottomNav';
import { useUI } from '../src/components/new-ui/designSystem';
import { useLanguageStore } from '../src/store/languageStore';
import { ScreenWrapper, FadeInView } from '../src/components/new-ui/ScreenWrapper';

export default function CameraScreen() {
  const router = useRouter();
  const { colors, isDark } = useUI();
  const { t } = useLanguageStore();

  const pickFromLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 5],
        quality: 0.9,
      });

      if (!result.canceled && result.assets[0]) {
        router.push({
          pathname: '/upload',
          params: { photo: result.assets[0].uri },
        });
      }
    } catch (error) {
      console.error('Gallery error:', error);
    }
  };

  const takePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!permission.granted) {
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 5],
        quality: 0.9,
      });

      if (!result.canceled && result.assets[0]) {
        router.push({
          pathname: '/upload',
          params: { photo: result.assets[0].uri },
        });
      }
    } catch (error) {
      console.error('Camera error:', error);
    }
  };

  return (
    <View style={[styles.safe, { backgroundColor: colors.bg }]}>
      <AppHeader title={t.uploadPhoto || 'Upload Photo'} />
      
      <ScreenWrapper>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <FadeInView delay={0}>
            {/* Animated Header */}
            <Animated.View entering={FadeInDown.duration(500)}>
              <Text style={[styles.title, { color: colors.text }]}>
                {t.selectAesthetic || 'Let\'s begin'}
              </Text>
              <Text style={[styles.subtitle, { color: colors.muted }]}>
                Choose how to upload your space
              </Text>
            </Animated.View>

            {/* Animated Cards */}
            <View style={styles.optionsContainer}>
              <Animated.View entering={FadeInUp.duration(600).delay(100)}>
                <Pressable 
                  style={[styles.optionCard, { backgroundColor: isDark ? '#2a2e3e' : '#f5f5f5', borderColor: colors.primary }]}
                  onPress={takePhoto}
                >
                  <View style={[styles.iconWrapper, { backgroundColor: colors.primary }]}>
                    <Ionicons name="camera" size={40} color="#fff" />
                  </View>
                  <Text style={[styles.optionTitle, { color: colors.text }]}>
                    {t.takePhoto || 'Take Photo'}
                  </Text>
                  <Text style={[styles.optionDesc, { color: colors.muted }]}>
                    {t.useDeviceCamera || 'Use your device camera'}
                  </Text>
                </Pressable>
              </Animated.View>

              <Animated.View entering={FadeInUp.duration(600).delay(200)}>
                <Pressable 
                  style={[styles.optionCard, { backgroundColor: isDark ? '#2a2e3e' : '#f5f5f5', borderColor: colors.primary }]}
                  onPress={pickFromLibrary}
                >
                  <View style={[styles.iconWrapper, { backgroundColor: colors.primary }]}>
                    <Ionicons name="images" size={40} color="#fff" />
                  </View>
                  <Text style={[styles.optionTitle, { color: colors.text }]}>
                    {t.gallery || 'Gallery'}
                  </Text>
                  <Text style={[styles.optionDesc, { color: colors.muted }]}>
                    {t.chooseFromGallery || 'Choose from library'}
                  </Text>
                </Pressable>
              </Animated.View>
            </View>
          </FadeInView>
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
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 32,
  },
  optionsContainer: {
    gap: 20,
  },
  optionCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  optionDesc: {
    fontSize: 14,
    textAlign: 'center',
  },
});
