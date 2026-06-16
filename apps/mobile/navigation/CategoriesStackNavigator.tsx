import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CategoriesScreen } from '../screens/CategoriesScreen';
import { CategoryScreen } from '../screens/CategoryScreen';
import type { CategoriesStackParamList } from './types';

const Stack = createNativeStackNavigator<CategoriesStackParamList>();

export function CategoriesStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        freezeOnBlur: true,
      }}>
      <Stack.Screen name="CategoriesList" component={CategoriesScreen} />
      <Stack.Screen name="Category" component={CategoryScreen} />
    </Stack.Navigator>
  );
}
