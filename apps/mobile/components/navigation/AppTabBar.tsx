import { CommonActions, useNavigation } from '@react-navigation/native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/theme';
import { tabItems } from '../../navigation/tabConfig';
import type { TabParamList } from '../../navigation/types';

type Props = {
  activeTab?: keyof TabParamList;
};

export function AppTabBar({ activeTab }: Props) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const navigateTo = (screen: keyof TabParamList) => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'MainTabs',
        params: { screen },
      }),
    );
  };

  return (
    <View
      style={[
        styles.bar,
        { paddingBottom: Math.max(insets.bottom, 8) },
      ]}>
      {tabItems.map(tab => {
        const focused = activeTab === tab.name;
        const iconName = focused ? tab.icons.active : tab.icons.inactive;
        const color = focused ? colors.primary : colors.textMuted;

        return (
          <Pressable
            key={tab.name}
            accessibilityRole="button"
            accessibilityLabel={tab.label}
            onPress={() => navigateTo(tab.name)}
            style={({ pressed }) => [styles.tab, pressed && styles.pressed]}>
            <Ionicons name={iconName} size={24} color={color} />
            <Text style={[styles.label, { color }]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    minHeight: 72,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
  },
  pressed: {
    opacity: 0.75,
  },
});
