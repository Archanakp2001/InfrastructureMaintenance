// Popup.js
import React from 'react';
import { View, Modal, Text, TouchableOpacity, Image, StyleSheet, Pressable, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import closeButton from './../../assets/images/closeButton.png';
import Camera from './../../assets/images/camera.png';
import Gallery from './../../assets/images/gallery.png';
import Colors from '../Utils/Colors';

const OpenCameraOrLibrary = ({ isVisible, onClose, setImageUri  }) => {

  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert("Permission Denied", "You've refused to allow this app to access your camera!");
        return;
      }

      console.log("launching camera");
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      console.log(result)

      if (!result.canceled) {
        console.log("Image URI:", result.assets[0].uri);
        setImageUri(result.assets[0].uri); // Note: use result.assets[0].uri for the captured image URI
        onClose();
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong while trying to open the camera.");
    }
  }

  const openGallery = async () => {
    // No permissions request is necessary for launching the image library
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      console.log("Image URI:", result.assets[0].uri);
      setImageUri(result.assets[0].uri); // Note: use result.assets[0].uri for the captured image URI
      onClose();
    }
  }catch (error) {
    console.error(error);
    Alert.alert("Error", "Something went wrong while trying to open the gallery.");
  }
  };

  return (
    
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={style.modalContainer}>

        {/* --------- close button ---------- */}
        <TouchableOpacity onPress={onClose}>
            <Image style={style.closeButton} source={closeButton}/>
        </TouchableOpacity>

        {/* ------------- window --------------- */}
        <View style={style.modalContent}>
          
          <View style={style.categoryContainer}>

            <Pressable onPress={openCamera}>
                <View style={style.category}>
                    <View style={style.categoryIcon}><Image style={[{height: 60},{width:60}]} source={Camera}/></View>
                    <Text style={style.categoryText}>Launch Camera</Text>
                </View>
            </Pressable>
            <Pressable onPress={openGallery}>
                <View style={style.category}>
                    <View style={style.categoryIcon}><Image style={[{height: 60},{width:60}]} source={Gallery}/></View>
                    <Text style={style.categoryText}>Launch Gallery</Text>
                </View>
            </Pressable>
            
          </View>
        </View>

      </View>
    </Modal>
  );
};

const style = StyleSheet.create({

    modalContainer: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButton: {
        marginBottom: 8,
    },
    modalContent: {
        backgroundColor: Colors.BACKGROUND,
        height: 220,
        width: 320, 
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        elevation: 10
    },
    categoryContainer: {
        marginTop: 20,
        flexDirection: 'row',
        gap: 30,
    },
    category: {
        alignItems: 'center'
    },
    categoryIcon: {
        width: 100,
        height: 100,
        borderWidth: 0.2,
        borderColor: '#CFCFCF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryText: {
        marginTop: 6,
        color: Colors.TEXT,
    },

});
export default OpenCameraOrLibrary;
