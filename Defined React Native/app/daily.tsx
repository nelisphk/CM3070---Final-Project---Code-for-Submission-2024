// Logic and styling for the actual gameplay page

import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import CountdownTimer from './components/CountdownTimer';
import Keyboard from './components/Keyboard';
import EndScreen from './components/EndScreen';
import Timer from './components/Timer';
import { RFPercentage } from "react-native-responsive-fontsize";

// Main Game Component
function Game() {
  // Get the word and today parameters from the local search parameters
  const { word, today } = useLocalSearchParams();
  // Parse the word parameter to get the gameWord object
  const gameWord = JSON.parse(word);

  // State variables to manage the game state
  const [showCountdown, setShowCountdown] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameTime, setGameTime] = useState(60);
  const [correctGuesses, setCorrectGuesses] = useState(Array(gameWord.word.length).fill("_"));
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  // useEffect to manage the game timer
  useEffect(() => {
    let timer;
    if (gameStarted && !gameOver) {
      timer = setInterval(() => {
        setGameTime(prevTime => {
          if (prevTime > 1) {
            return prevTime - 1;
          } else {
            clearInterval(timer);
            setGameOver(true);
            return 0;
          }
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, gameOver]);

  // Handle the countdown complete event
  const handleCountdownComplete = () => {
    setShowCountdown(false);
    setGameStarted(true);
  };

  // Handle word submission from the keyboard
  const handleWordSubmit = (input) => {
    const updatedGuesses = correctGuesses.map((letter, index) => 
      input[index] === gameWord.word[index] ? gameWord.word[index] : letter
    );
    setCorrectGuesses(updatedGuesses);

    if (updatedGuesses.join("") === gameWord.word) {
      setWin(true);
      setGameOver(true);
    }
  };

  // Render the current state of the word
  const renderWord = () => {
    return correctGuesses.map((letter, index) => (
      <Text key={index} style={styles.letter}>
        {letter}
      </Text>
    ));
  };

  return (
    // SafeAreaView to ensure the content is within the safe area boundaries
    <SafeAreaView style={styles.container}>
      {showCountdown ? (
        // Render the countdown timer if the countdown is not complete
        <CountdownTimer onCountdownComplete={handleCountdownComplete} />
      ) : (
        <>
          {!gameOver ? (
            // Render the game screen if the game is not over
            <>
              {gameStarted && (
                <View style={styles.gameTimerContainer}>
                  <Timer timeRemaining={gameTime} />
                </View>
              )}
              <View style={styles.definitionContainer}>
                <Text style={styles.definition}>"{decodeURIComponent(gameWord.definition)}."</Text>
              </View>
              <View style={styles.typeContainer}>
                <Text style={styles.type}>{decodeURIComponent(gameWord.type)}</Text>
              </View>
              <View style={styles.wordContainer}>
                {renderWord()}
              </View>
              <View style={styles.keyboardContainer}>
                <Keyboard onSubmit={handleWordSubmit} wordLength={gameWord.word.length}/>
              </View>
            </>
          ) : (
            // Render the end screen if the game is over
            <EndScreen win={win} timeRemaining={gameTime} word={word} today={today} />
          )}
        </>
      )}
    </SafeAreaView>
  );
}

// Styles for the Game component
const styles = StyleSheet.create({
  container: {
    flex: 1, // Takes up the full screen height
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    backgroundColor: 'white', // White background color
    padding: 10, // Padding around the content
  },
  gameTimerContainer: {
    flex: 1, // Takes up one part of the screen height
    width: '100%', // Full width
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
  },
  definitionContainer: {
    flex: 1, // Takes up one part of the screen height
    padding: 10, // Padding inside the container
    width: '100%', // Full width
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
  },
  typeContainer: {
    flex: 1, // Takes up one part of the screen height
    width: '100%', // Full width
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
  },
  wordContainer: {
    flex: 2, // Takes up two parts of the screen height
    width: '100%', // Full width
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
    flexDirection: 'row', // Arrange letters in a row
  },
  keyboardContainer: {
    flex: 4, // Takes up four parts of the screen height
    width: '100%', // Full width
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
  },
  gameTimer: {
    fontSize: 24, // Font size for the game timer
  },
  definition: {
    fontSize: RFPercentage(2), // Responsive font size
    textAlign: 'center', // Center align text
  },
  type: {
    fontSize: RFPercentage(2), // Responsive font size
    fontWeight: 'bold', // Bold font weight
    textAlign: 'center', // Center align text
  },
  letter: {
    fontSize: RFPercentage(5), // Responsive font size
    marginHorizontal: 5, // Horizontal margin
  },
  keyboard: {
    height: "100%", // Full height for the keyboard
  },
});

export default Game; // Export the Game component as the default export