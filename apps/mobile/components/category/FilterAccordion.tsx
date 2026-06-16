import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, radius } from '../../constants/theme';

type Props = {
  title: string;
  selectedCount?: number;
  defaultExpanded?: boolean;
  children: ReactNode;
};

export function FilterAccordion({
  title,
  selectedCount = 0,
  defaultExpanded = false,
  children,
}: Props) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <View style={styles.accordion}>
      <Pressable
        onPress={() => setExpanded(current => !current)}
        style={({ pressed }) => [
          styles.header,
          pressed && styles.pressed,
        ]}
        accessibilityRole="button"
        accessibilityState={{ expanded }}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.meta}>
          {selectedCount > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{selectedCount}</Text>
            </View>
          ) : null}
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={colors.textOnDarkMuted}
          />
        </View>
      </Pressable>

      {expanded ? <View style={styles.body}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  accordion: {
    borderRadius: radius.md,
    backgroundColor: colors.homeSurface,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.textOnDark,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textOnDark,
  },
  body: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  pressed: {
    opacity: 0.85,
  },
});
