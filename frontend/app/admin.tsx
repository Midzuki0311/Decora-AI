import React, { useRef, useEffect, useState } from 'react';
import { Alert, Animated, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { AppHeader } from '../src/components/new-ui/AppHeader';
import { demoRooms, STYLE_NAMES, sourceUri } from '../src/components/new-ui/demoImages';
import { ImageViewer } from '../src/components/new-ui/ImageViewer';
import { ui } from '../src/components/new-ui/designSystem';

function FadeIn({ delay = 0, children, style }: { delay?: number; children: React.ReactNode; style?: any }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const ty = useRef(new Animated.Value(16)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
      Animated.timing(ty, { toValue: 0, duration: 400, delay, useNativeDriver: true }),
    ]).start();
  }, []);
  return <Animated.View style={[{ opacity, transform: [{ translateY: ty }] }, style]}>{children}</Animated.View>;
}

type OverrideMap = Record<string, Record<string, string>>;

export default function AdminScreen() {
  const router = useRouter();
  const [overrides, setOverrides] = useState<OverrideMap>({});
  const [expandedRoom, setExpandedRoom] = useState<number | null>(1);
  const [viewUri, setViewUri] = useState('');

  const replaceImage = async (roomId: number, styleName: string) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.9,
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setOverrides((prev) => ({
        ...prev,
        [String(roomId)]: { ...(prev[String(roomId)] || {}), [styleName]: uri },
      }));
      Alert.alert('Done', `Image replaced for ${styleName} style in Room ${roomId}`);
    }
  };

  const deleteImage = (roomId: number, styleName: string) => {
    setOverrides((prev) => ({
      ...prev,
      [String(roomId)]: { ...(prev[String(roomId)] || {}), [styleName]: 'deleted' },
    }));
  };

  const getImageSource = (roomId: number, styleName: string, defaultSource: any) => {
    const override = overrides[String(roomId)]?.[styleName];
    if (override === 'deleted') return null;
    return override ? { uri: override } : defaultSource;
  };

  const getPreviewUri = (roomId: number, styleName: string, defaultSource: any): string => {
    const override = overrides[String(roomId)]?.[styleName];
    if (override) return override;
    return sourceUri(defaultSource);
  };

  return (
    <View style={s.safe}>
      <AppHeader title="Admin Panel" showBack />

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <FadeIn delay={20}>
          <View style={s.activityCard}>
            <Text style={s.activityHeading}>Recent Activity</Text>
            <View style={s.activityRow}>
              <View style={s.activityDot} />
              <View>
                <Text style={s.activityUser}>Alex Thompson</Text>
                <Text style={s.activityAction}>Uploaded new minimal design</Text>
                <Text style={s.activityTime}>10 minutes ago</Text>
              </View>
            </View>
            <View style={s.activityRow}>
              <View style={[s.activityDot, {backgroundColor: '#f59e0b'}]} />
              <View>
                <Text style={s.activityUser}>Sarah Connor</Text>
                <Text style={s.activityAction}>Deleted industrial room image</Text>
                <Text style={s.activityTime}>1 hour ago</Text>
              </View>
            </View>
            <View style={[s.activityRow, { borderBottomWidth: 0 }]}>
              <View style={[s.activityDot, {backgroundColor: '#10b981'}]} />
              <View>
                <Text style={s.activityUser}>Admin</Text>
                <Text style={s.activityAction}>Changed system language to EN</Text>
                <Text style={s.activityTime}>3 hours ago</Text>
              </View>
            </View>
          </View>
        </FadeIn>

        <FadeIn delay={50}>
          <Text style={s.heading}>Image Management</Text>
          <Text style={s.sub}>Tap any style image to replace it. Changes apply to all platforms.</Text>
        </FadeIn>

        {demoRooms.map((room, idx) => (
          <FadeIn key={room.id} delay={100 + idx * 80}>
            <View style={s.roomCard}>
              {/* Room Header */}
              <Pressable
                style={s.roomHeader}
                onPress={() => setExpandedRoom(expandedRoom === room.id ? null : room.id)}
              >
                <View style={s.roomHeaderLeft}>
                  <View style={s.roomBadge}>
                    <Text style={s.roomBadgeText}>{room.id}</Text>
                  </View>
                  <View>
                    <Text style={s.roomTitle}>{room.title}</Text>
                    <Text style={s.roomSubtitle}>{STYLE_NAMES.length} styles</Text>
                  </View>
                </View>
                <Ionicons
                  name={expandedRoom === room.id ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={ui.colors.muted}
                />
              </Pressable>

              {/* Original Image */}
              {expandedRoom === room.id && (
                <View style={s.roomContent}>
                  <Text style={s.styleLabel}>ORIGINAL</Text>
                  <Pressable onPress={() => setViewUri(sourceUri(room.before))}>
                    <Image source={room.before} style={s.originalImg} resizeMode="cover" />
                  </Pressable>

                  <Text style={[s.styleLabel, { marginTop: 16 }]}>STYLE IMAGES</Text>
                  <Text style={s.styleTip}>Tap image to preview, tap Replace to change</Text>

                  {STYLE_NAMES.map((styleName) => {
                    const imgSrc = getImageSource(room.id, styleName, room.styles[styleName]);
                    return (
                      <View key={styleName} style={s.styleRow}>
                        <Pressable
                          style={s.styleImgWrap}
                          onPress={() => imgSrc && setViewUri(getPreviewUri(room.id, styleName, room.styles[styleName]))}
                        >
                          {imgSrc ? (
                            <Image source={imgSrc} style={s.styleImg} resizeMode="cover" />
                          ) : (
                            <View style={[s.styleImg, { backgroundColor: '#e2e8f0', justifyContent: 'center', alignItems: 'center', padding: 8 }]}>
                              <Ionicons name="time-outline" size={24} color="#64748b" />
                              <Text style={{ fontSize: 10, color: '#64748b', textAlign: 'center', marginTop: 4 }}>Waiting for image upload</Text>
                            </View>
                          )}
                          {overrides[String(room.id)]?.[styleName] && overrides[String(room.id)]?.[styleName] !== 'deleted' && (
                            <View style={s.changedBadge}>
                              <Text style={s.changedBadgeText}>CHANGED</Text>
                            </View>
                          )}
                        </Pressable>
                        <View style={s.styleInfo}>
                          <Text style={s.styleName}>{styleName}</Text>
                          <View style={{ flexDirection: 'row', gap: 8 }}>
                            <Pressable
                              style={s.replaceBtn}
                              onPress={() => replaceImage(room.id, styleName)}
                            >
                              <Ionicons name="cloud-upload-outline" size={14} color="#fff" />
                              <Text style={s.replaceBtnText}>Upload</Text>
                            </Pressable>
                            {imgSrc && (
                              <Pressable
                                style={[s.replaceBtn, { backgroundColor: '#ef4444' }]}
                                onPress={() => deleteImage(room.id, styleName)}
                              >
                                <Ionicons name="trash-outline" size={14} color="#fff" />
                              </Pressable>
                            )}
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          </FadeIn>
        ))}

        <FadeIn delay={100 + demoRooms.length * 80 + 50}>
          <View style={s.infoCard}>
            <Ionicons name="information-circle-outline" size={20} color={ui.colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={s.infoTitle}>How It Works</Text>
              <Text style={s.infoText}>1. Expand a room by tapping its header</Text>
              <Text style={s.infoText}>2. Find the style you want to change</Text>
              <Text style={s.infoText}>3. Tap "Replace" to upload a new image</Text>
              <Text style={s.infoText}>4. Changes sync across mobile, web, and desktop</Text>
            </View>
          </View>
        </FadeIn>
      </ScrollView>

      <ImageViewer visible={!!viewUri} uri={viewUri} onClose={() => setViewUri('')} />
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: ui.colors.bg },
  scroll: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 60, gap: 16 },

  activityCard: {
    backgroundColor: ui.colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: ui.colors.border,
    padding: 16,
    marginBottom: 8,
  },
  activityHeading: { fontSize: 16, fontWeight: '700', color: ui.colors.text, marginBottom: 12 },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: ui.colors.border },
  activityDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: ui.colors.primary },
  activityUser: { fontSize: 13, fontWeight: '700', color: ui.colors.text },
  activityAction: { fontSize: 13, color: ui.colors.text, marginVertical: 2 },
  activityTime: { fontSize: 11, color: ui.colors.muted },

  heading: { fontSize: 28, fontWeight: '800', color: ui.colors.text },
  sub: { fontSize: 14, color: ui.colors.muted, marginTop: 4, lineHeight: 20 },

  roomCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: ui.colors.border,
    overflow: 'hidden',
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  roomHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  roomBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(53,37,205,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roomBadgeText: { fontSize: 14, fontWeight: '800', color: ui.colors.primary },
  roomTitle: { fontSize: 17, fontWeight: '800', color: ui.colors.text },
  roomSubtitle: { fontSize: 12, color: ui.colors.muted, marginTop: 1 },

  roomContent: { paddingHorizontal: 16, paddingBottom: 16 },

  styleLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: ui.colors.muted,
    marginBottom: 8,
  },
  styleTip: { fontSize: 12, color: '#9CA3AF', marginBottom: 12 },

  originalImg: { width: '100%', height: 180, borderRadius: 14 },

  styleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
    backgroundColor: '#fafafa',
    borderRadius: 14,
    padding: 8,
  },
  styleImgWrap: { position: 'relative' },
  styleImg: { width: 80, height: 80, borderRadius: 12 },
  changedBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: '#10b981',
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  changedBadgeText: { fontSize: 7, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },

  styleInfo: { flex: 1, gap: 8 },
  styleName: { fontSize: 15, fontWeight: '700', color: ui.colors.text },
  replaceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: ui.colors.primary,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  replaceBtnText: { color: '#fff', fontWeight: '700', fontSize: 12 },

  infoCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: 'rgba(53,37,205,0.04)',
    borderRadius: 16,
    padding: 16,
  },
  infoTitle: { fontSize: 14, fontWeight: '800', color: ui.colors.text, marginBottom: 6 },
  infoText: { fontSize: 13, color: ui.colors.muted, lineHeight: 20 },
});
