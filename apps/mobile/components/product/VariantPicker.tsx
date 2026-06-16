import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/theme';
import { getVariantColor } from '../../utils/variantColors';

const LIGHT_COLORS = new Set(['#FFFFFF', '#C0C0C0', '#EAB308']);

type Props = {
  variants: string[];
  selected: string | null;
  onSelect: (variant: string) => void;
};

export function VariantPicker({ variants, selected, onSelect }: Props) {
  if (variants.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.label}>
        Колір
        {selected ? <Text style={styles.labelValue}>: {selected}</Text> : null}
      </Text>

      <View style={styles.row}>
        {variants.map(variant => {
          const isSelected = selected === variant;
          const variantColor = getVariantColor(variant);
          const isLight = LIGHT_COLORS.has(variantColor);

          return (
            <Pressable
              key={variant}
              accessibilityRole="button"
              accessibilityLabel={`Колір ${variant}`}
              accessibilityState={{ selected: isSelected }}
              onPress={() => onSelect(variant)}
              style={({ pressed }) => [styles.dotWrap, pressed && styles.pressed]}>
              <View style={[styles.dotRing, isSelected && styles.dotRingSelected]}>
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: variantColor },
                    isLight && styles.dotBorder,
                  ]}
                />
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textOnDarkMuted,
    marginBottom: 10,
  },
  labelValue: {
    color: colors.textOnDark,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  dotWrap: {
    padding: 2,
  },
  pressed: {
    opacity: 0.85,
  },
  dotRing: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dotRingSelected: {
    borderColor: colors.primary,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  dotBorder: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
});
