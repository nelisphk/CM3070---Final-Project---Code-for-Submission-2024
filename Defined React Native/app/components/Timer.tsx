import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Timer Component to display the remaining time with a fill bar
const Timer = ({ timeRemaining }) => {
  // Calculate the fill width as a percentage of the total time (60 seconds)
  const fillWidth = (60 - timeRemaining) / 60 * 100;

  return (
    // Container for the timer
    <View style={styles.timerContainer}>
      {/* Fill bar to indicate the remaining time */}
      <View style={[styles.fill, { width: `${fillWidth}%` }]} />
      {/* Display the remaining time */}
      <Text style={styles.timerText}>{timeRemaining}s</Text>
    </View>
  );
};

// Styles for the Timer component
const styles = StyleSheet.create({
  timerContainer: {
    width: '75%', // 75% of the parent width
    height: '50%', // 50% of the parent height
    borderRadius: 50, // Rounded corners
    borderWidth: 2, // Border width
    borderColor: 'black', // Border color
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    overflow: 'hidden', // Ensure content doesn't overflow the container
    position: 'relative', // Position relative to parent
    backgroundColor: '#32CD32', // Background color
  },
  fill: {
    position: 'absolute', // Position absolute
    left: 0, // Align to the left
    top: 0, // Align to the top
    bottom: 0, // Align to the bottom
    backgroundColor: 'red', // Red fill color
    zIndex: -1, // Ensure it is behind other elements
  },
  timerText: {
    color: 'white', // White text color
    fontSize: 20, // Font size for text
    fontWeight: 'bold', // Bold font weight
    zIndex: 1, // Ensure it is on top of other elements
  },
});

export default Timer; // Export the Timer component as the default export