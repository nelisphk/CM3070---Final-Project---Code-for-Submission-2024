// LOADING SCREEN

import { View, StyleSheet, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "REDACTED",
  authDomain: "REDACTED",
  projectId: "REDACTED",
  storageBucket: "REDACTED",
  messagingSenderId: "REDACTED",
  appId: "REDACTED",
  measurementId: "REDACTED",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fetch and store daily words offline
const fetchAndStoreDailyWordsOffline = async () => {
  try {
    const dailyWordSnapshot = await getDocs(collection(db, 'daily_word'));
    const dailyWords = [];

    dailyWordSnapshot.forEach((doc) => {
      const wordData = { ...doc.data(), played: false, score: 0 };
      dailyWords.push(wordData);
    });

    await AsyncStorage.setItem('daily_words', JSON.stringify(dailyWords));
  } catch (error) {
    console.error('Error fetching or storing daily words: ', error);
  }
};

// Check for new daily words and add them to the offline database
const updateOfflineDailyWords = async () => {
	try {
		const storedWords = await AsyncStorage.getItem('daily_words');
		const offlineWords = storedWords ? JSON.parse(storedWords) : [];
		const newList = []
		var dailyWordSnapshot = await getDocs(collection(db, 'daily_word'));

		dailyWordSnapshot.forEach((word) => {
			const wordData = word.data();
			const searchResult = (offlineWords.find((element) => element.date === wordData.date))
			var newWord = {}
			if(searchResult) {
				newWord = {...wordData, played: searchResult.played, score: searchResult.score};
				newList.push(newWord);
			}
			if(!searchResult) {
				console.log("LOADING SCREEN - New Word Added: ")
				newWord = {...wordData, played: false, score: 0}
				console.log(newWord);
				newList.push(newWord);
			}
		})

		await AsyncStorage.setItem('daily_words', JSON.stringify(newList));
  } catch (error) {
    console.error('Error updating offline daily words:', error);
  }
};

function LoadingScreen() {
  // State variables to manage loading state and loading error
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState("");
  const router = useRouter();

  // useEffect to start loading conditions when the component mounts
  useEffect(() => {
    console.log("LOADING SCREEN - Starting Loading Check");
    loadingConditions();
  }, []);

  // Function to check loading conditions and update user data accordingly
  const loadingConditions = async () => {
    try {
      // Check internet connection status
      const netInfo = await NetInfo.fetch();
      console.log("LOADING SCREEN - Internet Connection Status: ", netInfo.isConnected);

      // Fetch user ID from AsyncStorage
      const user_id = await AsyncStorage.getItem('user_id');
      if (user_id) {
        console.log("LOADING SCREEN - Offline Username Status: ", user_id);
      } else {
        console.log("LOADING SCREEN - Offline Username Status: No User_ID Exists");
      }

      // Device connected to the internet
      if (netInfo.isConnected) {
        if (user_id) {
          // Update the database and user information
          console.log("LOADING SCREEN - Checking for Database Updates");
          await updateOfflineDailyWords();
          console.log("LOADING SCREEN - Checking for Database Updates: Completed");

          console.log("LOADING SCREEN - Updating User Information on Firestore Database");
          try {
            const userRef = doc(db, 'users', user_id);
            setDoc(userRef, { last_login: serverTimestamp() });
            console.log("LOADING SCREEN - Updating User Information on Firestore Database: Completed");
          } catch (error) {
            console.error("LOADING SCREEN - Updating User Information on Firestore Database: ERROR - ", error);
          }
          console.log("LOADING SCREEN - Loading Check Completed: REDIRECTING");
          router.replace('/(tabs)/');
        } else {
          // Create a new user and update AsyncStorage and leaderboard
          console.log("LOADING SCREEN - No User Found on Device. Creating New User");
          const newUserRef = await addDoc(collection(db, 'users'), {
            last_login: new Date(),
          });
          console.log("LOADING SCREEN - New User Added in Firestore Database: ", newUserRef.id);

          await AsyncStorage.setItem('user_id', newUserRef.id);
          const user_id = await AsyncStorage.getItem('user_id');
          console.log("LOADING SCREEN - New User Created on Device: ", user_id);

          var leaderboard = await AsyncStorage.getItem('leaderboard');
          if (leaderboard) {
            console.log("LOADING SCREEN - Leaderboard Exists");
          } else {
            console.log("LOADING SCREEN - Creating Leaderboard");
            const lbTemplate = JSON.stringify([
              { user_id: user_id, name: "Me" },
              { user_id: "TESTUSER1", name: "Tester 1" },
              { user_id: "TESTUSER2", name: "Tester 2" },
              { user_id: "TESTUSER3", name: "Tester 3" },
            ]);
            await AsyncStorage.setItem('leaderboard', lbTemplate);
            leaderboard = await AsyncStorage.getItem('leaderboard');
            if (leaderboard) {
              console.log("LOADING SCREEN - Creating Leaderboard - DONE");
            }
          }

          // Download the database
          console.log("LOADING SCREEN - Downloading Database");
          await fetchAndStoreDailyWordsOffline();
          console.log("LOADING SCREEN - Downloading Database: Completed");

          console.log("LOADING SCREEN - Loading Check Completed: REDIRECTING");
          router.replace('/(tabs)/');
        }
      } else {
        // Device not connected to the internet
        if (user_id) {
          console.log("LOADING SCREEN - Loading Check Completed: REDIRECTING (OFFLINE MODE)");
          router.replace('/(tabs)/');
        } else {
          console.log("LOADING SCREEN - Not Connected, No User - need to restart");
          Alert.alert("ERROR", "Please check device connection and restart the application.");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    // SafeAreaView to ensure the content is within the safe area boundaries
    <SafeAreaView style={styles.container}>
      {/* Container for the logo image */}
      <View style={styles.imageContainer}>
        <Image source={require('@/assets/images/logo.png')} style={styles.image} contentFit='contain' />
      </View>
      {/* Container for the loading indicator */}
      <View style={styles.loadingIndicatorContainer}>
        <ActivityIndicator size="large" color="#0000ff"/>
      </View>
    </SafeAreaView>
  );
}

// Styles for the LoadingScreen component
const styles = StyleSheet.create({
  container: {
    flex: 1, // Takes up the full screen height
    backgroundColor: 'white', // White background color
    flexDirection: 'column', // Arrange children in a column
  },
  imageContainer: {
    flex: 1, // Takes up the remaining space
    alignContent: 'center', // Center content horizontally
    justifyContent: 'flex-end', // Align content to the bottom
  },
  image: {
    width: 400, // Width of the image
    height: 120, // Height of the image
		alignSelf: 'center',
  },
  loadingIndicatorContainer: {
    flex: 1, // Takes up the remaining space
    alignContent: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
  }
});

export default LoadingScreen; // Export the LoadingScreen component as the default export