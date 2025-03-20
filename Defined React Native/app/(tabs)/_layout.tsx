// This file runs the router for the navigation bar. 
// Works from the (tabs) route on the main directory _index file.
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

function TabLayout() {
  return (
      <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
        <Tabs.Screen name="index" options={{ 
          title: 'Home', 
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),
          }} />
        <Tabs.Screen name="calendar" options={{ 
          title: 'Calendar', 
					headerTintColor: 'white',
					headerStyle: {
						backgroundColor: 'blue'
					},
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'calendar-sharp' : 'calendar-outline'} color={color} size={24} />
          ),
          }} />
        <Tabs.Screen name="leaderboard" options={{ 
          title: 'Leaderboard',
					headerTintColor: 'white',
					headerStyle: {
						backgroundColor: 'blue'
					},
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'trophy-sharp' : 'trophy-outline'} color={color} size={24} />
          ),
          }} />
        <Tabs.Screen name="settings" options={{ 
          title: 'Settings',
					headerTintColor: 'white',
					headerStyle: {
						backgroundColor: 'blue'
					},
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'settings-sharp' : 'settings-outline'} color={color} size={24} />
          ),
          }} />
      </Tabs>
  );
}

export default TabLayout;