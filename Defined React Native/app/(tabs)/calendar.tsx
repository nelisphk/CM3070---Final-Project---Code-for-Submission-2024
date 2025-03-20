// This file runs the layout and access to the calendar page. 
// Just styling and layout.

import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import CalendarComponent from '../components/CalendarComponent';
import { useFocusEffect } from 'expo-router';

function Calendar() {
  // useFocusEffect is used to run a function when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('CALENDAR SCREEN - Focused');

      return () => {
        console.log('CALENDAR SCREEN - Unfocused');
      };
    }, []) // The empty dependency array ensures this effect only runs when the screen focuses/unfocuses
  );

  return (
    // The container View for the CalendarComponent
    <View style={styles.container}>
      <CalendarComponent />
    </View>
  );
}

// Styles for the container View
const styles = StyleSheet.create({
  container: {
    flex: 1, // Makes the container take up the full screen height
    backgroundColor: '#25292e', // Sets the background color to a dark shade
    justifyContent: 'center', // Centers child components vertically
    alignItems: 'center', // Centers child components horizontally
  },
});

export default Calendar; // Export the Calendar component as the default export
