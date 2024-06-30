import React, {useState} from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import MiniTitle from '../Components/MiniTitle';
import styles from '../Utils/styles';
import Colors from '../Utils/Colors';
import Faqs from '../Components/Faqs';

const UserFaqs = () => {

  const navigation = useNavigation();
  const onIconClick = () => {
    navigation.goBack();
  }

  return (
    
    <View style={styles.mainContainer}>
      
      {/* ---------------------- Title ------------------- */}
      <MiniTitle title='FAQs' navigateTo={onIconClick}/>


      {/* --------------------- FAQs --------------------- */}
      <View style={{marginTop: 20}}>

      <Faqs title='What is PaveGuard App?' description='PaveGuard App is an Infrastructure Maintenance App designed for the maintenance of infrastructure facilities like road, bridge, drain, etc.' />
      <Faqs title='How can we use this App?' description='It allows the user to upload images of road damage and bridge damage to the app and upload them to the app for review by the authorities.'/>
        



      </View>

    </View>

  );
};

export default UserFaqs;