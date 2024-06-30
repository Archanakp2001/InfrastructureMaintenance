// Popup.js
import React from 'react';
import { View, Modal, Text, TouchableOpacity, Image, Button, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from '../Utils/styles';
import closeButton from './../../assets/images/closeButton.png';
import Colors from '../Utils/Colors';

const AboutApp = ({ isVisible, onClose }) => {
  const navigation = useNavigation();

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
        <View style={style.modalContent}>
          <Text style={style.modalHead}>About App</Text>
          
          <ScrollView>
            
            <Text style={style.modalText}>
            PaveGuard is an Infrastructure Maintenance App that allows citizens to report road damage and navigate easily. 
            There is an option for users to report issues.
            The user may also provide a brief description of the problem, such as potholes, cracks, or road debris. 
            The report is confirmed once it has been submitted, and the authority may contact the user with an update on the status of the repair.
            </Text>


          </ScrollView>
          
        </View>

      </View>
    </Modal>
  );
};


const style = StyleSheet.create({
    modalContent: {
        height: 650, 
        width: 380,
        backgroundColor: Colors.BACKGROUND, 
        elevation: 3,
        borderRadius: 15,
        marginTop: 10,
        paddingVertical: 20,
        paddingHorizontal: 15
    },
    modalHead: {
        color: Colors.PRIMARY, 
        fontSize: 16, 
        fontWeight: '500',
        borderBottomColor: Colors.BORDER,
        borderBottomWidth: 0.4,
        width: '90%',
        textAlign: 'center',
        paddingBottom: 10,
        alignSelf: 'center',
        marginBottom: 35
    },
    modalText: {
        color: Colors.TEXT,
        textAlign: 'justify',
        lineHeight: 22
    }, 
    
});


export default AboutApp;
