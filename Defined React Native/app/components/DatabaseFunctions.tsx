// Helper functions for the Firebase Database
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, getDocs, getAggregateFromServer, average, doc, getDoc } from "firebase/firestore";
import ResultsCalculator from '../components/ResultsCalculator';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAdERRxlu-sn9N8PHDKd-LSIzBhCmq0FJM",
  authDomain: "defined-f7c68.firebaseapp.com",
  projectId: "defined-f7c68",
  storageBucket: "defined-f7c68.firebasestorage.app",
  messagingSenderId: "724576820049",
  appId: "1:724576820049:web:c652c4a6a9a3db4db45170",
  measurementId: "G-22TQZPTT55",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// This function updates the Async Storage Word List after a game is played.
export async function UpdateAsyncPostGame(timeRemaining, word) {
  try {
    console.log('DB FUNCTION - UpdateAsyncPostGame - Updating local DB with results.');

    // Update the entry for the word to include the game stats
    const updatedPlayedWord = { ...word, played: true, score: timeRemaining };

    // Find the word in the local database and update the local DB
    const storedWords = await AsyncStorage.getItem('daily_words');
    const offlineWords = storedWords ? JSON.parse(storedWords) : [];
    const wordForToday = offlineWords.find(word => word.date === updatedPlayedWord.date);
    const indexOf = offlineWords.indexOf(wordForToday);
    offlineWords[indexOf] = updatedPlayedWord;
    await AsyncStorage.setItem('daily_words', JSON.stringify(offlineWords));

    console.log("FUNCTION UpdateAsyncPostGame - Updating local DB with results - COMPLETED.");
  } catch (error) {
    console.error('Error Updating Async (function: UpdateAsyncPostGame): ', error);
  }
}

// This function updates the Firebase Database after a game is played
export async function UpdateFirestorePostGame(timeRemaining, word) {
  try {
    console.log("DB FUNCTION - UpdateFirestorePostGame - Updating Firestore DB with results.");

    const user_id = await AsyncStorage.getItem('user_id');
    await addDoc(collection(db, 'games_played'), {
      date_played: new Date().toISOString().split('T')[0],
      user_id: user_id,
      word_date: word.date,
      score: timeRemaining,
    });

    console.log("FUNCTION UpdateFirestorePostGame - Updating Firestore DB with results - COMPLETED.");
  } catch (error) {
    console.error('Error Updating Firestore (function: UpdateFirestorePostGame): ', error);
  }
}

// This function returns the score of today's game (if it has been played) for a specific user
export async function getTodaysScore(userID) {
  const today = new Date().toISOString().split('T')[0];
  try {
    const q = query(
      collection(db, 'games_played'),
      where('user_id', '==', userID),
      where('date_played', '==', today)
    );
    const snapshot = await getDocs(q);
    const entries = snapshot.docs.map(doc => doc.data());

    if (entries.length > 0) {
      return entries[0].score;
    } else {
      return 100; // Indicates that the game has not been played
    }
  } catch (error) {
    console.error('Error retrieving entries from Firestore: ', error);
  }
}

// This function returns the average scores for a specific user
export async function getAverageScore(userID) {
  try {
    const q = query(
      collection(db, 'games_played'),
      where('user_id', '==', userID)
    );
    const snapshot = await getAggregateFromServer(q, { averageScore: average('score') });

    if (snapshot.data().averageScore) {
      return snapshot.data().averageScore;
    } else {
      return 100; // Return 100 if data not available
    }
  } catch (error) {
    console.error('Error retrieving entries from Firestore: ', error);
  }
}

// This function adds an entry in the leaderboard
export async function createUserEntryinLeaderboard(user) {
  try {
    const today = await getTodaysScore(user.user_id);
    const average = await getAverageScore(user.user_id);
    const todayPicture = ResultsCalculator(today);
    const averagePicture = ResultsCalculator(average);

    return { ...user, today, todayPicture, average, averagePicture };
  } catch (error) {
    console.error(`User ${user.user_id} failed to get information - ${error}`);
  }
}

// This function checks if a user exists in Firebase
export async function fetchUserDoc(userId) {
  const userDoc = doc(db, 'users', userId);
  const userDocSnapshot = await getDoc(userDoc);
  return userDocSnapshot.exists();
}