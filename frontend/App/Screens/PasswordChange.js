import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';

import backward from './../../assets/images/backward.png';
import styles from '../Utils/styles';
import MiniTitle from '../Components/MiniTitle';
import { API_ROOT } from '../../apiroot';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const PasswordChange = () => {

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();

  const onIconClick = () => {
    navigation.goBack()
  }

  // --------------------- handle save button --------------------------
  const onSave = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
        Alert.alert('Error', 'Please fill in all the fields');
        return;
    }
    if (newPassword !== confirmPassword) {
        Alert.alert('Error', 'New password and Confirm password do not match');
        return;
    }
    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be atleast 8 characters');
      return;
    }

    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            Alert.alert('Error', 'Authentication token not found');
            return;
        }

        const response = await axios.post(
            `${API_ROOT}/api/password/change/`,
            {
                old_password: oldPassword,
                new_password: newPassword,
                confirm_password: confirmPassword  // Include confirm_password
            },
            {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.status === 200) {
            Alert.alert('Success', 'Password updated successfully');
            navigation.navigate('UserEditProfile');
        } else {
            Alert.alert('Error', response.data.error || 'Failed to update password');
        }
    } catch (error) {
        Alert.alert('Error', error.message || 'An error occurred');
        console.error('Error updating password:', error);
    }
};


  return (
    <KeyboardAwareScrollView
    contentContainerStyle={styles.miniContainer}
    resetScrollToCoords={{ x: 0, y: 0 }}
    scrollEnabled={true}
    showsVerticalScrollIndicator={false} >

      <View style={styles.mainContainer}>
        
        {/* ---------------------- Title ------------------- */}
        <MiniTitle title='Change Password' navigateTo={onIconClick}/>


        {/* -------------------- Edit fields ------------------- */}
        <View style={[{alignItems: 'center', marginTop: 30}]}>
          <TextInput 
            placeholder='Old Password' 
            style={styles.editInput} 
            value={oldPassword}
            onChangeText={setOldPassword}
          />
          <TextInput 
            placeholder='New Password' 
            style={styles.editInput}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput 
            placeholder='Confirm Password' 
            style={styles.editInput}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>


        {/* ------------------- Save button --------------------- */}
        <TouchableOpacity onPress={onSave} style={[{alignItems: 'center', marginTop: 20}]}>
          <View style={[styles.button, {width: 350, marginTop: 20}]}>
            <Text style={[styles.buttonText, {letterSpacing: 2, fontSize: 18, }]}>SAVE</Text>
          </View>
        </TouchableOpacity>

      </View>

    </KeyboardAwareScrollView>
  );
};

export default PasswordChange;