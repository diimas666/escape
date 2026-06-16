import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlashList, type FlashListRef } from '@shopify/flash-list';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ProductImage } from '../ProductImage';
import { colors, radius, spacing } from '../../constants/theme';
import { formatPrice, type HomeProduct } from '../../types/catalog';

const { width: screenWidth } = Dimensions.get('window');
const slideWidth = screenWidth - spacing.screen * 2;

type Props = {
  items: HomeProduct[];
  onProductPress?: (product: HomeProduct) => void;
};

export function TrendingSlider({ items, onProductPress }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlashListRef<HomeProduct>>(null);
  const isJumping = useRef(false);
  const waveOpacity = useRef(new Animated.Value(0.25)).current;

  const loopItems = useMemo(() => {
    if (items.length <= 1) {
      return items;
    }
    return [items[items.length - 1], ...items, items[0]];
  }, [items]);

  const toLogicalIndex = (rawIndex: number) => {
    if (items.length <= 1) {
      return 0;
    }
    if (rawIndex === 0) {
      return items.length - 1;
    }
    if (rawIndex === loopItems.length - 1) {
      return 0;
    }
    return rawIndex - 1;
  };

  const scrollToLogicalIndex = useCallback(
    (logicalIndex: number, animated: boolean) => {
      if (items.length <= 1) {
        return;
      }
      const isWrappingForward =
        logicalIndex === 0 && activeIndex === items.length - 1;
      const rawIndex = isWrappingForward
        ? loopItems.length - 1
        : logicalIndex + 1;
      listRef.current?.scrollToOffset({
        offset: rawIndex * slideWidth,
        animated,
      });
    },
    [activeIndex, items.length, loopItems.length],
  );

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isJumping.current) {
      return;
    }
    const rawIndex = Math.round(event.nativeEvent.contentOffset.x / slideWidth);
    setActiveIndex(toLogicalIndex(rawIndex));
  };

  const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (items.length <= 1 || isJumping.current) {
      return;
    }

    const rawIndex = Math.round(event.nativeEvent.contentOffset.x / slideWidth);

    if (rawIndex === 0) {
      isJumping.current = true;
      listRef.current?.scrollToOffset({
        offset: items.length * slideWidth,
        animated: false,
      });
      setActiveIndex(items.length - 1);
      requestAnimationFrame(() => {
        isJumping.current = false;
      });
    } else if (rawIndex === loopItems.length - 1) {
      isJumping.current = true;
      listRef.current?.scrollToOffset({
        offset: slideWidth,
        animated: false,
      });
      setActiveIndex(0);
      requestAnimationFrame(() => {
        isJumping.current = false;
      });
    }
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveOpacity, {
          toValue: 0.55,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(waveOpacity, {
          toValue: 0.25,
          duration: 1600,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [waveOpacity]);

  useEffect(() => {
    if (items.length <= 1) {
      return;
    }

    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({
        offset: slideWidth,
        animated: false,
      });
    });
  }, [items.length]);

  useEffect(() => {
    if (items.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % items.length;
      scrollToLogicalIndex(nextIndex, true);
    }, 6000);

    return () => clearInterval(interval);
  }, [activeIndex, items.length, scrollToLogicalIndex]);

  if (items.length === 0) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.heading}>Трендові товари</Text>

      <FlashList
        ref={listRef}
        data={loopItems}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        onMomentumScrollEnd={onMomentumScrollEnd}
        scrollEventThrottle={16}
        getItemType={() => 'slide'}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width: slideWidth }]}>
            <Animated.View
              pointerEvents="none"
              style={[styles.wave, { opacity: waveOpacity }]}
            />
            <View style={styles.imageBox}>
              <ProductImage
                uri={item.image}
                label={item.title}
                size={120}
                rounded={radius.md}
              />
            </View>
            <View style={styles.content}>
              <Text style={styles.badge}>Тренд</Text>
              <Text style={styles.title} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.price}>{formatPrice(item.price)}</Text>
              <Pressable
                onPress={() => onProductPress?.(item)}
                style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}>
                <Text style={styles.ctaText}>Дивитись</Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      {items.length > 1 ? (
        <View style={styles.dots}>
          {items.map((item, index) => (
            <View
              key={item.id}
              style={[styles.dot, index === activeIndex && styles.dotActive]}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 28,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textOnDark,
    marginBottom: 12,
  },
  slide: {
    minHeight: 168,
    borderRadius: radius.lg,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.homeSearch,
    overflow: 'hidden',
  },
  wave: {
    position: 'absolute',
    left: -40,
    right: -40,
    top: -40,
    bottom: -40,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 999,
    transform: [{ scaleX: 1.4 }],
  },
  imageBox: {
    width: 120,
    height: 120,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  badge: {
    alignSelf: 'flex-start',
    fontSize: 11,
    fontWeight: '700',
    color: colors.textOnDark,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
    marginBottom: 8,
    overflow: 'hidden',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textOnDark,
    marginBottom: 6,
    lineHeight: 21,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.priceLight,
    marginBottom: 12,
  },
  cta: {
    alignSelf: 'flex-start',
    backgroundColor: colors.card,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  ctaPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.95 }],
  },
  ctaText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
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
