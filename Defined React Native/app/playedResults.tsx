import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import EndScreen from './components/EndScreen';

// PlayedResults Component to display the results of the played game
function PlayedResults() {
  // Get the word parameter from the local search parameters
  const { word } = useLocalSearchParams();
  // Parse the word parameter to get the playedWord object
  const playedWord = JSON.parse(word);

  // Determine if the player has won or lost based on the score
  const win = playedWord.score !== 0;

  return (
    // SafeAreaView to ensure the content is within the safe area boundaries
    <SafeAreaView style={styles.container}>
      {/* Render the EndScreen component with the win status, time remaining, and the word */}
      <EndScreen win={win} timeRemaining={playedWord.score} word={word} />
    </SafeAreaView>
  );
}

// Styles for the PlayedResults component
const styles = StyleSheet.create({
  container: {
    flex: 1, // Takes up the full screen height
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    backgroundColor: 'white', // White background color
    padding: 10, // Padding around the content
  },
});

export default PlayedResults; // Export the PlayedResults component as the default export