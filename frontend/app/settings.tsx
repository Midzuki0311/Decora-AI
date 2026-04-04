import React, { useEffect, useState, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, Image, Switch, Alert, Modal, TextInput, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '../src/components/new-ui/AppHeader';
import { BottomNav } from '../src/components/new-ui/BottomNav';
import { useUI } from '../src/components/new-ui/designSystem';
import { useLanguageStore } from '../src/store/languageStore';
import { useAuthStore } from '../src/store/authStore';
import { ScreenWrapper, FadeInView } from '../src/components/new-ui/ScreenWrapper';
import { AnimatedPressable } from '../src/components/new-ui/AnimatedPressable';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';

function SettingRow({ icon, title, subtitle, onPress, trailing, colors, isLast }: {
  icon: string; title: string; subtitle?: string; onPress?: () => void;
  trailing?: React.ReactNode; colors: any; isLast?: boolean;
}) {
  return (
    <Pressable style={[s.row, !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border }]} onPress={onPress}>
      <View style={s.rowLeft}>
        <View style={[s.rowIcon, { backgroundColor: colors.primary + '15' }]}>
          <Ionicons name={icon as any} size={20} color={colors.primary} />
        </View>
        <View>
          <Text style={[s.rowTitle, { color: colors.text }]}>{title}</Text>
          {subtitle ? <Text style={[s.rowSub, { color: colors.muted }]}>{subtitle}</Text> : null}
        </View>
      </View>
      {trailing || (onPress && <Ionicons name="chevron-forward" size={18} color={colors.muted} />)}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, isDark } = useUI();
  const { t } = useLanguageStore();
  const { user } = useAuthStore();
  const [highRes, setHighRes] = useState(true);
  const [notifs, setNotifs] = useState(true);
  const used = 12, total = 20;

  const adminTapCount = useRef(0);
  const adminTapTimer = useRef<any>(null);

  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'home' | 'pro'>('home');

  const handleAdminTap = () => {
    adminTapCount.current += 1;
    if (adminTapTimer.current) clearTimeout(adminTapTimer.current);
    
    if (adminTapCount.current >= 5) {
      adminTapCount.current = 0;
      if (Platform.OS === 'ios') {
        Alert.prompt(
          'Admin Access',
          'Enter password:',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'OK', 
              onPress: (password?: string) => {
                if (password === 'admin123') {
                  router.push('/admin' as any);
                } else {
                  Alert.alert('Error', 'Incorrect password');
                }
              }
            }
          ],
          'secure-text'
        );
      } else {
        setShowAdminModal(true);
      }
    } else {
      adminTapTimer.current = setTimeout(() => {
        adminTapCount.current = 0;
      }, 2000);
    }
  };

  const handleAdminSubmit = () => {
    if (adminPassword === 'admin123') {
      setShowAdminModal(false);
      setAdminPassword('');
      router.push('/admin' as any);
    } else {
      Alert.alert('Error', 'Incorrect password');
    }
  };

  const barProgress = useSharedValue(0);
  useEffect(() => {
    barProgress.value = withTiming(used / total, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
  }, []);

  const barStyle = useAnimatedStyle(() => ({
    width: `${interpolate(barProgress.value, [0, 1], [0, 100])}%`,
  }));

  return (
    <View style={[s.safe, { backgroundColor: colors.bg }]}>
      <AppHeader title={t.profile} />

      <ScreenWrapper>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          <FadeInView delay={40}>
            <View style={s.avatarWrap}>
              <View style={[s.avatarRing, { backgroundColor: colors.primary }]}>
                {user?.avatarUrl ? (
                  <Image source={{ uri: user.avatarUrl }} style={s.avatar} />
                ) : (
                  <View style={[s.avatar, { backgroundColor: colors.primary + '30', alignItems: 'center', justifyContent: 'center' }]}>
                    <Ionicons name="person" size={38} color={colors.primary} />
                  </View>
                )}
              </View>
              {user?.username ? (
                <Text style={[s.name, { color: colors.text }]}>{user.username}</Text>
              ) : null}
              {user?.email ? (
                <Text style={[s.role, { color: colors.muted }]}>{user.email}</Text>
              ) : null}
            </View>
          </FadeInView>

          <FadeInView delay={120}>
            <View style={[s.creditCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[s.creditLbl, { color: colors.muted }]}>{t.creditBalance}</Text>
              <View style={s.creditRow}>
                <Text style={[s.creditNum, { color: colors.text }]}>{used} <Text style={[s.creditDen, { color: colors.muted }]}>/ {total} {t.credits}</Text></Text>
                <AnimatedPressable style={[s.upBtn, { backgroundColor: colors.primary }]} onPress={() => setShowPlansModal(true)}>
                  <Text style={s.upTxt}>Plans</Text>
                </AnimatedPressable>
              </View>
              <View style={[s.barBg, { backgroundColor: isDark ? '#252836' : '#f0f0f0' }]}>
                <Animated.View style={[s.barFill, { backgroundColor: colors.primary }, barStyle]} />
              </View>
              <View style={s.barLabels}>
                <Text style={[s.barLbl, { color: colors.muted }]}>{t.currentUsage}</Text>
                <Text style={[s.barLbl, { color: colors.muted }]}>{Math.round(used / total * 100)}% {t.used}</Text>
              </View>
              <View style={[s.currentPlan, { borderColor: colors.border }]}> 
                <Text style={[s.currentPlanLabel, { color: colors.muted }]}>Current Plan</Text>
                <Text style={[s.currentPlanValue, { color: colors.text }]}>
                  {selectedPlan === 'free' ? 'Free' : selectedPlan === 'home' ? 'Home' : 'Pro'}
                </Text>
              </View>
            </View>
          </FadeInView>

          <FadeInView delay={200}>
            <Text style={[s.secLbl, { color: colors.muted }]}>{t.settings.toUpperCase()}</Text>
            <View style={[s.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <SettingRow icon="person-outline" title={t.accountInfo} subtitle={t.manageProfile} colors={colors} onPress={() => router.push('/accountInfo' as any)} />
              <SettingRow icon="settings-outline" title={t.appSettings} subtitle={t.preferences} colors={colors} onPress={() => router.push('/appSettings' as any)} />
              <SettingRow icon="help-circle-outline" title={t.helpSupport} subtitle={t.faqsContact} colors={colors} onPress={() => {}} isLast />
            </View>
          </FadeInView>

          <FadeInView delay={280}>
            <Text style={[s.secLbl, { color: colors.muted }]}>{t.preferences.toUpperCase()}</Text>
            <View style={[s.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <SettingRow icon="image-outline" title={t.highResolution} colors={colors} trailing={<Switch value={highRes} onValueChange={setHighRes} trackColor={{ false: '#e0e0e0', true: colors.primary }} thumbColor="#fff" />} />
              <SettingRow icon="notifications-outline" title={t.notifications} colors={colors} trailing={<Switch value={notifs} onValueChange={setNotifs} trackColor={{ false: '#e0e0e0', true: colors.primary }} thumbColor="#fff" />} isLast />
            </View>
          </FadeInView>

          <FadeInView delay={360}>
            <AnimatedPressable style={s.signOut} onPress={() => router.replace('/auth' as any)}>
              <Text style={s.signOutTxt}>{t.signOut}</Text>
            </AnimatedPressable>
            <Pressable onPress={handleAdminTap}>
              <Text style={[s.ver, { color: colors.muted }]}>Decora AI v2.4.0</Text>
            </Pressable>
          </FadeInView>
        </ScrollView>
      </ScreenWrapper>

      <BottomNav active="profile" />
      
      <Modal visible={showAdminModal} transparent={true} animationType="fade">
        <View style={s.modalOverlay}>
          <View style={[s.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[s.modalTitle, { color: colors.text }]}>Admin Access</Text>
            <TextInput
              style={[s.modalInput, { backgroundColor: colors.bg, color: colors.text, borderColor: colors.border }]}
              value={adminPassword}
              onChangeText={setAdminPassword}
              placeholder="Enter password"
              placeholderTextColor={colors.muted}
              secureTextEntry
              autoFocus
            />
            <View style={s.modalActions}>
              <Pressable onPress={() => { setShowAdminModal(false); setAdminPassword(''); }} style={s.modalBtn}>
                <Text style={[s.modalBtnTxt, { color: colors.muted }]}>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleAdminSubmit} style={s.modalBtn}>
                <Text style={[s.modalBtnTxt, { color: colors.primary }]}>OK</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showPlansModal} transparent animationType="slide" onRequestClose={() => setShowPlansModal(false)}>
        <View style={s.modalOverlay}>
          <View style={[s.plansModalContent, { backgroundColor: colors.surface }]}> 
            <View style={s.plansHeader}>
              <Text style={[s.modalTitle, { color: colors.text }]}>Plans & Pricing</Text>
              <Pressable onPress={() => setShowPlansModal(false)}>
                <Ionicons name="close" size={22} color={colors.text} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.plansList}>
              <Pressable
                style={[s.planCard, { borderColor: selectedPlan === 'free' ? colors.primary : colors.border }]}
                onPress={() => setSelectedPlan('free')}
              >
                <View style={s.planTopRow}>
                  <Text style={[s.planName, { color: colors.text }]}>Free</Text>
                  <Text style={[s.planPrice, { color: colors.text }]}>$0/mo</Text>
                </View>
                <Text style={[s.planSub, { color: colors.muted }]}>For testing and first designs</Text>
                <Text style={[s.planPointGood, { color: '#10b981' }]}>+ 10 credits / month</Text>
                <Text style={[s.planPointGood, { color: '#10b981' }]}>+ Standard quality output</Text>
                <Text style={[s.planPointBad, { color: '#ef4444' }]}>- Watermark enabled</Text>
                <Text style={[s.planPointBad, { color: '#ef4444' }]}>- No priority queue</Text>
              </Pressable>

              <Pressable
                style={[s.planCard, { borderColor: selectedPlan === 'home' ? colors.primary : colors.border }]}
                onPress={() => setSelectedPlan('home')}
              >
                <View style={s.planTopRow}>
                  <Text style={[s.planName, { color: colors.text }]}>Home</Text>
                  <Text style={[s.planPrice, { color: colors.text }]}>$9.99/mo</Text>
                </View>
                <Text style={[s.planSub, { color: colors.muted }]}>Best for apartment and house redesign</Text>
                <Text style={[s.planPointGood, { color: '#10b981' }]}>+ 120 credits / month</Text>
                <Text style={[s.planPointGood, { color: '#10b981' }]}>+ HD renders and no watermark</Text>
                <Text style={[s.planPointGood, { color: '#10b981' }]}>+ Save and compare history</Text>
                <Text style={[s.planPointBad, { color: '#ef4444' }]}>- No team collaboration</Text>
              </Pressable>

              <Pressable
                style={[s.planCard, { borderColor: selectedPlan === 'pro' ? colors.primary : colors.border }]}
                onPress={() => setSelectedPlan('pro')}
              >
                <View style={s.planTopRow}>
                  <Text style={[s.planName, { color: colors.text }]}>Pro</Text>
                  <Text style={[s.planPrice, { color: colors.text }]}>$24.99/mo</Text>
                </View>
                <Text style={[s.planSub, { color: colors.muted }]}>For studios and power users</Text>
                <Text style={[s.planPointGood, { color: '#10b981' }]}>+ 500 credits / month</Text>
                <Text style={[s.planPointGood, { color: '#10b981' }]}>+ Ultra quality and fast queue</Text>
                <Text style={[s.planPointGood, { color: '#10b981' }]}>+ Team sharing and API access</Text>
                <Text style={[s.planPointBad, { color: '#ef4444' }]}>- Higher monthly price</Text>
              </Pressable>
            </ScrollView>

            <AnimatedPressable
              style={[s.choosePlanBtn, { backgroundColor: colors.primary }]}
              onPress={() => setShowPlansModal(false)}
            >
              <Text style={s.choosePlanTxt}>Choose {selectedPlan === 'free' ? 'Free' : selectedPlan === 'home' ? 'Home' : 'Pro'} Plan</Text>
            </AnimatedPressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 140, gap: 20 },
  avatarWrap: { alignItems: 'center', gap: 6, marginBottom: 4 },
  avatarRing: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', padding: 3 },
  avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: '#fff' },
  name: { fontSize: 24, fontWeight: '800', marginTop: 8 },
  role: { fontSize: 12, fontWeight: '700', letterSpacing: 1.5 },
  creditCard: { borderRadius: 20, borderWidth: 1, padding: 20, gap: 12 },
  creditLbl: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  creditRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  creditNum: { fontSize: 32, fontWeight: '800' },
  creditDen: { fontSize: 16, fontWeight: '600' },
  upBtn: { borderRadius: 999, paddingHorizontal: 18, paddingVertical: 10 },
  upTxt: { color: '#fff', fontWeight: '800', fontSize: 13 },
  barBg: { height: 8, borderRadius: 999, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 999 },
  barLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  barLbl: { fontSize: 11, fontWeight: '600' },
  currentPlan: { marginTop: 4, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between' },
  currentPlanLabel: { fontSize: 12, fontWeight: '600' },
  currentPlanValue: { fontSize: 12, fontWeight: '800' },
  secLbl: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5, paddingLeft: 4 },
  card: { borderRadius: 20, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  rowIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { fontSize: 16, fontWeight: '700' },
  rowSub: { fontSize: 12, marginTop: 2 },
  signOut: { alignSelf: 'center', paddingVertical: 12, paddingHorizontal: 24 },
  signOutTxt: { color: '#ef4444', fontWeight: '800', fontSize: 16 },
  ver: { textAlign: 'center', fontSize: 11, marginTop: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', padding: 24, borderRadius: 16, elevation: 4 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  modalInput: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 24 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 16 },
  modalBtn: { paddingVertical: 8, paddingHorizontal: 16 },
  modalBtnTxt: { fontSize: 16, fontWeight: '600' },
  plansModalContent: { width: '92%', maxHeight: '82%', borderRadius: 20, padding: 18 },
  plansHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  plansList: { gap: 10, paddingBottom: 10 },
  planCard: { borderWidth: 1, borderRadius: 14, padding: 14, gap: 5 },
  planTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  planName: { fontSize: 18, fontWeight: '800' },
  planPrice: { fontSize: 16, fontWeight: '800' },
  planSub: { fontSize: 12, marginBottom: 6 },
  planPointGood: { fontSize: 13, fontWeight: '600' },
  planPointBad: { fontSize: 13, fontWeight: '600' },
  choosePlanBtn: { marginTop: 8, borderRadius: 12, alignItems: 'center', justifyContent: 'center', height: 50 },
  choosePlanTxt: { color: '#fff', fontSize: 14, fontWeight: '800' }
});
