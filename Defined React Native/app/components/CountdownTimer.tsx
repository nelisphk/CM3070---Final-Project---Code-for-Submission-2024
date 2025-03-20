// THIS FUNCTION HANDLES THE COUNTDOWN TIME BEFORE THE GAME BEGINS
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// CountdownTimer Component
const CountdownTimer = ({ onCountdownComplete }) => {
  // State variable to manage the countdown value
  const [count, setCount] = useState(3);

  // useEffect to handle the countdown logic
  useEffect(() => {
    if (count > 0) {
      // Set a timer to decrease the count every second
      const timer = setTimeout(() => setCount(count - 1), 1000);
      // Clear the timer when the component unmounts or the count changes
      return () => clearTimeout(timer);
    } else {
      // Call the onCountdownComplete callback when the countdown reaches 0
      onCountdownComplete();
    }
  }, [count, onCountdownComplete]);

  return (
    // Container View for the CountdownTimer component
    <View style={styles.container}>
      {/* Display the countdown value */}
      <Text style={styles.text}>{count}</Text>
    </View>
  );
};

// Styles for the CountdownTimer component
const styles = StyleSheet.create({
  container: {
    flex: 1, // Takes up the full screen height
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  text: {
    color: 'black', // Black text color
    fontSize: 200, // Large font size for the countdown text
  },
});

export default CountdownTimer; // Export the CountdownTimer component as the default export