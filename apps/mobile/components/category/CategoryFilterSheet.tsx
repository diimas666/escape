import { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, radius, spacing } from '../../constants/theme';
import {
  defaultCategoryFilters,
  type CategoryProductFilters,
  type PriceBounds,
} from '../../types/filters';
import type { FilterOption } from '../../utils/categoryFilters';
import { FilterAccordion } from './FilterAccordion';
import { PriceRangeSlider } from './PriceRangeSlider';

type Props = {
  visible: boolean;
  filters: CategoryProductFilters;
  brands: string[];
  subcategoryOptions: FilterOption[];
  variantOptions: string[];
  priceBounds: PriceBounds;
  onClose: () => void;
  onApply: (filters: CategoryProductFilters) => void;
};

type DraftFilters = CategoryProductFilters & {
  priceFrom: number;
  priceTo: number;
};

type FilterKey = 'brands' | 'subcategories' | 'variants';

function FilterCheckboxList({
  options,
  selected,
  onToggle,
}: {
  options: FilterOption[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <>
      {options.map((option, index) => (
        <FilterListOption
          key={option.id}
          label={option.label}
          active={selected.includes(option.id)}
          onPress={() => onToggle(option.id)}
          isLast={index === options.length - 1}
        />
      ))}
    </>
  );
}

function FilterListOption({
  label,
  active,
  onPress,
  isLast,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  isLast?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.listRow, !isLast && styles.listRowBorder]}>
      <Text style={[styles.listLabel, active && styles.listLabelActive]}>
        {label}
      </Text>
      <View style={[styles.checkbox, active && styles.checkboxActive]}>
        {active ? (
          <Ionicons name="checkmark" size={16} color={colors.textOnDark} />
        ) : null}
      </View>
    </Pressable>
  );
}

function createDraft(
  filters: CategoryProductFilters,
  priceBounds: PriceBounds,
): DraftFilters {
  return {
    ...filters,
    priceFrom: filters.priceMin ?? priceBounds.min,
    priceTo: filters.priceMax ?? priceBounds.max,
  };
}

function draftToFilters(
  draft: DraftFilters,
  priceBounds: PriceBounds,
): CategoryProductFilters {
  const priceMin =
    draft.priceFrom > priceBounds.min ? draft.priceFrom : null;
  const priceMax =
    draft.priceTo < priceBounds.max ? draft.priceTo : null;

  return {
    sort: draft.sort,
    brands: draft.brands,
    subcategories: draft.subcategories,
    variants: draft.variants,
    priceMin,
    priceMax,
  };
}

function isPriceActive(
  draft: DraftFilters,
  priceBounds: PriceBounds,
): boolean {
  return (
    draft.priceFrom > priceBounds.min || draft.priceTo < priceBounds.max
  );
}

export function CategoryFilterSheet({
  visible,
  filters,
  brands,
  subcategoryOptions,
  variantOptions,
  priceBounds,
  onClose,
  onApply,
}: Props) {
  const [draft, setDraft] = useState<DraftFilters>(() =>
    createDraft(filters, priceBounds),
  );

  useEffect(() => {
    if (visible) {
      setDraft(createDraft(filters, priceBounds));
    }
  }, [visible, filters, priceBounds]);

  const toggleItem = (key: FilterKey, value: string) => {
    setDraft(current => {
      const selected = new Set(current[key]);
      if (selected.has(value)) {
        selected.delete(value);
      } else {
        selected.add(value);
      }

      return { ...current, [key]: Array.from(selected) };
    });
  };

  const handleApply = () => {
    onApply(draftToFilters(draft, priceBounds));
    onClose();
  };

  const handleReset = () => {
    const resetFilters: CategoryProductFilters = {
      ...defaultCategoryFilters,
      sort: filters.sort,
    };

    setDraft(createDraft(resetFilters, priceBounds));
    onApply(resetFilters);
  };

  const brandOptions: FilterOption[] = brands.map(brand => ({
    id: brand,
    label: brand,
  }));

  const variantFilterOptions: FilterOption[] = variantOptions.map(variant => ({
    id: variant,
    label: variant,
  }));

  const priceSelected = isPriceActive(draft, priceBounds) ? 1 : 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>Фільтри</Text>
            <Pressable onPress={onClose} accessibilityLabel="Закрити">
              <Ionicons name="close" size={24} color={colors.textOnDark} />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}>
            {brandOptions.length > 0 ? (
              <FilterAccordion
                title="Бренд"
                selectedCount={draft.brands.length}>
                <FilterCheckboxList
                  options={brandOptions}
                  selected={draft.brands}
                  onToggle={value => toggleItem('brands', value)}
                />
              </FilterAccordion>
            ) : null}

            {subcategoryOptions.length > 0 ? (
              <FilterAccordion
                title="Підкатегорії"
                selectedCount={draft.subcategories.length}>
                <FilterCheckboxList
                  options={subcategoryOptions}
                  selected={draft.subcategories}
                  onToggle={value => toggleItem('subcategories', value)}
                />
              </FilterAccordion>
            ) : null}

            {variantFilterOptions.length > 0 ? (
              <FilterAccordion
                title="Варіант"
                selectedCount={draft.variants.length}>
                <FilterCheckboxList
                  options={variantFilterOptions}
                  selected={draft.variants}
                  onToggle={value => toggleItem('variants', value)}
                />
              </FilterAccordion>
            ) : null}

            <FilterAccordion title="Ціна" selectedCount={priceSelected}>
              <View style={styles.priceBody}>
                <PriceRangeSlider
                  key={`${draft.priceFrom}-${draft.priceTo}`}
                  min={priceBounds.min}
                  max={priceBounds.max}
                  from={draft.priceFrom}
                  to={draft.priceTo}
                  onChange={(priceFrom, priceTo) =>
                    setDraft(current => ({ ...current, priceFrom, priceTo }))
                  }
                />
              </View>
            </FilterAccordion>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              accessibilityRole="button"
              onPress={handleReset}
              style={({ pressed }) => [styles.resetButton, pressed && styles.pressed]}>
              <Text style={styles.resetText}>Скинути</Text>
            </Pressable>
            <Pressable
              onPress={handleApply}
              style={({ pressed }) => [styles.applyButton, pressed && styles.pressed]}>
              <Text style={styles.applyText}>Застосувати</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheet: {
    maxHeight: '82%',
    backgroundColor: colors.homeBackground,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingBottom: 24,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.homeSurface,
    marginTop: 10,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screen,
    paddingBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textOnDark,
  },
  content: {
    paddingHorizontal: spacing.screen,
    paddingBottom: 16,
    gap: 10,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
  },
  listRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  listLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: colors.textOnDarkMuted,
  },
  listLabelActive: {
    color: colors.textOnDark,
    fontWeight: '600',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.textOnDarkMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  priceBody: {
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: spacing.screen,
    paddingTop: 8,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radius.pill,
    backgroundColor: colors.homeSurface,
    alignItems: 'center',
  },
  resetText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textOnDark,
  },
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  applyText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textOnDark,
  },
  pressed: {
    opacity: 0.85,
  },
});
