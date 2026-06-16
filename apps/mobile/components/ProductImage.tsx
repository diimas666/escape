import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../constants/theme';

type Props = {
  uri?: string;
  label?: string;
  size?: number;
  rounded?: number;
  resizeMode?: 'cover' | 'contain';
  backgroundColor?: string;
};

export function ProductImage({
  uri,
  label = '?',
  size = 72,
  rounded = radius.md,
  resizeMode = 'cover',
  backgroundColor = colors.screen,
}: Props) {
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[
          styles.image,
          { width: size, height: size, borderRadius: rounded, backgroundColor },
        ]}
        resizeMode={resizeMode}
      />
    );
  }

  return (
    <View
      style={[
        styles.placeholder,
        { width: size, height: size, borderRadius: rounded, backgroundColor },
      ]}>
      <Text style={styles.placeholderText}>{label.slice(0, 1).toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.screen,
  },
  placeholder: {
    backgroundColor: colors.screen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textMuted,
  },
});
