import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Colors from '../Utils/Colors';

const AutoComplete = () => {
  return (
    <View style={[{position: 'absolute', top: 0, zIndex: 1, flex: 0.5, paddingLeft: 30, marginTop: 50, }]}>
      <GooglePlacesAutocomplete
        placeholder="Search Location..."
        onPress={(data, details = null) => {
          console.log('Selected Place:', data, details);
          // Handle selected place (e.g., update state, fetch details, etc.)
        }}
        query={{
          key: 'AIzaSyAmp0ero6e6ZEUkodpzaNEwlmGZ7Kvi1Bk',
          language: 'en', // Optional: language preference
        }}
        styles={{
            textInputContainer: {
                width: 330,
                height: 40,
                borderRadius: 12,
                paddingLeft: 5,
                backgroundColor: Colors.WHITE,
                elevation: 5,
                flexDirection:'row', 
                overflow: 'hidden'
            },
            textInput: {
              marginLeft: 0,
              marginRight: 0,
              height: 38,
              color: '#5d5d5d',
              fontSize: 14,
            },
            predefinedPlacesDescription: {
              color: '#1faadb',
            },
          }}
        // currentLocation={true}
        // currentLocationLabel="Current location"
      />
    </View>
  );
};


export default AutoComplete;
