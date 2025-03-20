// THIS FUNCTION HANDLES THE KEYBOARD INPUT
import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableHighlight } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';

// Keyboard Component
function Keyboard({ onSubmit, wordLength }) {
  // State to record and display the current guess
  const [input, setInput] = useState("");

  // Function to handle key presses
  const handleKeyPress = (key) => {
    if (input.length < wordLength) {
      setInput(input + key);
    }
  };

  // Function to handle backspace press
  const handleBackspacePress = () => {
    setInput(input.slice(0, -1));
  };

  // Function to handle submit press
  const handleSubmitPress = () => {
    if (input.length === wordLength) {
      onSubmit(input);
      setInput("");
    }
  };

  return (
    // Main container for the keyboard component
    <View style={styles.container}>
      {/* Display the current input */}
      <View style={styles.currentInputContainer}>
        {Array.from({ length: wordLength }).map((_, index) => (
          <Text key={index} style={styles.letter}>
            {input[index] || " "}
          </Text>
        ))}
      </View>
      {/* Row for backspace and enter keys */}
      <View style={styles.functionKeyRow}>
        <TouchableHighlight
          style={[styles.button, styles.functionKey, { backgroundColor: 'red' }]}
          onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          onPress={handleBackspacePress}
        >
          <Ionicons name="backspace-outline" size={24} color="black" />
        </TouchableHighlight>
        <TouchableHighlight
          style={[styles.button, styles.functionKey, { backgroundColor: '#32CD32' }]}
          onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          onPress={handleSubmitPress}
        >
          <Ionicons name="checkmark" size={24} color="black" />
        </TouchableHighlight>
      </View>
      {/* Render the main keyboard */}
      <View style={styles.keyboardContainer}>
        {/* First row of keys */}
        <View style={styles.row}>
          {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map((key) => (
            <TouchableHighlight
              key={key}
              style={styles.button}
              onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              onPress={() => handleKeyPress(key)}
            >
              <Text style={styles.text}>{key}</Text>
            </TouchableHighlight>
          ))}
        </View>
        {/* Second row of keys */}
        <View style={styles.row}>
          <View style={[styles.button, { backgroundColor: 'white', flex: 0.5, borderWidth: 0 }]} />
          {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map((key) => (
            <TouchableHighlight
              key={key}
              style={styles.button}
              onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              onPress={() => handleKeyPress(key)}
            >
              <Text style={styles.text}>{key}</Text>
            </TouchableHighlight>
          ))}
          <View style={[styles.button, { backgroundColor: 'white', flex: 0.5, borderWidth: 0 }]} />
        </View>
        {/* Third row of keys */}
        <View style={styles.row}>
          <View style={[styles.button, { backgroundColor: 'white', flex: 1.5, borderWidth: 0 }]} />
          {['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map((key) => (
            <TouchableHighlight
              key={key}
              style={styles.button}
              onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              onPress={() => handleKeyPress(key)}
            >
              <Text style={styles.text}>{key}</Text>
            </TouchableHighlight>
          ))}
          <View style={[styles.button, { backgroundColor: 'white', flex: 1.5, borderWidth: 0 }]} />
        </View>
      </View>
    </View>
  );
}

// Styles for the Keyboard component
const styles = StyleSheet.create({
  container: {
    flex: 1, // Full height
    flexDirection: 'column', // Arrange items in a column
    width: '100%', // Full width
    alignSelf: 'flex-end', // Align to the end
    padding: 5, // Padding around the content
    alignContent: 'center', // Center content horizontally
  },
  currentInputContainer: {
    flex: 1, // Take up one part of the height
    flexDirection: 'row', // Arrange items in a row
    justifyContent: 'center', // Center content vertically
    alignContent: 'center', // Center content horizontally
  },
  functionKeyRow: {
    flexDirection: 'row', // Arrange items in a row
    justifyContent: 'space-evenly', // Space between items
    alignItems: 'center', // Center content vertically
    marginBottom: 10, // Margin below the row
  },
  keyboardContainer: {
    flex: 3, // Take up three parts of the height
    padding: 5, // Padding around the content
  },
  row: {
    flexDirection: 'row', // Arrange items in a row
    flex: 1, // Take up one part of the height
    width: '100%', // Full width
  },
  button: {
    flex: 1, // Take up available space
    backgroundColor: 'yellow', // Yellow background color
    margin: 1, // Margin around each button
    padding: 1, // Padding inside each button
    borderRadius: 20, // Rounded corners
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    borderWidth: 1, // Border width
  },
  functionKey: {
    width: 50, // Width for function keys
    height: 50, // Height for function keys
    backgroundColor: 'gray', // Gray background color for function keys
  },
  text: {
    fontSize: 30, // Font size for text
  },
  letter: {
    fontSize: 24, // Font size for letters
    marginHorizontal: 5, // Horizontal margin
    textAlign: 'center', // Center align text
    color: 'grey', // Grey text color
  },
  previous: {
    color: 'black', // Black text color
    fontSize: 10, // Font size for previous guesses
  },
});

export default Keyboard; // Export the Keyboard component as the default export