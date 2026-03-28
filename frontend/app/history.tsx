import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
import { AppHeader } from '../src/components/new-ui/AppHeader';
import { BottomNav } from '../src/components/new-ui/BottomNav';
import { sourceUri, STYLE_NAMES } from '../src/components/new-ui/demoImages';
import { ImageViewer } from '../src/components/new-ui/ImageViewer';
import { useUI } from '../src/components/new-ui/designSystem';
import { useLanguageStore } from '../src/store/languageStore';
import { ScreenWrapper, FadeInView } from '../src/components/new-ui/ScreenWrapper';
import { AnimatedPressable, AnimatedCard } from '../src/components/new-ui/AnimatedPressable';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HistoryScreen() {
  const { colors, isDark } = useUI();
  const { t } = useLanguageStore();
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [viewUri, setViewUri] = useState('');
  
  // Modals state
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [optionsItem, setOptionsItem] = useState<any>(null);

  // Fake generated images for testing the new features
  const [images, setImages] = useState<any[]>([]);

  const toggleStyleFilter = (style: string) => {
    setSelectedStyles(prev => 
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    );
  };

  const filteredImages = images.filter(img => 
    selectedStyles.length === 0 || selectedStyles.includes(img.style)
  );

  const toggleLike = (id: string) => {
    setImages(prev => prev.map(img => img.id === id ? { ...img, liked: !img.liked } : img));
    if (optionsItem?.id === id) {
      setOptionsItem({ ...optionsItem, liked: !optionsItem.liked });
    }
  };

  return (
    <View style={[styles.safe, { backgroundColor: colors.bg }]}>
      <AppHeader title={t.myGallery} />

      <ScreenWrapper>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <FadeInView delay={40}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>{t.yourGenerations || "Your Generations"}</Text>
              <AnimatedPressable 
                onPress={() => setFilterModalVisible(true)}
                style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: colors.border }}
              >
                <Ionicons name="filter" size={16} color={colors.primary} />
                <Text style={{ marginLeft: 6, color: colors.text, fontWeight: '600' }}>{t.filter || "Filter"}</Text>
                {selectedStyles.length > 0 && (
                  <View style={{ backgroundColor: colors.primary, borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center', marginLeft: 6 }}>
                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>{selectedStyles.length}</Text>
                  </View>
                )}
              </AnimatedPressable>
            </View>
          </FadeInView>

          <View style={styles.grid}>
            {filteredImages.length === 0 ? (
              <View style={{ width: '100%', alignItems: 'center', marginTop: 60, opacity: 0.5 }}>
                <Ionicons name="images-outline" size={64} color={colors.muted} />
                <Text style={{ color: colors.text, marginTop: 16, fontSize: 16 }}>No generated images yet</Text>
              </View>
            ) : (
              filteredImages.map((item, idx) => (
                <FadeInView key={item.id} delay={100 + idx * 50}>
                  <AnimatedCard
                    style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    onPress={() => setViewUri(sourceUri(item.source))}
                  >
                    <Image source={item.source} style={styles.cardImg} resizeMode="cover" />
                    <View style={styles.cardLabel}>
                      <Text style={[styles.cardLabelText, { color: colors.text }]} numberOfLines={1}>{item.label}</Text>
                      <Text style={{ color: colors.muted, fontSize: 11, marginTop: 2 }}>{item.style}</Text>
                    </View>
                    <Pressable 
                      style={styles.optionsBtn}
                      onPress={() => setOptionsItem(item)}
                    >
                      <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
                    </Pressable>
                  </AnimatedCard>
                </FadeInView>
              ))
            )}
          </View>
        </ScrollView>
      </ScreenWrapper>

      <ImageViewer visible={!!viewUri} uri={viewUri} onClose={() => setViewUri('')} />

      {/* Filter Modal */}
      <Modal visible={filterModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>{t.filterByStyle || "Filter by Style"}</Text>
              <Pressable onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>
            <ScrollView style={{ maxHeight: 300 }}>
              {STYLE_NAMES.map(style => (
                <Pressable 
                  key={style} 
                  style={styles.filterOptionRow}
                  onPress={() => toggleStyleFilter(style)}
                >
                  <Text style={[styles.filterOptionText, { color: colors.text }]}>{style}</Text>
                  <Ionicons 
                    name={selectedStyles.includes(style) ? "checkbox" : "square-outline"} 
                    size={24} 
                    color={selectedStyles.includes(style) ? colors.primary : colors.muted} 
                  />
                </Pressable>
              ))}
            </ScrollView>
            <AnimatedPressable 
              style={[styles.modalBtn, { backgroundColor: colors.primary }]}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={styles.modalBtnText}>Apply ({selectedStyles.length})</Text>
            </AnimatedPressable>
          </View>
        </View>
      </Modal>

      {/* Options Modal */}
      <Modal visible={!!optionsItem} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setOptionsItem(null)}>
          <View style={[styles.optionsModal, { backgroundColor: colors.surface }]}>
            {optionsItem && (
              <>
                <Text style={[styles.optionsTitle, { color: colors.text }]}>{optionsItem.label}</Text>
                
                <View style={styles.infoBox}>
                  <Text style={{ color: colors.muted, fontSize: 12 }}>Description</Text>
                  <Text style={{ color: colors.text, fontSize: 14, marginBottom: 8, marginTop: 4 }}>{optionsItem.description}</Text>
                  
                  <Text style={{ color: colors.muted, fontSize: 12 }}>Generated on</Text>
                  <Text style={{ color: colors.text, fontSize: 14, marginTop: 2 }}>{optionsItem.date}</Text>
                </View>

                <View style={styles.actionGrid}>
                  <Pressable style={styles.actionBtn} onPress={() => toggleLike(optionsItem.id)}>
                    <View style={[styles.actionIconArea, { backgroundColor: colors.surfaceSoft }]}>
                      <Ionicons name={optionsItem.liked ? "heart" : "heart-outline"} size={22} color={optionsItem.liked ? "#ef4444" : colors.text} />
                    </View>
                    <Text style={[styles.actionText, { color: colors.text }]}>Like</Text>
                  </Pressable>
                  
                  <Pressable style={styles.actionBtn}>
                    <View style={[styles.actionIconArea, { backgroundColor: colors.surfaceSoft }]}>
                      <Ionicons name="refresh" size={22} color={colors.primary} />
                    </View>
                    <Text style={[styles.actionText, { color: colors.text }]}>Regenerate</Text>
                  </Pressable>
                  
                  <Pressable style={styles.actionBtn} onPress={() => {
                    setOptionsItem(null);
                    setImages(prev => prev.filter(img => img.id !== optionsItem.id));
                  }}>
                    <View style={[styles.actionIconArea, { backgroundColor: '#fee2e2' }]}>
                      <Ionicons name="trash" size={22} color="#ef4444" />
                    </View>
                    <Text style={[styles.actionText, { color: colors.text }]}>Delete</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      <BottomNav active="gallery" />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 140, gap: 14 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 },
  card: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    position: 'relative',
  },
  cardImg: { width: '100%', height: 200 },
  cardLabel: { padding: 12 },
  cardLabelText: { fontSize: 14, fontWeight: '700' },
  optionsBtn: { position: 'absolute', right: 10, top: 10, width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800' },
  filterOptionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(150,150,150,0.1)' },
  filterOptionText: { fontSize: 16, fontWeight: '500' },
  modalBtn: { marginTop: 24, paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  modalBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },

  optionsModal: { margin: 24, borderRadius: 20, padding: 20, marginTop: 'auto', marginBottom: 'auto' },
  optionsTitle: { fontSize: 18, fontWeight: '800', marginBottom: 16 },
  infoBox: { padding: 12, borderRadius: 12, backgroundColor: 'rgba(150,150,150,0.1)', marginBottom: 20 },
  actionGrid: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1, alignItems: 'center', gap: 8 },
  actionIconArea: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  actionText: { fontSize: 12, fontWeight: '600' }
});
