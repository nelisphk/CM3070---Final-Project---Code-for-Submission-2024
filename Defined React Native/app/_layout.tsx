// The main navigation router

import { Stack } from 'expo-router';
import { NavigationContainer } from '@react-navigation/native';

// RootLayout Component to define the navigation structure
function RootLayout() {
  return (
    // NavigationContainer to manage the navigation state
    <NavigationContainer>
      {/* Stack Navigator to manage the stack of screens */}
      <Stack>
        {/* Screen  for the index route with header hidden */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        
        {/* Screen for the tabs route with header hidden */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* Screen for the daily route with header hidden, href null, and gestures disabled */}
        <Stack.Screen name="daily" options={{ headerShown: false, href: null, gestureEnabled: false }} />
        
        {/* Screen for the playedResults route with header hidden, href null, and gestures disabled */}
        <Stack.Screen name="playedResults" options={{ headerShown: false, href: null, gestureEnabled: false }} /> 
        
        {/* Screen for the not-found route */}
        <Stack.Screen name="+not-found" />
      </Stack>
    </NavigationContainer>
  );
}

export default RootLayout; // Export the RootLayout component as the default export
