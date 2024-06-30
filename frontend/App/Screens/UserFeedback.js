import React, {useEffect, useState} from 'react';
import { View, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import MiniTitle from '../Components/MiniTitle';
import NewFeedback from '../Components/NewFeedback';

import styles from '../Utils/styles';
import Colors from '../Utils/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROOT } from '../../apiroot';

const UserFeedback = () => {

  const navigation = useNavigation();
  const onIconClick = () => {
    navigation.goBack();
  }

  // --------------- New feedback popup --------------------
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const onNewFeedback = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  // ---------------------- fetch feedbacks -----------------------
  const [feedbacks, setFeedbacks] = useState([]);
  const isFocused = useIsFocused(); // Hook to check if the screen is focused

  const fetchFeedbacks = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(API_ROOT + '/api/feedbacks/?user_specific=true', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.data && Array.isArray(response.data.results)) {
        // Reverse the order of issues array to show recent issues first
        const reversedFeeds = response.data.results.reverse();
        setFeedbacks(reversedFeeds);

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


// ----------------- refresh the feedback ----------------
const [refreshing, setRefreshing] = useState(false);
const onRefresh = () => {
  setRefreshing(true);
  fetchFeedbacks().finally(() => setRefreshing(false));
};
  
  return (
    <View style={styles.mainContainer}>

      <KeyboardAwareScrollView
        contentContainerStyle={styles.miniContainer}
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false} 
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} >
      
        {/* ---------------------- Title ------------------- */}
        <MiniTitle title='Feedbacks' navigateTo={onIconClick}/>


        {/* ----------------- New button ------------------ */}
        <TouchableOpacity onPress={onNewFeedback} style={[{alignItems: 'center'}]}>
          <View style={[styles.button, {width: 360, marginTop: 40}]}>
            <Text style={[styles.buttonText, {letterSpacing: 2, fontSize: 18}]}>+ New</Text>
          </View>
        </TouchableOpacity>
        <NewFeedback isVisible={isPopupVisible} onClose={onNewFeedback} />


        {/* ------------------- Feedbacks ------------------ */}
        <View style={[{alignItems: 'center', marginTop: 30}]}>
          {feedbacks.map((feedback, index) => (
            <View key={index} style={styles.feedbacks}>
              <Text style={{textAlign: 'right', color: Colors.PRIMARY}}>{new Date(feedback.created_at).toLocaleDateString()}</Text>
              <Text style={[{ fontSize: 15 }]}>{feedback.content}</Text>
            </View>
          ))}
        </View>

      </KeyboardAwareScrollView>
      

    </View>
  );
};

export default UserFeedback;