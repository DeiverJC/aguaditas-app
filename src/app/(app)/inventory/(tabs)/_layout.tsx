import type { MaterialTopTabNavigationOptions } from '@react-navigation/material-top-tabs';
import {
  createMaterialTopTabNavigator,

} from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  any,
  any
>(Navigator);

export default function InventoryLayout() {
  return (
    <MaterialTopTabs
      screenOptions={{
        tabBarActiveTintColor: '#0077FF',
        tabBarInactiveTintColor: '#A3A3A3',
        tabBarIndicatorStyle: { backgroundColor: '#0077FF', height: 3 },
        tabBarLabelStyle: { fontSize: 14, fontWeight: '600', textTransform: 'none' },
        tabBarStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#E5E5E5',
        },
      }}
    >
      <MaterialTopTabs.Screen
        name="index"
        options={{ title: 'Productos' }}
      />
      <MaterialTopTabs.Screen
        name="adjustments"
        options={{ title: 'Ajustes' }}
      />
    </MaterialTopTabs>
  );
}
