import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  CheckoutAutocompleteField,
  type AutocompleteSuggestion,
} from '../components/checkout/CheckoutAutocompleteField';
import { CheckoutField } from '../components/checkout/CheckoutField';
import { CheckoutOrderItem } from '../components/checkout/CheckoutOrderItem';
import { CheckoutRadioRow } from '../components/checkout/CheckoutRadioRow';
import { CheckoutSection } from '../components/checkout/CheckoutSection';
import { NovaPoshtaBadge } from '../components/checkout/NovaPoshtaBadge';
import { BackButton } from '../components/navigation/BackButton';
import { Screen } from '../components/Screen';
import { paymentCardNumber } from '../config/payment';
import { colors, radius, spacing } from '../constants/theme';
import { useCart } from '../context/CartContext';
import { showErrorToast, showToast } from '../context/ToastContext';
import { useNovaPoshtaCities } from '../hooks/useNovaPoshtaCities';
import { useNovaPoshtaWarehouses } from '../hooks/useNovaPoshtaWarehouses';
import type { RootStackParamList } from '../navigation/types';
import { submitCheckout } from '../services/checkout';
import { formatPrice } from '../types/catalog';
import { getCartTotals } from '../utils/cartTotals';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;
type PaymentMethod = 'card' | 'cod';

