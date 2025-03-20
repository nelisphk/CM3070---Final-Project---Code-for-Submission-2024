// Runs the leaderboard page

import React, { useState, useCallback } from 'react';
import { Text, View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { createUserEntryinLeaderboard } from '../components/DatabaseFunctions';

function Leaderboard() {
  // State variables to hold leaderboard data and loading state
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  // useFocusEffect to fetch data when the screen is focused
  useFocusEffect(
    useCallback(() => {
			console.log('LEADERBOARD SCREEEN - Focussed');
      const fetchData = async () => {
        try {
          setLoading(true); // Set loading state to true while fetching data
          
          // Fetch leaderboard data from AsyncStorage
          const storedLeaderboard = await AsyncStorage.getItem('leaderboard');
          const leaderboard = storedLeaderboard ? JSON.parse(storedLeaderboard) : [];

          // Create user entries in the leaderboard
          const results = await Promise.all(leaderboard.map(createUserEntryinLeaderboard));
          setLeaderboardData(results); // Update state with fetched data
        } catch (error) {
          console.error('Error fetching leaderboard data: ', error); // Log errors if any
        } finally {
          setLoading(false); // Set loading state to false once data fetching is complete
        }
      };

      fetchData();

      return () => {
        console.log('LEADERBOARD SCREEEN - Unocussed');
      };
    }, []) // The empty dependency array ensures this effect only runs when the screen focuses/unfocuses
  );

  // Render a single item in the leaderboard
  const renderItem = ({ item, index, type }) => {
    const filteredData = leaderboardData.filter(item => item[type] !== 100).sort((a, b) => b[type] - a[type]);
    const isLastItem = index === filteredData.length - 1;
    const rowStyle = item.name === "Me" ? styles.specialRow : styles.row;

    return (
      <View style={[rowStyle, isLastItem && styles.lastItemRow]}>
        <Text style={styles.rank}>{index + 1}</Text>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles[type]}>{Math.round(item[type])}s</Text>
        <Text style={styles[`${type}Picture`]}>{item[`${type}Picture`]}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      // Loading indicator while data is being fetched
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    // Container View for the leaderboard page
    <View style={styles.container}>
      {/* Map through 'today' and 'average' to render leaderboard sections */}
      {['today', 'average'].map(type => (
        <React.Fragment key={type}>
          <FlatList
            data={leaderboardData.filter(item => item[type] !== 100).sort((a, b) => b[type] - a[type])}
            keyExtractor={item => item.user_id}
            ListHeaderComponent={
							<View>
								<View style={styles.headerContainer}>
									<Text style={styles.header}>{type === 'today' ? "Today's Results" : 'All Time Average'}</Text>
								</View>
								<View style={styles.headerRow}>
									<Text style={styles.headerCell}>Player</Text>
									<Text style={styles.headerCell}>Score</Text>
								</View>
							</View>
            }
            renderItem={({ item, index }) => renderItem({ item, index, type })}
            contentContainerStyle={styles.flatListContainer}
          />
        </React.Fragment>
      ))}
    </View>
  );
}

// Styles for the various components
const styles = StyleSheet.create({
  container: {
    flex: 1, // Takes up the full screen height
    paddingHorizontal: 20, // Padding on the sides
    paddingBottom: 20, // Padding at the bottom
    backgroundColor: '#fff', // White background color
  },
  headerContainer: {
    backgroundColor: '#0000ff', // Blue background color
    borderTopLeftRadius: 20, // Top left rounded corner
    borderTopRightRadius: 20, // Top right rounded corner
    paddingHorizontal: 20, // Horizontal padding
    paddingVertical: 5, // Vertical padding
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
    width: '100%', // Full width
  },
  flatListContainer: {
    borderColor: 'black', // Border color
    overflow: 'hidden', // Ensure content doesn't overflow the border
    width: '100%', // Full width
		marginTop: 10, // Add margin above the flatlist
  },
  lastItemRow: {
    borderBottomWidth: 0, // Remove bottom border for the last item
    borderBottomLeftRadius: 10, // Bottom left rounded corner
    borderBottomRightRadius: 10, // Bottom right rounded corner
  },
  header: {
    fontSize: 20, // Font size for the header text
    color: 'white', // Color for the header text
  },
  row: {
    flexDirection: 'row', // Display items in a row
    padding: 15, // Padding inside the row
    borderBottomWidth: 1, // Bottom border width
    borderBottomColor: 'black', // Bottom border color
    backgroundColor: 'yellow', // Background color for the row
  },
  specialRow: {
    flexDirection: 'row', // Display items in a row
    padding: 15, // Padding inside the row
    borderBottomWidth: 1, // Bottom border width
    borderBottomColor: 'black', // Bottom border color
    backgroundColor: '#32CD32', // Background color for special row
  },
  rank: {
    fontWeight: 'bold', // Bold font weight
    marginRight: 10, // Margin to the right
    width: 10, // Width of the rank text
    textAlign: 'center', // Center align text
  },
  name: {
    flex: 1, // Take up available space
    fontWeight: 'bold', // Bold font weight
    textAlign: 'left', // Align text to the left
  },
  today: {
    flex: 1, // Take up available space
    textAlign: 'right', // Align text to the right
  },
  todayPicture: {
    flex: 2, // Take up available space
    textAlign: 'right', // Align text to the right
  },
  average: {
    flex: 1, // Take up available space
    textAlign: 'right', // Align text to the right
  },
  averagePicture: {
    flex: 2, // Take up available space
    textAlign: 'right', // Align text to the right
  },
  loadingContainer: {
    flex: 1, // Take up the full screen height
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    backgroundColor: 'white', // White background color
  },
  headerRow: {
    flexDirection: 'row', // Display items in a row
    backgroundColor: '#ddd', // Background color for header row
    padding: 5, // Padding inside the header row
    paddingLeft: 30, // Left padding
  },
  headerCell: {
    flex: 1, // Take up available space
    fontWeight: 'bold', // Bold font weight
    textAlign: 'left', // Align text to the left
  },
});

export default Leaderboard; // Export the Leaderboard component as the default export