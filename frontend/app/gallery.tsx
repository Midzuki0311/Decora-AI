import React, { useState, useEffect } from 'react';
// Triggering TS re-eval
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '../src/components/new-ui/AppHeader';
import { BottomNav } from '../src/components/new-ui/BottomNav';
import { ScreenWrapper } from '../src/components/new-ui/ScreenWrapper';
import { useUI } from '../src/components/new-ui/designSystem';
import { useLanguageStore } from '../src/store/languageStore';

const { width } = Dimensions.get('window');

interface GalleryVariant {
  id: string;
  styleName: string;
  styleCategory?: string;
  afterImageUrl: string;
  order: number;
}

interface GalleryItem {
  id: string;
  title?: string;
  beforeImageUrl: string;
  variants: GalleryVariant[];
}

const GalleryScreen: React.FC = () => {
  const router = useRouter();
  const { colors } = useUI();
  const { t } = useLanguageStore();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<Record<string, number>>({});

  // ═══════════════════════════════════════════
  // FETCH GALLERY
  // ═══════════════════════════════════════════

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://192.168.1.100:5000/api/gallery');
      if (!response.ok) throw new Error('Failed to fetch gallery');
      const data = await response.json();
      setItems(data.data);

      // Initialize selected variant index
      const defaultVariants: Record<string, number> = {};
      data.data.forEach((item: GalleryItem) => {
        defaultVariants[item.id] = 0;
      });
      setSelectedVariantIndex(defaultVariants);
    } catch (error) {
      console.error('Failed to load gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.muted }]}>
            Loading gallery...
          </Text>
        </View>
        <BottomNav active="gallery" />
      </ScreenWrapper>
    );
  }

  if (items.length === 0) {
    return (
      <ScreenWrapper>
        <AppHeader title="Gallery" showBack={true} />
        <ScrollView contentContainerStyle={styles.emptyContainer}>
          <Ionicons name="image-outline" size={64} color={colors.muted} />
          <Text style={[styles.emptyText, { color: colors.muted }]}>
            No gallery items available yet
          </Text>
        </ScrollView>
        <BottomNav active="gallery" />
      </ScreenWrapper>
    );
  }

  const currentItem = items[currentItemIndex];
  const currentVariant = currentItem.variants[selectedVariantIndex[currentItem.id] || 0];

  return (
    <ScreenWrapper>
      <AppHeader title="Before & After Gallery" showBack={true} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.container, { paddingBottom: 80 }]}
      >
        <Animated.View
          entering={FadeInDown}
          style={[styles.header, { borderBottomColor: colors.border }]}
        >
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Beautiful Transformations
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.muted }]}>
            Explore stunning design possibilities
          </Text>
        </Animated.View>

        {/* Current Item Display */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.itemContainer}>
          {/* Title */}
          {currentItem.title && (
            <Text style={[styles.itemTitle, { color: colors.text }]}>
              {currentItem.title}
            </Text>
          )}

          {/* Before Image */}
          <View style={[styles.imageWrapper, { backgroundColor: colors.surfaceSoft }]}>
            <Image
              source={{ uri: currentItem.beforeImageUrl }}
              style={styles.beforeImage}
              resizeMode="cover"
            />
            <View style={[styles.label, styles.beforeLabel]}>
              <Text style={styles.labelText}>Before</Text>
            </View>
          </View>

          {/* After Image */}
          {currentVariant && (
            <View style={[styles.imageWrapper, { backgroundColor: colors.surfaceSoft }]}>
              <Image
                source={{ uri: currentVariant.afterImageUrl }}
                style={styles.afterImage}
                resizeMode="cover"
              />
              <View style={[styles.label, styles.afterLabel]}>
                <Text style={styles.labelText}>{currentVariant.styleName}</Text>
              </View>
            </View>
          )}

          {/* Style Selection Chips */}
          {currentItem.variants.length > 1 && (
            <View style={styles.chipsContainer}>
              <Text style={[styles.chipsTitle, { color: colors.text }]}>
                More Styles ({currentItem.variants.length})
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {currentItem.variants.map((variant: GalleryVariant, idx: number) => (
                  <TouchableOpacity
                    key={variant.id}
                    onPress={() =>
                      setSelectedVariantIndex({
                        ...selectedVariantIndex,
                        [currentItem.id]: idx,
                      })
                    }
                    style={[
                      styles.styleChip,
                      {
                        borderColor:
                          selectedVariantIndex[currentItem.id] === idx
                            ? colors.primary
                            : colors.border,
                        borderWidth: selectedVariantIndex[currentItem.id] === idx ? 2 : 1,
                      },
                    ]}
                  >
                    <Image
                      source={{ uri: variant.afterImageUrl }}
                      style={styles.styleChipImage}
                      resizeMode="cover"
                    />
                    <Text
                      style={[
                        styles.styleChipLabel,
                        {
                          color:
                            selectedVariantIndex[currentItem.id] === idx
                              ? colors.primary
                              : colors.muted,
                          fontWeight:
                            selectedVariantIndex[currentItem.id] === idx ? '600' : '400',
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {variant.styleName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </Animated.View>

        {/* Navigation */}
        {items.length > 1 && (
          <View style={styles.navigationContainer}>
            <TouchableOpacity
              onPress={() =>
                setCurrentItemIndex((prev: number) => (prev - 1 + items.length) % items.length)
              }
              style={[styles.navButton, { backgroundColor: colors.primary }]}
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>

            <View style={styles.counterContainer}>
              <Text style={[styles.counter, { color: colors.text }]}>
                {currentItemIndex + 1} / {items.length}
              </Text>
              <View style={styles.dotsContainer}>
                {items.map((_: GalleryItem, idx: number) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setCurrentItemIndex(idx)}
                    style={[
                      styles.dot,
                      {
                        backgroundColor:
                          idx === currentItemIndex ? colors.primary : colors.border,
                        width: idx === currentItemIndex ? 24 : 8,
                      },
                    ]}
                  />
                ))}
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setCurrentItemIndex((prev: number) => (prev + 1) % items.length)}
              style={[styles.navButton, { backgroundColor: colors.primary }]}
            >
              <Ionicons name="chevron-forward" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}

        {/* Thumbnails Carousel */}
        {items.length > 1 && (
          <View style={styles.thumbnailsContainer}>
            <Text style={[styles.allItemsTitle, { color: colors.text }]}>
              All Items ({items.length})
            </Text>
            <FlatList
              data={items}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => setCurrentItemIndex(index)}
                  style={[
                    styles.thumbnail,
                    {
                      borderColor:
                        index === currentItemIndex ? colors.primary : colors.border,
                      borderWidth: index === currentItemIndex ? 2 : 1,
                      opacity: index === currentItemIndex ? 1 : 0.6,
                    },
                  ]}
                >
                  <Image
                    source={{ uri: item.beforeImageUrl }}
                    style={styles.thumbnailImage}
                    resizeMode="cover"
                  />
                  <Text
                    style={[styles.thumbnailLabel, { color: colors.text }]}
                    numberOfLines={1}
                  >
                    {item.title?.substring(0, 10) || `Item ${index + 1}`}
                  </Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
            />
          </View>
        )}
      </ScrollView>

      <BottomNav active="gallery" />
    </ScreenWrapper>
  );
};

export default GalleryScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  itemContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  imageWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    aspectRatio: 4 / 3,
    position: 'relative',
  },
  beforeImage: {
    width: '100%',
    height: '100%',
  },
  afterImage: {
    width: '100%',
    height: '100%',
  },
  label: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  beforeLabel: {
    backgroundColor: '#DC2626',
  },
  afterLabel: {
    backgroundColor: '#16A34A',
  },
  labelText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  chipsContainer: {
    marginVertical: 16,
  },
  chipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  styleChip: {
    marginRight: 12,
    paddingBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    width: 80,
  },
  styleChipImage: {
    width: '100%',
    height: 60,
    marginBottom: 4,
  },
  styleChipLabel: {
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterContainer: {
    flex: 1,
    alignItems: 'center',
  },
  counter: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  thumbnailsContainer: {
    paddingVertical: 16,
  },
  allItemsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  thumbnail: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
  },
  thumbnailImage: {
    width: 80,
    height: 80,
  },
  thumbnailLabel: {
    fontSize: 10,
    textAlign: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
});
