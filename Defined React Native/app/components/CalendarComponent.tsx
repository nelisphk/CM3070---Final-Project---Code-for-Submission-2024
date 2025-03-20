import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router'; 
import { useFocusEffect } from 'expo-router';

// Main CalendarComponent
function CalendarComponent() {
  // State variable to manage marked dates on the calendar
  const [markedDates, setMarkedDates] = useState({});

  // useEffect to fetch word data when the component mounts
  useEffect(() => {
    fetchWordData();
  }, []);

		// useFocusEffect is used to run a function when the screen comes into focus
		useFocusEffect(
			useCallback(() => {
				console.log('CALENDAR SCREEN - Component Focused');
				fetchWordData();
	
				return () => {
					console.log('CALENDAR SCREEN - Component Unfocused');
				};
			}, []) // The empty dependency array ensures this effect only runs when the screen focuses/unfocuses
		);

  // Fetch word data from AsyncStorage and set marked dates
  const fetchWordData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('daily_words');
      const dailyWords = jsonValue != null ? JSON.parse(jsonValue) : [];

      const newMarkedDates = {};
      dailyWords.forEach(({ date, played }) => {
        newMarkedDates[date] = {
          marked: true,
          dotColor: played ? '#32CD32' : 'yellow',
          customStyles: {
            container: { backgroundColor: played ? '#32CD32' : 'yellow' },
            text: { color: played ? 'white' : 'black', fontWeight: played ? 'bold' : 'normal' }
          },
          onPress: () => handleDatePress(date),
        };
      });
      setMarkedDates(newMarkedDates);
    } catch (e) {
      console.error(e);
    }
  };

  // Initialize router
  const router = useRouter();
  
  // Handle date press event
  const handleDatePress = (date) => {
    const wordActual = async () => {
      try {
        const storedWords = await AsyncStorage.getItem('daily_words');
        const offlineWords = storedWords ? JSON.parse(storedWords) : [];
        const wordForToday = offlineWords.find(words => words.date === date);  
        const todaysWord = JSON.stringify(wordForToday);
        console.log(`CALENDAR SCREEN - Word: ${wordForToday.word}, Date: ${wordForToday.date}`);

        if (wordForToday.played) {
          // Navigate to playedResults if the word has been played
          router.push(`../playedResults?word=${encodeURIComponent(todaysWord)}`);
        } else {
          // Navigate to daily if the word has not been played
          router.push(`../daily?word=${encodeURIComponent(todaysWord)}&daily=false`);
        }
      } catch (error) {
        console.error('Error checking todays word again: ', error);
      }
    };
    wordActual();
  };

  return (
    // Container View for the CalendarComponent
    <View style={styles.container}>
      {/* Calendar View */}
      <View style={styles.CalendarContainer}>
        <Calendar
          markingType={'custom'}
          markedDates={markedDates}
          onDayPress={(day) => {
            const { dateString } = day;
            if (markedDates[dateString]?.onPress) {
              markedDates[dateString].onPress();
            }
          }}
          renderDay={(day) => {
            const { dateString } = day;
            const mark = markedDates[dateString];
            if (mark) {
              return (
                <Pressable onPress={mark.onPress}>
                  <View style={mark.customStyles.container}>
                    <Text style={mark.customStyles.text}>{day.day}</Text>
                  </View>
                </Pressable>
              );
            } else {
              return <Text>{day.day}</Text>;
            }
          }}
        />
      </View>
      {/* Legend View */}
      <View style={styles.LegendContainer}>
        <View style={styles.legendItem}>
          <View style={styles.yellowCircle} />
          <Text style={styles.legendText}>Game not attempted</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.greenCircle} />
          <Text style={styles.legendText}>Game attempted</Text>
        </View>
      </View>
    </View>
  );
}

// Styles for the CalendarComponent
const styles = StyleSheet.create({
  container: {
    flex: 1, // Takes up the full screen height
    backgroundColor: 'white', // White background color
    width: '100%', // Full width
  },
  CalendarContainer: {
    flex: 2, // Takes up two parts of the screen height
    backgroundColor: 'white', // White background color
  },
  LegendContainer: {
    flex: 1, // Takes up one part of the screen height
    backgroundColor: 'white', // White background color
    justifyContent: 'center', // Center content vertically
		alignContent: 'center',
    width: "60%", // 60% of the screen width
    alignSelf: "center", // Center content horizontally
  },
  legendItem: {
		alignSelf: 'center',
    flexDirection: 'row', // Arrange items in a row
    alignItems: 'center', // Center items vertically
    marginVertical: 5, // Vertical margin
  },
  greenCircle: {
    width: 30, // Width of the green circle
    height: 30, // Height of the green circle
    borderRadius: 15, // Rounded corners
    backgroundColor: "#32CD32", // Green background color
    marginRight: 10, // Margin to the right
  },
  yellowCircle: {
    width: 30, // Width of the red circle
    height: 30, // Height of the red circle
    borderRadius: 15, // Rounded corners
    backgroundColor: "yellow", // Yellow background color
    marginRight: 10, // Margin to the right
  },
  legendText: {
    fontSize: 16, // Font size for the legend text
  },
});

export default CalendarComponent; // Export the CalendarComponent as the default export