export function CheckoutScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { items, totalQuantity, clearCart } = useCart();
  const cartTotals = useMemo(() => getCartTotals(items), [items]);
  const { total } = cartTotals;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [cityRef, setCityRef] = useState('');
  const [warehouse, setWarehouse] = useState('');
  const [warehouseRef, setWarehouseRef] = useState('');
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [showWarehouseSuggestions, setShowWarehouseSuggestions] = useState(false);
  const [comment, setComment] = useState('');
  const [novaPoshtaSelected, setNovaPoshtaSelected] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    suggestions: citySuggestions,
    isLoading: isCityLoading,
    error: citySearchError,
  } = useNovaPoshtaCities(city, novaPoshtaSelected && showCitySuggestions);

  const {
    suggestions: warehouseSuggestions,
    isLoading: isWarehouseLoading,
    error: warehouseSearchError,
  } = useNovaPoshtaWarehouses(
    cityRef,
    warehouse,
    novaPoshtaSelected && showWarehouseSuggestions && Boolean(cityRef),
  );

  useEffect(() => {
    if (items.length === 0) {
      navigation.goBack();
    }
  }, [items.length, navigation]);

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedCity = city.trim();
    const trimmedWarehouse = warehouse.trim();

    if (!trimmedName) {
      showToast('Введіть ім\'я', 'info');
      return;
    }

    if (!trimmedPhone) {
      showToast('Введіть номер телефону', 'info');
      return;
    }

    if (!novaPoshtaSelected) {
      showToast('Оберіть спосіб доставки', 'info');
      return;
    }

    if (!trimmedCity || !cityRef || !trimmedWarehouse) {
      showToast('Оберіть місто та відділення Нової Пошти зі списку', 'info');
      return;
    }

    const [firstName, ...restName] = trimmedName.split(/\s+/);

    setIsSubmitting(true);

    try {
      await submitCheckout({
        name: firstName,
        lastName: restName.join(' '),
        phone: trimmedPhone,
        email: email.trim() || undefined,
        comment: comment.trim() || undefined,
        paymentMethod: paymentMethod === 'card' ? 'card_online' : 'cod',
        city: trimmedCity,
        cityRef,
        warehouse: trimmedWarehouse,
        total,
        items,
        createdAt: new Date().toISOString(),
      });

      await clearCart();
      showToast('Замовлення оформлено', 'success');
      navigation.navigate('MainTabs', { screen: 'Home' });
    } catch (error) {
      showErrorToast(error, 'Не вдалося оформити замовлення');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCityChange = (text: string) => {
    setCity(text);
    setCityRef('');
    setWarehouse('');
    setWarehouseRef('');
    setShowCitySuggestions(true);
    setShowWarehouseSuggestions(false);
  };

  const handleCitySelect = (item: AutocompleteSuggestion) => {
    setCity(item.title);
    setCityRef(item.id);
    setShowCitySuggestions(false);
    setWarehouse('');
    setWarehouseRef('');
  };

  const handleWarehouseChange = (text: string) => {
    setWarehouse(text);
    setWarehouseRef('');
    setShowWarehouseSuggestions(true);
  };

  const handleWarehouseSelect = (item: AutocompleteSuggestion) => {
    setWarehouse(item.title);
    setWarehouseRef(item.id);
    setShowWarehouseSuggestions(false);
  };

  return (
    <Screen backgroundColor={colors.homeBackground}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Оформлення замовлення</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.layout}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}>
          <CheckoutSection title="Ваше замовлення">
            {items.map((item, index) => (
              <CheckoutOrderItem
                key={`${item.productId}-${item.variant ?? 'default'}`}
                item={item}
                isLast={index === items.length - 1}
              />
            ))}
          </CheckoutSection>

          <CheckoutSection title="Контактні дані">
            <CheckoutField
              label="Ім'я"
              value={name}
              onChangeText={setName}
              placeholder="Ваше ім'я"
              autoCapitalize="words"
            />
            <CheckoutField
              label="Телефон"
              value={phone}
              onChangeText={setPhone}
              placeholder="+380 XX XXX XX XX"
              keyboardType="phone-pad"
            />
            <CheckoutField
              label="Email"
              optional
              last
              value={email}
              onChangeText={setEmail}
              placeholder="email@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </CheckoutSection>

          <CheckoutSection title="Доставка">
            <CheckoutRadioRow
              label="Нова пошта"
              hint="1-3 дні"
              selected={novaPoshtaSelected}
              onPress={() => setNovaPoshtaSelected(true)}
              leading={<NovaPoshtaBadge />}
            />
            <CheckoutAutocompleteField
              label="Місто"
              value={city}
              onChangeText={handleCityChange}
              onFocus={() => setShowCitySuggestions(true)}
              placeholder="Почніть вводити місто"
              suggestions={citySuggestions}
              isLoading={isCityLoading}
              showSuggestions={showCitySuggestions && !cityRef}
              onSelect={handleCitySelect}
              helperText={cityRef ? `Обрано: ${city}` : undefined}
              errorText={citySearchError ?? undefined}
            />
            <CheckoutAutocompleteField
              label="Відділення або поштомат"
              last
              value={warehouse}
              onChangeText={handleWarehouseChange}
              onFocus={() => {
                if (cityRef) {
                  setShowWarehouseSuggestions(true);
                } else {
                  showToast('Спочатку оберіть місто', 'info');
                }
              }}
              placeholder={cityRef ? '№ відділення або вулиця' : 'Спочатку оберіть місто'}
              editable={Boolean(cityRef)}
              suggestions={warehouseSuggestions}
              isLoading={isWarehouseLoading}
              showSuggestions={showWarehouseSuggestions && !warehouseRef}
              onSelect={handleWarehouseSelect}
              helperText={warehouseRef ? 'Відділення обрано' : undefined}
              errorText={warehouseSearchError ?? undefined}
            />
          </CheckoutSection>

          <CheckoutSection title="Коментар до замовлення">
            <CheckoutField
              label="Коментар"
              optional
              last
              value={comment}
              onChangeText={setComment}
              placeholder="Додаткові побажання"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              style={styles.commentInput}
            />
          </CheckoutSection>

          <CheckoutSection title="Оплата">
            <CheckoutRadioRow
              label="Онлайн оплата карткою"
              selected={paymentMethod === 'card'}
              onPress={() => setPaymentMethod('card')}
            />
            <CheckoutRadioRow
              label="Оплата при отриманні"
              hint="Накладений платіж"
              selected={paymentMethod === 'cod'}
              onPress={() => setPaymentMethod('cod')}
              isLast={paymentMethod !== 'card'}
            />

            {paymentMethod === 'card' ? (
              <View style={styles.cardBlock}>
                <Text style={styles.cardLabel}>Номер картки для оплати</Text>
                <Text style={styles.cardNumber} selectable>
                  {paymentCardNumber}
                </Text>
                <Text style={styles.cardHint}>
                  Перекажіть суму замовлення на цю картку та вкажіть ПІБ у призначенні
                  платежу
                </Text>
              </View>
            ) : null}
          </CheckoutSection>

          <View style={styles.totalsCard}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Товари ({totalQuantity})
              </Text>
              <Text style={styles.totalValue}>{formatPrice(total)}</Text>
            </View>
            <View style={[styles.totalRow, styles.grandTotalRow]}>
              <Text style={styles.grandTotalLabel}>Всього до сплати</Text>
              <Text style={styles.grandTotalValue}>{formatPrice(total)}</Text>
            </View>
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <Pressable
            accessibilityRole="button"
            disabled={isSubmitting}
            onPress={handleSubmit}
            style={({ pressed }) => [
              styles.submitButton,
              pressed && !isSubmitting && styles.pressed,
              isSubmitting && styles.submitDisabled,
            ]}>
            {isSubmitting ? (
              <ActivityIndicator color={colors.textOnDark} />
            ) : (
              <>
                <Text style={styles.submitText}>
                  {paymentMethod === 'card' ? 'Підтвердити замовлення' : 'Оформити замовлення'}
                </Text>
                <Ionicons name="arrow-forward" size={18} color={colors.textOnDark} />
              </>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screen,
    paddingBottom: 12,
    gap: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: colors.textOnDark,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  layout: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.screen,
    paddingBottom: 16,
    gap: 20,
  },
  commentInput: {
    minHeight: 72,
  },
  cardBlock: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.screen,
    backgroundColor: '#F0FDF4',
    gap: 6,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  cardNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 1,
  },
  cardHint: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 17,
  },
  totalsCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 16,
    gap: 10,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 14,
    color: colors.textMuted,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  grandTotalRow: {
    marginTop: 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.screen,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  grandTotalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  footer: {
    paddingHorizontal: spacing.screen,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: colors.homeBackground,
  },
  submitButton: {
    minHeight: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
  },
  submitDisabled: {
    opacity: 0.7,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textOnDark,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
});
