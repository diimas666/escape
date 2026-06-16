import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../constants/theme';
import { CartScreen } from '../screens/CartScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { CategoriesStackNavigator } from './CategoriesStackNavigator';
import { HomeScreen } from '../screens/HomeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { tabItems } from './tabConfig';
import type { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

const screenComponents = {
  Home: HomeScreen,
  Categories: CategoriesStackNavigator,
  Cart: CartScreen,
  Favorites: FavoritesScreen,
  Profile: ProfileScreen,
} as const;

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        lazy: true,
        freezeOnBlur: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginBottom: 4,
        },
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 0,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 72,
          paddingTop: 8,
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const tab = tabItems.find(item => item.name === route.name);
          const iconName = tab
            ? focused
              ? tab.icons.active
              : tab.icons.inactive
            : 'ellipse-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}>
      {tabItems.map(tab => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={screenComponents[tab.name]}
          options={{ tabBarLabel: tab.label }}
        />
      ))}
    </Tab.Navigator>
  );
}
