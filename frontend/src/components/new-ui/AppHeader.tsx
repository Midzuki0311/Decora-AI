import React, { useState, useRef } from 'react';
import { Pressable, StyleSheet, Text, View, Image, Platform, StatusBar, Modal, TouchableOpacity, Alert, TextInput, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useUI } from './designSystem';
import { useLanguageStore, LANGUAGE_FLAGS, LANGUAGE_NAMES, Language } from '../../store/languageStore';

type AppHeaderProps = {
  title?: string;
  showSearch?: boolean;
  showBack?: boolean;
};

const ADMIN_PASSWORD = 'admin2024';
const LANGUAGES: Language[] = ['uz', 'ru', 'en', 'jp'];

export function AppHeader({ title, showSearch = false, showBack = false }: AppHeaderProps) {
  const router = useRouter();
  const { colors, isDark } = useUI();
  const { t, lang, setLanguage } = useLanguageStore();
  const [menuVisible, setMenuVisible] = useState(false);
  const [langVisible, setLangVisible] = useState(false);
  const [adminPromptVisible, setAdminPromptVisible] = useState(false);
  const [adminPass, setAdminPass] = useState('');

  const displayTitle = title || 'Decora AI';

  const MENU_ITEMS = [
    { label: t.home, icon: 'home-outline' as const, path: '/' },
    { label: t.createDesign, icon: 'sparkles-outline' as const, path: '/upload' },
    { label: t.gallery, icon: 'images-outline' as const, path: '/history' },
    { label: t.settings, icon: 'settings-outline' as const, path: '/settings' },
  ];

  const handleBack = () => {
    try {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/' as any);
      }
    } catch {
      router.replace('/' as any);
    }
  };

  const openCamera = async () => {
    setMenuVisible(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to take photos.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.9,
    });
    if (!result.canceled && result.assets[0]) {
      router.push({ pathname: '/upload', params: { photo: result.assets[0].uri } } as any);
    }
  };

  const handleAdminAccess = () => {
    if (adminPass === ADMIN_PASSWORD) {
      setAdminPromptVisible(false);
      setAdminPass('');
      router.push('/admin' as any);
    } else {
      Alert.alert('Error', 'Wrong password');
    }
  };

  return (
    <>
      <View style={[styles.header, { backgroundColor: isDark ? 'rgba(14,17,23,0.95)' : 'rgba(248,249,250,0.95)' }]}>
        <View style={styles.left}>
          {showBack ? (
            <Pressable style={[styles.iconBtn, { backgroundColor: colors.surfaceSoft }]} onPress={handleBack}>
              <Ionicons name="arrow-back" size={20} color={colors.text} />
            </Pressable>
          ) : (
            <Pressable style={[styles.iconBtn, { backgroundColor: colors.surfaceSoft }]} onPress={() => setMenuVisible(true)}>
              <Ionicons name="menu" size={20} color={colors.text} />
            </Pressable>
          )}
          <Text style={[styles.logo, { color: colors.text }]}>{displayTitle}</Text>
        </View>

        <View style={styles.right}>
          {showSearch && (
            <Pressable style={[styles.iconBtnSm, { backgroundColor: colors.surfaceSoft }]}>
              <Ionicons name="search" size={18} color={colors.text} />
            </Pressable>
          )}
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?img=32' }}
            style={styles.avatar}
          />
        </View>
      </View>

      {/* Main Menu */}
      <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <TouchableOpacity style={[styles.modalOverlay, { backgroundColor: colors.overlay }]} activeOpacity={1} onPress={() => setMenuVisible(false)}>
          <View style={[styles.menuContainer, { backgroundColor: colors.surface }]}>
            <View style={styles.menuHeader}>
              <Text style={[styles.menuTitle, { color: colors.text }]}>{t.menu}</Text>
              <Pressable onPress={() => setMenuVisible(false)}>
                <Ionicons name="close" size={22} color={colors.text} />
              </Pressable>
            </View>
            {MENU_ITEMS.map((item) => (
              <Pressable key={item.label} style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push(item.path as any); }}>
                <Ionicons name={item.icon} size={20} color={colors.primary} />
                <Text style={[styles.menuItemText, { color: colors.text }]}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.muted} />
              </Pressable>
            ))}
            <Pressable style={styles.menuItem} onPress={openCamera}>
              <Ionicons name="camera-outline" size={20} color={colors.primary} />
              <Text style={[styles.menuItemText, { color: colors.text }]}>{t.takePhoto}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.muted} />
            </Pressable>
            <Pressable style={[styles.menuItemAdmin, { borderTopColor: colors.border }]} onPress={() => { setMenuVisible(false); setLangVisible(true); }}>
              <Text style={styles.flagText}>{LANGUAGE_FLAGS[lang]}</Text>
              <Text style={[styles.menuItemText, { color: colors.text }]}>{t.language || 'Language'}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.muted} />
            </Pressable>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Language Picker */}
      <Modal visible={langVisible} transparent animationType="fade" onRequestClose={() => setLangVisible(false)}>
        <TouchableOpacity style={[styles.modalOverlay, { backgroundColor: colors.overlay }]} activeOpacity={1} onPress={() => setLangVisible(false)}>
          <View style={[styles.langContainer, { backgroundColor: colors.surface }]}>
            <Text style={[styles.langTitle, { color: colors.text }]}>{t.language}</Text>
            {LANGUAGES.map((l) => {
              const isActive = lang === l;
              return (
                <Pressable
                  key={l}
                  style={[styles.langItem, isActive && { backgroundColor: isDark ? 'rgba(108,92,231,0.15)' : 'rgba(53,37,205,0.08)' }]}
                  onPress={() => { setLanguage(l); setLangVisible(false); }}
                >
                  <Text style={styles.langFlag}>{LANGUAGE_FLAGS[l]}</Text>
                  <Text style={[styles.langName, { color: colors.text }]}>{LANGUAGE_NAMES[l]}</Text>
                  {isActive && <Ionicons name="checkmark-circle" size={22} color={colors.primary} />}
                </Pressable>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Admin Password Prompt */}
      <Modal visible={adminPromptVisible} transparent animationType="fade" onRequestClose={() => setAdminPromptVisible(false)}>
        <TouchableOpacity style={[styles.modalOverlay, { backgroundColor: colors.overlay }]} activeOpacity={1} onPress={() => setAdminPromptVisible(false)}>
          <View style={[styles.adminPrompt, { backgroundColor: colors.surface }]}>
            <Text style={[styles.adminPromptTitle, { color: colors.text }]}>Admin Access</Text>
            <Text style={[styles.adminPromptSub, { color: colors.muted }]}>Enter admin password to continue</Text>
            <TextInput
              style={[styles.adminInput, { backgroundColor: colors.inputBg, color: colors.text }]}
              placeholder="Password"
              placeholderTextColor={colors.muted}
              secureTextEntry
              value={adminPass}
              onChangeText={setAdminPass}
              autoFocus
            />
            <View style={styles.adminBtns}>
              <Pressable style={[styles.adminCancelBtn, { backgroundColor: colors.surfaceSoft }]} onPress={() => { setAdminPromptVisible(false); setAdminPass(''); }}>
                <Text style={[styles.adminCancelText, { color: colors.text }]}>{t.cancel}</Text>
              </Pressable>
              <Pressable style={[styles.adminConfirmBtn, { backgroundColor: colors.primary }]} onPress={handleAdminAccess}>
                <Text style={styles.adminConfirmText}>{t.confirm}</Text>
              </Pressable>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 50;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: STATUSBAR_HEIGHT + 8,
    paddingBottom: 12,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  iconBtnSm: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  langBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  flagText: { fontSize: 20 },
  logo: { fontSize: 20, fontWeight: '800', letterSpacing: -0.4 },
  avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: 'rgba(255,255,255,0.8)' },
  modalOverlay: { flex: 1, justifyContent: 'flex-start' },
  menuContainer: {
    marginTop: STATUSBAR_HEIGHT + 10,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  menuHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  menuTitle: { fontSize: 18, fontWeight: '800' },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 14 },
  menuItemText: { flex: 1, fontSize: 16, fontWeight: '600' },
  menuItemAdmin: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    marginTop: 4,
  },
  menuItemAdminText: { fontSize: 13, fontWeight: '600' },
  // Language picker
  langContainer: {
    marginTop: STATUSBAR_HEIGHT + 10,
    marginHorizontal: 40,
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  langTitle: { fontSize: 16, fontWeight: '800', textAlign: 'center', paddingVertical: 12 },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
  },
  langFlag: { fontSize: 28 },
  langName: { flex: 1, fontSize: 16, fontWeight: '600' },
  // Admin prompt
  adminPrompt: {
    marginTop: STATUSBAR_HEIGHT + 80,
    marginHorizontal: 30,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  adminPromptTitle: { fontSize: 20, fontWeight: '800', textAlign: 'center' },
  adminPromptSub: { fontSize: 13, textAlign: 'center', marginTop: 6, marginBottom: 16 },
  adminInput: {
    height: 50,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  adminBtns: { flexDirection: 'row', gap: 12, marginTop: 16 },
  adminCancelBtn: { flex: 1, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  adminCancelText: { fontSize: 15, fontWeight: '700' },
  adminConfirmBtn: { flex: 1, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  adminConfirmText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
