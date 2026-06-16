import { useEffect, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { AppTabBar } from '../components/navigation/AppTabBar';
import { AddToCartButton } from '../components/product/AddToCartButton';
import { ProductCategoryLabel } from '../components/product/ProductCategoryLabel';
import { ProductDescription } from '../components/product/ProductDescription';
import { ProductImageCard } from '../components/product/ProductImageCard';
import { ProductPriceBlock } from '../components/product/ProductPriceBlock';
import { ProductScreenHeader } from '../components/product/ProductScreenHeader';
import { RelatedProductsSection } from '../components/product/RelatedProductsSection';
import { VariantPicker } from '../components/product/VariantPicker';
import { Screen } from '../components/Screen';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { showErrorToast, showToast } from '../context/ToastContext';
import { colors, radius, spacing } from '../constants/theme';
import { useProductScreen } from '../hooks/useProductScreen';
import type { RootStackParamList } from '../navigation/types';
import type { HomeProduct } from '../types/catalog';
import { errorMessages } from '../utils/errors';
import { previewToProductDetail } from '../utils/productPreview';
import { addHomeProductToCart } from '../utils/addProductToCart';

type Props = NativeStackScreenProps<RootStackParamList, 'Product'>;

export function ProductScreen({ route, navigation }: Props) {
  const { product: preview } = route.params;
  const { product, related, isLoading, error } = useProductScreen(preview.handle);
  const displayProduct = product ?? previewToProductDetail(preview);
  const showBlockingLoader = isLoading && !product;
  const { isFavorite, toggleFavorite } = useFavorites();
  const { totalQuantity, addToCart, removeFromCart, isInCart, items } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  useEffect(() => {
    if (product?.variants.length) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant(null);
    }
  }, [product?.handle, product?.variants]);

  const openRelatedProduct = (item: HomeProduct) => {
    navigation.push('Product', { product: item });
  };

  const handleAddRelatedToCart = async (item: HomeProduct) => {
    try {
      await addHomeProductToCart(addToCart, item);
    } catch (addError) {
      showErrorToast(addError, errorMessages.addToCartFailed);
    }
  };

  const isRelatedInCart = (productId: string) =>
    items.some(item => item.productId === productId);

  const openCart = () => {
    navigation.navigate('MainTabs', {
      screen: 'Cart',
      params: {
        returnTo: { name: 'Product', params: { product: preview } },
      },
    });
  };

  const handleAddToCart = async () => {
    if (!displayProduct) {
      return;
    }

    if (displayProduct.variants.length > 0 && !selectedVariant) {
      showToast(errorMessages.selectVariant, 'info');
      throw new Error('variant_required');
    }

    if (!displayProduct.inStock) {
      showErrorToast(new Error('out_of_stock'), errorMessages.addToCartFailed);
      throw new Error('out_of_stock');
    }

    try {
      await addToCart({
        productId: displayProduct.id,
        handle: displayProduct.handle,
        title: displayProduct.title,
        description: displayProduct.description,
        price: displayProduct.price,
        oldPrice: displayProduct.oldPrice,
        discountPercent: displayProduct.discountPercent,
        image: displayProduct.image,
        variant: selectedVariant ?? undefined,
      });
    } catch (addError) {
      showErrorToast(addError, errorMessages.addToCartFailed);
      throw addError;
    }
  };

  const handleRemoveFromCart = async () => {
    if (!displayProduct) {
      return;
    }

    await removeFromCart(displayProduct.id, selectedVariant ?? undefined);
  };

  const variantKey = selectedVariant ?? undefined;
  const productInCart = isInCart(displayProduct.id, variantKey);

  return (
    <Screen backgroundColor={colors.homeBackground}>
      <StatusBar barStyle="light-content" />
      <ProductScreenHeader
        onBack={() => navigation.goBack()}
        onCartPress={openCart}
        cartCount={totalQuantity}
      />

      {showBlockingLoader ? (
        <LoadingState />
      ) : error && !product ? (
        <ErrorState message={error ?? 'Товар не знайдено'} />
      ) : (
        <View style={styles.layout}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}>
            <ProductImageCard
              title={displayProduct.title}
              images={displayProduct.images}
              isNew={displayProduct.isNew}
              isTrending={displayProduct.isTrending}
              isFeatured={displayProduct.isFeatured}
            />

            <ProductCategoryLabel category={displayProduct.category} />
            <Text style={styles.title}>{displayProduct.title}</Text>
            <ProductPriceBlock
              price={displayProduct.price}
              oldPrice={displayProduct.oldPrice}
              discountPercent={displayProduct.discountPercent}
              inStock={displayProduct.inStock}
              lowStock={displayProduct.lowStock}
            />

            <VariantPicker
              variants={displayProduct.variants}
              selected={selectedVariant}
              onSelect={setSelectedVariant}
            />

            {displayProduct.description ? (
              <ProductDescription text={displayProduct.description} />
            ) : null}

            <View style={styles.actions}>
              <Pressable
                onPress={() => toggleFavorite(displayProduct.id)}
                style={({ pressed }) => [
                  styles.favoriteButton,
                  isFavorite(displayProduct.id) && styles.favoriteButtonActive,
                  pressed && styles.pressed,
                ]}>
                <Ionicons
                  name={isFavorite(displayProduct.id) ? 'heart' : 'heart-outline'}
                  size={22}
                  color={isFavorite(displayProduct.id) ? colors.textOnDark : colors.text}
                />
                <Text
                  style={[
                    styles.favoriteText,
                    isFavorite(displayProduct.id) && styles.favoriteTextActive,
                  ]}>
                  {isFavorite(displayProduct.id) ? 'В обраному' : 'В обране'}
                </Text>
              </Pressable>

              <AddToCartButton
                inStock={displayProduct.inStock}
                inCart={productInCart}
                onAdd={handleAddToCart}
                onRemove={handleRemoveFromCart}
              />
            </View>

            <RelatedProductsSection
              items={related}
              onProductPress={openRelatedProduct}
              onFavoritePress={item => toggleFavorite(item.id)}
              onAddToCartPress={handleAddRelatedToCart}
              isFavorite={isFavorite}
              isInCart={isRelatedInCart}
            />
          </ScrollView>

          <AppTabBar />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.screen,
    paddingTop: 16,
    paddingBottom: 16,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textOnDark,
    lineHeight: 28,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  favoriteButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 12,
  },
  favoriteButtonActive: {
    backgroundColor: colors.primary,
  },
  favoriteText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  favoriteTextActive: {
    color: colors.textOnDark,
  },
});
