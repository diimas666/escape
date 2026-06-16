import { useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';
import { ProductImage } from '../ProductImage';
import { ProductBadges } from './ProductBadges';
import { colors, radius, spacing } from '../../constants/theme';

const { width: screenWidth } = Dimensions.get('window');
const CARD_PADDING = 24;
const slideWidth = screenWidth - spacing.screen * 2 - CARD_PADDING * 2;
const IMAGE_SIZE = Math.min(280, slideWidth);

type Props = {
  title: string;
  images: string[];
  isNew?: boolean;
  isTrending?: boolean;
  isFeatured?: boolean;
};

export function ProductImageCard({
  title,
  images,
  isNew,
  isTrending,
  isFeatured,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const imageList = useMemo(
    () => (images.length > 0 ? images : [undefined as string | undefined]),
    [images],
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / slideWidth);
    setActiveIndex(index);
  };

  return (
    <View style={styles.card}>
      <ProductBadges
        isNew={isNew}
        isTrending={isTrending}
        isFeatured={isFeatured}
      />

      <FlatList
        data={imageList}
        keyExtractor={(uri, index) => uri ?? `placeholder-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={styles.carousel}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width: slideWidth }]}>
            <ProductImage
              uri={item}
              label={title}
              size={IMAGE_SIZE}
              rounded={radius.md}
              resizeMode="contain"
            />
          </View>
        )}
      />

      {imageList.length > 1 ? (
        <View style={styles.dots}>
          {imageList.map((uri, index) => (
            <View
              key={uri ?? `dot-${index}`}
              style={[styles.dot, index === activeIndex && styles.dotActive]}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingVertical: CARD_PADDING,
    paddingHorizontal: CARD_PADDING,
    marginBottom: 24,
    overflow: 'hidden',
  },
  carousel: {
    width: slideWidth,
    alignSelf: 'center',
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    height: IMAGE_SIZE,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(17, 24, 39, 0.2)',
  },
  dotActive: {
    width: 18,
    backgroundColor: colors.primary,
  },
});
