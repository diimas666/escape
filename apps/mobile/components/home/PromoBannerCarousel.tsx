import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, radius, spacing } from '../../constants/theme';
import type { HomeBanner } from '../../types/catalog';

const { width: screenWidth } = Dimensions.get('window');
const bannerWidth = screenWidth - spacing.screen * 2;

type Props = {
  items: HomeBanner[];
};

export function PromoBannerCarousel({ items }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList<HomeBanner>>(null);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / bannerWidth);
    setActiveIndex(index);
  };

  return (
    <View style={styles.wrapper}>
      <FlatList
        ref={listRef}
        data={items}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View
            style={[
              styles.banner,
              { width: bannerWidth, backgroundColor: item.color },
            ]}>
            <View style={styles.content}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
              <Pressable style={styles.cta}>
                <Text style={styles.ctaText}>{item.cta}</Text>
              </Pressable>
            </View>
            <Text style={styles.emoji}>{item.emoji}</Text>
          </View>
        )}
      />

      <View style={styles.dots}>
        {items.map((item, index) => (
          <View
            key={item.id}
            style={[styles.dot, index === activeIndex && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 28,
  },
  banner: {
    minHeight: 160,
    borderRadius: radius.lg,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textOnDark,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 16,
  },
  cta: {
    alignSelf: 'flex-start',
    backgroundColor: colors.card,
    borderRadius: radius.pill,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  ctaText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  emoji: {
    fontSize: 56,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  dotActive: {
    width: 18,
    backgroundColor: colors.textOnDark,
  },
});
