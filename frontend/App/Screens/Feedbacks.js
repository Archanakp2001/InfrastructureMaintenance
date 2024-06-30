import React, {useEffect, useState} from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { API_ROOT } from '../../apiroot';
import MiniTitle from '../Components/MiniTitle';

import styles from '../Utils/styles';
import Colors from '../Utils/Colors';


const Feedbacks = () => {

  const navigation = useNavigation();
  const onIconClick = () => {
    navigation.goBack();
  }

  // ---------------------- fetch feedbacks -----------------------
  const [feedbacks, setFeedbacks] = useState([]);
  const isFocused = useIsFocused(); // Hook to check if the screen is focused

  const fetchFeedbacks = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(API_ROOT + '/api/feedbacks/?user_specific=false', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.data && Array.isArray(response.data.results)) {
        // Reverse the order of issues array to show recent issues first
        const reversedFeeds = response.data.results.reverse();
        setFeedbacks(reversedFeeds);
        console.log(reversedFeeds);

      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching issues:", error.message || error);
    }
  };

useEffect (() => {
  fetchFeedbacks();
}, [isFocused]); // Fetch data when the screen is focused or refreshed
  
  return (
    <View style={styles.mainContainer}>

      <KeyboardAwareScrollView
        contentContainerStyle={styles.miniContainer}
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false} >
      
        {/* ---------------------- Title ------------------- */}
        <MiniTitle title='Feedbacks' navigateTo={onIconClick}/>


        {/* ------------------- Feedbacks ------------------ */}

        <ScrollView>
        <View style={{alignItems: 'center', marginTop: 20, marginBottom: 40}}>
          {feedbacks.map((feedback, index) => (
            <View key={index} style={[styles.feedbacks, {marginBottom: 20}]}>
              <Text style={{textAlign: 'right', color: Colors.PRIMARY}}>{new Date(feedback.created_at).toLocaleDateString()}</Text>
              <Text style={[{ fontSize: 15 }]}>{feedback.content}</Text>
            </View>
          ))}
        </View>
        </ScrollView>

      </KeyboardAwareScrollView>
      

    </View>
  );
};

export default Feedbacks;