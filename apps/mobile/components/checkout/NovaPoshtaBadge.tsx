import { Image, StyleSheet, Text, View } from 'react-native';

const NP_LOGO_URI =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Nova_Poshta_2014_logo.svg/240px-Nova_Poshta_2014_logo.svg.png';

export function NovaPoshtaBadge() {
  return (
    <View style={styles.wrap}>
      <Image
        source={{ uri: NP_LOGO_URI }}
        style={styles.image}
        resizeMode="contain"
        defaultSource={undefined}
      />
      <Text style={styles.fallback} accessibilityElementsHidden>
        НП
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#DA291C',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: 34,
    height: 34,
    position: 'absolute',
  },
  fallback: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    opacity: 0,
  },
});
