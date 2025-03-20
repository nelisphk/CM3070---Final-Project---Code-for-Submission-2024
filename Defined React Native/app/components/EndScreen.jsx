import React from 'react';
import { View, Text, Button, StyleSheet, Share, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router'; 
import ResultsCalculator from './ResultsCalculator.tsx';
import { RFPercentage } from "react-native-responsive-fontsize";
import Ionicons from '@expo/vector-icons/Ionicons';
import { UpdateAsyncPostGame, UpdateFirestorePostGame } from './DatabaseFunctions.tsx';

// EndScreen Component to display the game results and handle sharing
const EndScreen = ({ win, timeRemaining, word, today }) => {
  const gameWord = JSON.parse(word); // Parse the word parameter
  const result = ResultsCalculator(timeRemaining); // Calculate the result based on the time remaining
  
  // Handle share button press
  const handleShare = async () => {
    const message = `defined (${gameWord.date})\n\n${result}`;
    try {
      await Share.share({ message });
    } catch (error) {
      alert('Error sharing the result');
    }
  };

  // Update local and Firestore databases if the game hasn't been played yet
  if (!gameWord.played) {
    UpdateAsyncPostGame(timeRemaining, gameWord);
    if (today) {
      UpdateFirestorePostGame(timeRemaining, gameWord);
    }
  }

  return (
    // Container View for the EndScreen component
    <View style={styles.container}>
      {/* Close button */}
      <View style={styles.closeContainer}>
        <Link href={"/(tabs)/"}>
          <Ionicons name="close" size={50} color="black" />
        </Link>
      </View>

      {/* Logo image */}
      <View style={styles.imageContainer}>
        <Image source={require('@/assets/images/logo.png')} resizeMode='contain' style={styles.image} />
      </View>

      {/* Content container */}
      <View style={styles.contentContainer}>
        {/* Message indicating whether the player won or lost */}
        <View style={styles.messageContainer}>
          <Text style={styles.message}>
            {win ? 'You did it!' : 'Too bad!'}
          </Text>
        </View>

        {/* Definition of the word */}
        <View style={styles.definitionContainer}>
          <Text style={styles.definition}>"{decodeURIComponent(gameWord.definition)}."</Text>
        </View>

        {/* Type of the word */}
        <View style={styles.typeContainer}>
          <Text style={styles.type}>{decodeURIComponent(gameWord.type)}</Text>
        </View>

        {/* The word itself */}
        <View style={styles.wordContainer}>
          <Text style={styles.word}>{decodeURIComponent(gameWord.word)}</Text>
        </View>

        {/* Results including time remaining and calculated result */}
        <View style={styles.resultsContainer}>
          <Text style={styles.result}>{decodeURIComponent(timeRemaining)} Seconds Remaining</Text>
          <Text>{result}</Text>
        </View>

        {/* Share button */}
        <View style={styles.shareContainer}>
          <TouchableOpacity onPress={handleShare}>
            <Ionicons name="share-outline" size={50} color="black" />
            <Text style={styles.share}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Styles for the EndScreen component
const styles = StyleSheet.create({
  container: {
    width: '100%', // Full width
    height: '100%', // Full height
    position: 'relative', // Position relative to parent
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  closeContainer: {
    top: 0, // Position at the top
    position: 'absolute', // Position absolute
    width: '100%', // Full width
    alignItems: 'flex-end', // Align content to the end (right)
    zIndex: 1, // Ensure it is on top of other elements
    paddingRight: 10, // Padding to the right
  },
  imageContainer: {
    position: 'absolute', // Position absolute
    top: 10, // Position at the top with some padding
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    width: '100%', // Full width
    height: '20%', // 20% of the height
    zIndex: -1, // Ensure it is behind other elements
  },
  contentContainer: {
    position: 'absolute', // Position absolute
    bottom: 0, // Position at the bottom
    height: '80%', // 80% of the height
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    backgroundColor: 'white', // White background color
    padding: 10, // Padding around the content
  },
  messageContainer: {
    flex: 1, // Takes up one part of the height
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    width: '100%', // Full width
  },
  definitionContainer: {
    flex: 2, // Takes up two parts of the height
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    width: '100%', // Full width
  },
  typeContainer: {
    flex: 1, // Takes up one part of the height
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    width: '100%', // Full width
  },
  wordContainer: {
    flex: 3, // Takes up three parts of the height
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    width: '100%', // Full width
  },
  resultsContainer: {
    flex: 1, // Takes up one part of the height
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    width: '100%', // Full width
  },
  shareContainer: {
    flex: 3, // Takes up three parts of the height
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    width: '100%', // Full width
  },
  image: {
    width: '50%', // 50% of the width
    height: '100%', // Full height
  },
  message: {
    fontSize: RFPercentage(5), // Responsive font size
    fontWeight: 'bold', // Bold font weight
  },
  definition: {
    fontSize: RFPercentage(2), // Responsive font size
    textAlign: 'center', // Center align text
    padding: 5, // Padding around the text
  },
  type: {
    fontSize: RFPercentage(2), // Responsive font size
    fontWeight: 'bold', // Bold font weight
  },
  word: {
    fontSize: RFPercentage(8), // Responsive font size
    fontWeight: 'bold', // Bold font weight
  },
  result: {
    fontSize: RFPercentage(2), // Responsive font size
  },
  share: {
    textAlign: 'center', // Center align text
  },
});

export default EndScreen; // Export the EndScreen component as the default export