import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/theme';

const MAX_HEIGHT = 500;

type Props = {
  text: string;
};

export function ProductDescription({ text }: Props) {
  return (
    <View style={styles.block}>
      <Text style={styles.sectionTitle}>Опис товару</Text>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled
        showsVerticalScrollIndicator>
        <Text style={styles.description}>{text}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textOnDark,
    marginBottom: 8,
  },
  scroll: {
    maxHeight: MAX_HEIGHT,
  },
  scrollContent: {
    paddingBottom: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textOnDarkMuted,
  },
});
