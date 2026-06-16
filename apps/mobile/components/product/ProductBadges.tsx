import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/theme';

type Badge = {
  key: string;
  label: string;
  backgroundColor: string;
  textColor?: string;
};

type Props = {
  isNew?: boolean;
  isTrending?: boolean;
  isFeatured?: boolean;
};

export function ProductBadges({
  isNew,
  isTrending,
  isFeatured,
}: Props) {
  const badges: Badge[] = [];

  if (isNew) {
    badges.push({
      key: 'new',
      label: 'Новинка',
      backgroundColor: colors.primary,
    });
  }

  if (isTrending) {
    badges.push({
      key: 'trending',
      label: 'Тренд',
      backgroundColor: '#F59E0B',
    });
  }

  if (isFeatured) {
    badges.push({
      key: 'featured',
      label: 'Топ',
      backgroundColor: '#8B5CF6',
    });
  }

  if (badges.length === 0) {
    return null;
  }

  return (
    <View style={styles.row} pointerEvents="none">
      {badges.map(badge => (
        <View
          key={badge.key}
          style={[styles.badge, { backgroundColor: badge.backgroundColor }]}>
          <Text
            style={[
              styles.badgeText,
              badge.textColor ? { color: badge.textColor } : null,
            ]}>
            {badge.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    maxWidth: '70%',
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textOnDark,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
});
