// Popup.js
import React from 'react';
import { View, Modal, Text, TouchableOpacity, Image, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';


import styles from '../Utils/styles';

import User from './../../assets/images/signup_User.png';
import Authority from './../../assets/images/signup_Authority.png';
import closeButton from './../../assets/images/closeButton.png';

const SignupPopup = ({ isVisible, onClose }) => {
  const navigation = useNavigation();

  const onUserSignupClick = () => {
    navigation.navigate('UserSignup');
    onClose();
  }
  const onAuthoSignupClick = () => {
    navigation.navigate('AuthoSignup');
    onClose();
  }

  return (
    
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>

        {/* --------- close button ---------- */}
        <TouchableOpacity onPress={onClose}>
            <Image style={styles.closeButton} source={closeButton}/>
        </TouchableOpacity>

        {/* ------------- window --------------- */}
        <View style={styles.modalContent}>
          <Text style={styles.popupText}>Sign Up as a</Text>
          
          <View style={styles.categoryContainer}>

            <TouchableOpacity onPress={onUserSignupClick}>
                <View style={styles.category}>
                    <View style={styles.categoryIcon}><Image style={[{height: 100},{width:110}]} source={User}/></View>
                    <Text style={styles.categoryText}>User</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={onAuthoSignupClick}>
                <View style={styles.category}>
                    <View style={styles.categoryIcon}><Image style={[{height: 100},{width:100}]} source={Authority}/></View>
                    <Text style={styles.categoryText}>Authority</Text>
                </View>
            </TouchableOpacity>
            
          </View>
        </View>

      </View>
    </Modal>
  );
};


export default SignupPopup;
