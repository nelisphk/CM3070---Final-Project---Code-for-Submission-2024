// Runs the Settings Page

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchUserDoc } from '../components/DatabaseFunctions';
import * as Updates from "expo-updates";
import { useFocusEffect } from 'expo-router';

// Main Settings Component
function Settings() {
  // State variables to hold leaderboard data, user ID, new user name, and new user ID
  const [leaderboard, setLeaderboard] = useState([]);
  const [userId, setUserId] = useState('');
	const [newUserName, setNewUserName] = useState('');
  const [newUserId, setNewUserId] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	// Fetch the initial data
	const fetchData = async () => {
		// Fetch user ID from AsyncStorage and update the userId state
		const myUserId = await AsyncStorage.getItem('user_id');

		// Fetch leaderboard data from AsyncStorage
		const storedLeaderboard = await AsyncStorage.getItem('leaderboard');

		setLeaderboard(storedLeaderboard ? JSON.parse(storedLeaderboard) : []);
		setUserId(myUserId);
	};

  // Remove a user from the leaderboard
  const handleRemoveUser = (item) => {
		const toUpdate = leaderboard.filter(user => user.user_id !== item.user_id);
		setLeaderboard(toUpdate);
		AsyncStorage.setItem('leaderboard', JSON.stringify(toUpdate));
  };

  // Edit a user's name in the leaderboard
  const handleEditUserName = (item) => {
		var newUser = item
		// Prompt the user to enter a new name
    Alert.prompt('Enter new name:', null, (newName) => {
      if (newName) {
				console.log(newName);
				var toUpdate = leaderboard;
				console.log(toUpdate);
				const index = leaderboard.findIndex(user => user.user_id == item.user_id)
				console.log(index);
				toUpdate[index].name = newName;
				console.log(toUpdate);
				setLeaderboard(toUpdate);
				AsyncStorage.setItem('leaderboard', JSON.stringify(toUpdate));
      }
		})
  }

  // Add a new user to the leaderboard
  const handleAddUser = async () => {
			setIsLoading(true)
			try {
				var exist = await fetchUserDoc(newUserId);
				if(!exist) {
					Alert.alert('Error', 'User ID does not exist in the database.');
				} else if (exist) {
					console.log("HJE")
					const checkcopy = leaderboard.filter(user => user.user_id === newUserId)
					if (checkcopy.length !== 0) {
						console.log("EXIST ", checkcopy)
						Alert.alert('Error', 'User ID already added to the leaderboard.');
					} else if (checkcopy.length === 0) {
					console.log("EXIST ", checkcopy)
					const newAdd = {name: newUserName, user_id: newUserId};
					var toUpdate = leaderboard;
					toUpdate.push(newAdd);
					setLeaderboard(toUpdate);
					console.log(leaderboard);
					AsyncStorage.setItem('leaderboard', JSON.stringify(toUpdate));
					}
				}
			} catch (error) {
				console.error('Error adding user:', error);
			} finally {
				setIsLoading(false);
				setNewUserId('');
				setNewUserName('');
			}
    };

  // Copy the user ID to the clipboard
  const handleCopyToClipboard = async () => {
    // Copy the userId state value to the clipboard
    await Clipboard.setStringAsync(userId);
    // Show an alert to indicate that the user ID has been copied to the clipboard
    Alert.alert('Copied to Clipboard', 'User ID has been copied to the clipboard.');
  };

  // Reset the app by clearing AsyncStorage
  const handleResetApp = () => {
    // Show a confirmation alert before resetting the app
    Alert.alert(
      'Reset App',
      'Are you sure you want to reset the app? This will clear all data.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: async () => {
          // Clear all data in AsyncStorage
          await AsyncStorage.clear();
					// Restart the App
					Updates.reloadAsync()
        }}
      ]
    );
  };

  // Check if the Add button should be disabled
  const isAddButtonDisabled = !newUserName || !newUserId || isLoading;

  // Render a single item in the leaderboard
  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userId}>{item.user_id}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleRemoveUser(item)}>
          <Ionicons name="trash-outline" size={24} color="red" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleEditUserName(item)}>
          <Ionicons name="pencil" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );

	// useFocusEffect to fetch data when the screen is focused
	useFocusEffect(
		useCallback(() => {
			fetchData();
			return () => {
			};
		})
	);

  return (
    // Container View for the Settings page
    <View style={styles.container}>
      {/* Header for user details */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>User Details</Text>
      </View>
      {/* User details section */}
      <View style={[styles.userDetailsContainer, styles.specialRow]}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Me</Text>
          <Text style={styles.userId}>ID: {userId}</Text>
        </View>
        <TouchableOpacity onPress={handleCopyToClipboard}>
          <Ionicons name="copy-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
			
      {/* List of leaderboard users */}
      <FlatList
        data={leaderboard.filter(item => item.name !== 'Me')}
        keyExtractor={item => item.user_id}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContainer}
				ListHeaderComponent={
					<View style={styles.headerContainer}>
						<Text style={styles.header}>Leaderboard Settings</Text>
					</View>
				}
        ListFooterComponent={
          <View>
            <View style={styles.addRow}>
              <TextInput
                style={styles.input}
                value={newUserName}
                onChangeText={setNewUserName}
                placeholder="Choose Alias"
              />
              <TextInput
                style={styles.input}
                value={newUserId}
                onChangeText={setNewUserId}
                placeholder="Enter ID"
              />
              <TouchableOpacity 
                onPress={handleAddUser} 
                style={[styles.addButton, isAddButtonDisabled && styles.disabledButton]}
                disabled={isAddButtonDisabled}
              >
								{isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.addButtonText}>+</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        }
      />
      {/* Reset app button */}
      <TouchableOpacity 
        onPress={handleResetApp} 
        style={styles.resetButton}
      >
        <Text style={styles.resetButtonText}>Reset App</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Takes up the full screen height
    paddingHorizontal: 20, // Padding on the sides
    paddingBottom: 20, // Padding at the bottom
    backgroundColor: '#fff', // White background color
  },
  headerContainer: {
    backgroundColor: '#0000ff', // Blue background color
    borderTopLeftRadius: 20, // Rounded corners
		borderTopRightRadius: 20, // Rounded corners
    paddingVertical: 5, // Vertical padding
    paddingHorizontal: 20, // Horizontal padding
    marginTop: 10, // Margin at the top
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
		width: '100%', // Full width
  },
  header: {
    fontSize: 20, // Font size for the header text
    color: 'white', // Color for the header text
  },
  userDetailsContainer: {
    flexDirection: 'row', // Display items in a row
    justifyContent: 'space-between', // Space between items
    alignItems: 'center', // Center items vertically
    padding: 15, // Padding inside the container
    backgroundColor: '#32CD32', // Green background color
    borderBottomLeftRadius: 10, // Rounded corners
		borderBottomRightRadius: 10, // Bottom right rounded corner
    marginBottom: 10, // Margin at the bottom
  },
  flatListContainer: {
    borderBottomLeftRadius: 10, // Rounded corners for outer border
		borderBottomRightRadius: 10, // Rounded corners for outer border
		borderBottomWidth: 1, // Border width
    borderColor: 'black', // Border color
    overflow: 'hidden', // Ensure content doesn't overflow the border
  },
  row: {
    flexDirection: 'row', // Display items in a row
    justifyContent: 'space-between', // Space between items
    alignItems: 'center', // Center items vertically
    padding: 15, // Padding inside the row
    borderBottomWidth: 1, // Bottom border width
    borderBottomColor: 'black', // Bottom border color
    backgroundColor: 'yellow', // Background color for the row
  },
  userInfo: {
    flex: 1, // Take up available space
  },
  userName: {
    fontWeight: 'bold', // Bold font weight
    fontSize: 16, // Font size for the user name
  },
  userId: {
    fontSize: 12, // Font size for the user ID
    color: '#666', // Color for the user ID text
  },
  actions: {
    flexDirection: 'row', // Display actions in a row
    justifyContent: 'space-between', // Space between actions
    width: 60, // Width of the actions container
  },
  input: {
    flex: 1, // Take up available space
    borderWidth: 1, // Border width
    borderColor: '#ccc', // Border color
    borderRadius: 5, // Rounded corners
    padding: 10, // Padding inside the input field
    marginRight: 10, // Margin to the right
  },
  addButton: {
    backgroundColor: '#0000ff', // Blue background color
    padding: 5, // Padding inside the button
		width: 40,
		height: 40,
		justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    borderRadius: 10, // Rounded corners
  },
  disabledButton: {
    backgroundColor: '#cccccc', // Grey background color for disabled button
  },
  addButtonText: {
    color: '#fff', // White text color
    fontWeight: 'bold', // Bold font weight
		alignSelf: 'center',
  },
  addRow: {
    flexDirection: 'row', // Display items in a row
    alignItems: 'center', // Center items vertically
    margin: 10, // Margin around the row
  },
  specialRow: {
    backgroundColor: '#32CD32', // Green background color for special row
  },
  resetButton: {
    backgroundColor: 'red', // Red background color
    borderRadius: 20, // Rounded corners
    padding: 15, // Padding inside the button
    alignItems: 'center', // Center content horizontally
    margin: 20, // Margin around the button
    alignSelf: 'center', // Center content
  },
  resetButtonText: {
    color: '#fff', // White text color
    fontWeight: 'bold', // Bold font weight
    fontSize: 16, // Font size for the text
  },
});

export default Settings;
