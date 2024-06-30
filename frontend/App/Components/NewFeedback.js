import React, { useState } from 'react';
import { View, Modal, Text, TextInput, TouchableOpacity, Image, Button, Alert } from 'react-native';

import styles from '../Utils/styles';

import closeButton from './../../assets/images/closeButton.png';
import { useNavigation } from '@react-navigation/native';
import Colors from '../Utils/Colors';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ROOT } from '../../apiroot';

const NewFeedback = ({ isVisible, onClose }) => {

    const [content, setContent] = useState('');
    const navigation = useNavigation();
    
    const onSubmit = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log(token);

        // const formData = new FormData();
        // formData.append('content', content);
        console.log('Submitting feedback');

        const response = await axios.post(API_ROOT + '/api/feedbacks/', {content}, {
          headers: {
            Authorization: `Token ${token}`,
            // 'Content-Type': 'multipart/form-data',
          }
        });
        Alert.alert('Feedback submitted')
        console.log('Feedback submitted', response.data)
    
        navigation.navigate('UserFeedback')
        onClose();
      } catch(error) {
            console.error('Error submitting feedback:', error.message);
            if (error.response) {
                console.error('Response status:', error.response.status);
                console.error('Response data:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Request setup error:', error.message);
            }
      }
    };
  

    return (
      
      <Modal
        animationType="fade"
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
          <View style={[styles.modalContent, {width: 360, height: 360}]}>
            <View>
                <TextInput style={styles.newFeed} placeholder='Share your feedbacks ...' multiline={true} numberOfLines={10} textAlignVertical="top" value={content} onChangeText={setContent}/>
            </View>

            <TouchableOpacity onPress={onSubmit} style={[{alignItems: 'center'}]}>
                <View style={[{width: 320, borderWidth: 1, borderColor: Colors.PRIMARY, marginTop: 30, height: 50, borderRadius: 15, justifyContent: 'center'}]}>
                    <Text style={[styles.buttonText, {letterSpacing: 2, fontSize: 18, color: Colors.PRIMARY}]}>SUBMIT</Text>
                </View>
            </TouchableOpacity>
            
          </View>
  
        </View>
      </Modal>
    );
  };
  
  
export default NewFeedback;
  