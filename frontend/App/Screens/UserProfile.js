import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ToastAndroid } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ProfileCard from '../Components/ProfileCard';
import forward from '../../assets/images/forward.png';
import styles from '../Utils/styles';
import MainTitle from '../Components/MainTitle';
import { API_ROOT } from '../../apiroot';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import Colors from '../Utils/Colors';


const UserProfile = () => {

  const navigation = useNavigation();
  const onEditClick = () => {
    navigation.navigate('UserEditProfile')
  }
  const onFeedbackClick = () => {
    navigation.navigate('UserFeedback')
  }
  const onFaqClick = () => {
    navigation.navigate('UserFaqs')
  }
  const onSettingsClick = () => {
    navigation.navigate('UserSettings')
  }
  const onAboutClick = () => {
    navigation.navigate('About')
  }


  // ----------------------- get username -------------------------
  const [username, setUsername] = useState('');
  const isFocused = useIsFocused(); // Hook to check if the screen is focused
  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(API_ROOT + '/user-profile/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.data && response.data.username) {
        setUsername(response.data.username);
      } else {
        console.error("Unexpected response format:", response.data);
      }
      
    } catch (error) {
      console.error("Error fetching username:", error.message || error);
    }
  };

  useEffect (() => {
    fetchUser();
  }, [isFocused]); // Fetch data when the screen is focused or refreshed


  // ----------------- Logout -----------------------
  const onLogOut = async () => {
    try {
      await AsyncStorage.removeItem('token');
      console.log("Logged out successfully");
      navigation.navigate('SignInScreen', { resetUserPassword: true });
      ToastAndroid.show('Logged out succesfully', ToastAndroid.SHORT)
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <View style={styles.mainContainer}>
      
      {/* ----------------- Title ------------------ */}
      {/* <View>
        <Text style={styles.mainHead}>Archana</Text>
        <View style={styles.mainLine} />
      </View> */}
      <MainTitle title={username}/>


      {/* ---------------- Features ----------------- */}
      <View style={styles.cards}>

            <ProfileCard title="Edit Profile" icon={forward} navigateTo={onEditClick} />
            <ProfileCard title="Feedbacks" icon={forward} navigateTo={onFeedbackClick} />
            <ProfileCard title="FAQs" icon={forward} navigateTo={onFaqClick} />
            <ProfileCard title="Settings" icon={forward} navigateTo={onSettingsClick} />
            <ProfileCard title="About" icon={forward} navigateTo={onAboutClick} />

      </View>


      {/* --------------- Log out button ---------------- */}
      <TouchableOpacity onPress={onLogOut} style={[{alignItems: 'center'}]}>
        <View style={[styles.button, {width: 350, marginTop: 120, backgroundColor: Colors.BACKGROUND, borderColor: Colors.PRIMARY, borderWidth:1}]}>
          <Text style={[styles.buttonText, {letterSpacing: 1, color: Colors.PRIMARY}]}>Log Out</Text>
        </View>
      </TouchableOpacity>


      
    </View>
  );
};

export default UserProfile;