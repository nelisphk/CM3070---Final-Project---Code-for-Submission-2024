// Main page that users will see.

import React, { useEffect, useState, useCallback } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useFocusEffect } from 'expo-router'; 
import { Image } from 'expo-image';
import { format } from 'date-fns';
import ResultsCalculator from '../components/ResultsCalculator';

function Index() {
  // State variables to hold today's word and button enabled state
  const [todaysWord, setTodaysWord] = useState(null);
  const [buttonEnabled, setButtonEnabled] = useState(false);
	const [message, setMessage] = useState("");
  
  // Get today's date in ISO format and formatted string
  const today = new Date().toISOString().split('T')[0];
  const formattedDate = format(new Date(), "EEEE d MMMM yyyy");

  // Initialize Expo router
  const router = useRouter();

  // Handle play button press event
  const handlePlayPress = () => {
    const checkPlayed = JSON.parse(todaysWord);
    if (checkPlayed.played) {
      // Navigate to played results page
      router.push(`../playedResults?word=${encodeURIComponent(todaysWord)}`);
    } else if (todaysWord) {
      // Navigate to daily page
      router.push(`../daily?word=${encodeURIComponent(todaysWord)}&today=true`);
    } else {
      console.log('Todays word not found');
    }
  };

  // Check and fetch today's word from AsyncStorage
  const checkTodaysWord = async () => {
    try {
      const storedWords = await AsyncStorage.getItem('daily_words');
      const offlineWords = storedWords ? JSON.parse(storedWords) : [];
      const wordForToday = offlineWords.find(word => word.date === today);
      console.log(`HOME SCREEN - Searching for Today's Word. Date: ${today}`);

      if (wordForToday) {
        const wordString = JSON.stringify(wordForToday);
        setTodaysWord(wordString);
        console.log(`HOME SCREEN - Today's Word Found. Word: ${wordForToday.word}`);
        setButtonEnabled(true);
				if (wordForToday.played){
					const res = ResultsCalculator(wordForToday.score)
					setMessage("Game Already Played\n" + res);
				}
				if (!wordForToday.played){
					setMessage("Play Today's Game");
				}
      } else {
        setButtonEnabled(false);
				setMessage("Today's Game not Available");
      }
    } catch (error) {
      console.error('Error checking todays word: ', error);
    }
  };

	// useFocusEffect is used to run a function when the screen comes into focus
	useFocusEffect(
		useCallback(() => {
			// This function runs when the screen is focused
			console.log('HOME SCREEN - Focussed');
			checkTodaysWord();

			// This function runs when the screen is unfocused
			return () => {
				console.log('HOME SCREEN - Unfocussed');
			};
		}, []) // The empty dependency array ensures this effect only runs when the screen focuses/unfocuses
	);

  return (
    // Container View for the main page
    <View style={styles.container}>
      {/* Image container */}
      <View style={styles.imageContainer}>
        <Image source={require('@/assets/images/logo.png')} style={styles.image} contentFit='contain' />
      </View>

      {/* Content container */}
      <View style={styles.contentContainer}>
        <Text style={styles.dateText}>{formattedDate}</Text>
        <TouchableOpacity
          style={[styles.button, buttonEnabled ? styles.buttonEnabled : styles.buttonDisabled]}
          onPress={handlePlayPress}
          disabled={!buttonEnabled}
        >
          <Text style={styles.buttonText}>{message}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Styles for the various components
const styles = StyleSheet.create({
  container: {
    flex: 1, // Takes up the full screen height
    backgroundColor: 'white', // White background color
  },
  imageContainer: {
    flex: 1, // Takes up the remaining space
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    padding: 50, // Padding around the content
  },
  image: {
    width: 400, // Width of the image
    height: 120, // Height of the image
  },
  contentContainer: {
    flex: 1, // Takes up the remaining space
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  dateText: { 
    fontSize: 30, // Font size for the date text
    marginBottom: 20, // Margin below the date text
  },
  button: {
    padding: 20, // Padding inside the button
    borderRadius: 50, // Rounded corners
    alignItems: 'center', // Center text inside the button
    borderColor: 'black', // Border color
    borderWidth: 1, // Border width
  },
  buttonDisabled: {
    backgroundColor: 'grey', // Background color for disabled button
  },
  buttonEnabled: {
    backgroundColor: 'yellow', // Background color for enabled button
  },
  buttonText: {
    color: "black", // Text color for the button
    fontSize: 16, // Font size for the button text
		textAlign: 'center',
  },
});

export default Index; // Export the Index component as the default export