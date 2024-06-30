import React, { useState, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, TextInput, Pressable, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import  * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

import cancel from '../../assets/images/cancel.png';
import place from '../../assets/images/place.png';
import addImage from '../../assets/images/addImage.png';
import road from '../../assets/images/road.png';
import bridge from '../../assets/images/bridge.png';
import drain from '../../assets/images/drain.png';
import tunnel from '../../assets/images/tunnel.png';
import footpath from '../../assets/images/footpath.png';
import others from '../../assets/images/others.png';
import Colors from '../Utils/Colors';
import { API_ROOT } from '../../apiroot';
import { NotificationContext } from '../Contexts/NotificationContext';


const SlideUpView = ({ isVisible, onClose }) => {

  // -------------------- notifications on submitting issue ----------------------
  const { addNotification } = useContext(NotificationContext);


  // -------------------- Launch library for Image --------------------------
  const [imageUris, setImageUris] = useState([null, null, null]); // Array to store image URIs
  const [currentIndex, setCurrentIndex] = useState(null); // To track which Pressable is clicked

  const handlePress = async (index) => {
    if (!imageUris[index]) {
      setCurrentIndex(index);
      await openGallery(index);
    }
  };

  const setImageUri = (uri, index) => {
    const updatedImageUris = [...imageUris];
    updatedImageUris[index] = uri;
    setImageUris(updatedImageUris);
    // togglePopup(); // Close the popup
  };


  // ----------------- post data ------------------
  const [location, setLocation] = useState('')
  const [image, setImage] = useState(null)
  const [selectedOption, setSelectedOption] = useState(null);   //radio button[issue with]
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };
  const [type, setType] = useState('Pothole');      //dropdown[issue type]
  const [description, setDescription] = useState('')


  // ------------------------- Launch gallery for images -----------------------
  const openGallery = async (index) => {
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
      setImageUri(result.assets[0].uri, index); // Note: use result.assets[0].uri for the captured image URI
    }
  }catch (error) {
    console.error(error);
    Alert.alert("Error", "Something went wrong while trying to open the gallery.");
  }
  };

  
  // ------------------------ Submit button --------------------------
  const navigation = useNavigation();

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Token:', token); // Add this line to check the token
      if (!token) {
        console.error('No token found');
        return;
      }

      const formData = new FormData();

      if (imageUris[0]) {
        const imageInfo = await FileSystem.getInfoAsync(imageUris[0]);
        formData.append('image', {
          uri: imageUris[0],
          name: 'photo.jpg',
          type: 'image/jpeg',
        });
      }

      formData.append('location', location);
      formData.append('issue_with', selectedOption);
      formData.append('issue_type', type);
      formData.append('description', description);

      console.log('Submitting complaint data:', formData);

      const response = await axios.post(API_ROOT + '/api/predict_complaint/', formData, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }); 

      const { id, created_at } = response.data;

      // Add the new notification to the context
      addNotification({
        id,
        title: 'New Issue Reported',
        location,
        date: created_at,
        issueId: id,
      });
      
      console.log('Complaint submitted:', response.data);
      navigation.navigate('IssueSummary', {
        issueId: id, 
        issueDate: created_at,
        issueWith: selectedOption,
        issueType: type,
        location: location,
        description: description,
        images: imageUris
        // Add other data as needed
      });
    } catch (error) {
      console.error('Error submitting complaint:', error.response ? error.response.data : error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLocation('');
      setImageUris([null, null, null]);
      setSelectedOption(null);
      setType(null);
      setDescription('');
    }, [])
  );


  return (

    <Modal
      visible={isVisible}
      animationType='slide'
      backdropOpacity={0.5}
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modal}>

        {/* ----------------- Close button ----------------- */}
        <TouchableOpacity onPress={onClose}>
            <Image style={styles.closeButton} source={cancel}/>
        </TouchableOpacity>

        {/* ------------------ Content -------------------- */}

        <View style={styles.container}>
          <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false} >

            {/* ---------- Heading ---------- */}
            <Text style={styles.head}>Report an Issue</Text>

            {/* --------- Content --------- */}
            <View style={styles.content}>

              {/* Location Input */}
              <View style={styles.locationInput}>
                <Image source={place} style={[{marginTop: 14}]}/>
                <TextInput placeholder='Location' multiline={true} style={{width: 300}}value={location} onChangeText={setLocation}/>
              </View>

              {/* Upload image */}
              <View style={[{marginTop: 20}]}>
                <Text style={styles.miniHead}>Upload Images</Text>
                <View style={[{flexDirection: 'row', gap: 15}]}>
                    
                {imageUris.map((imageUri, index) => (
                  <Pressable key={index} style={styles.uploadView} onPress={() => handlePress(index)}>
                    {imageUri ? (
                      <Image source={{ uri: imageUri }} style={styles.selectedImage} value={image} onChangeText={setImage}/>
                    ) : (
                      <Image source={addImage} style={styles.uploadImage} />
                    )}
                  </Pressable>
                ))}
                    
                </View>
              </View>
              <View style={styles.line} />


              {/* Issue with */}
              <View style={[{marginTop: 20}]}>

                <Text style={styles.miniHead}>Issue With</Text>
                <View style={[{marginTop: 10, flexDirection: 'row', gap: 15, flexWrap: 'wrap'}]}>
                  
                  {/* radio1 */}
                  <TouchableOpacity style={[styles.radioButton, selectedOption === 'Road' && styles.selectedRadioButton,]} 
                    onPress={() => handleOptionSelect('Road')}>
                    <Image source={road} style={[{height: 50, width: 50}, selectedOption === 'Road' && styles.selectedRadioButtonImage]}/>
                    <Text style={[styles.radioButtonText, selectedOption === 'Road' && styles.selectedRadioButtonText]}>Road</Text>
                  </TouchableOpacity>
                  
                  {/* radio2 */}
                  <TouchableOpacity style={[styles.radioButton, selectedOption === 'Bridge' && styles.selectedRadioButton,]}
                    onPress={() => handleOptionSelect('Bridge')}>
                    <Image source={bridge} style={[{height: 50, width: 50}, selectedOption === 'Bridge' && styles.selectedRadioButtonImage]}/>
                    <Text style={[styles.radioButtonText, selectedOption === 'Bridge' && styles.selectedRadioButtonText]}>Bridge</Text>
                  </TouchableOpacity>
                  
                  {/* radio3 */}
                  <TouchableOpacity style={[styles.radioButton, selectedOption === 'Drain' && styles.selectedRadioButton,]}
                    onPress={() => handleOptionSelect('Drain')}>
                    <Image source={drain} style={[{height: 50, width: 50}, selectedOption === 'Drain' && styles.selectedRadioButtonImage]}/>
                    <Text style={[styles.radioButtonText, selectedOption === 'Drain' && styles.selectedRadioButtonText]}>Drain</Text>
                  </TouchableOpacity>
                  
                  {/* radio4 */}
                  <TouchableOpacity style={[styles.radioButton, selectedOption === 'Footpath' && styles.selectedRadioButton,]}
                    onPress={() => handleOptionSelect('Footpath')}>
                    <Image source={footpath} style={[{height: 50, width: 50}, selectedOption === 'Footpath' && styles.selectedRadioButtonImage]}/>
                    <Text style={[styles.radioButtonText, selectedOption === 'Footpath' && styles.selectedRadioButtonText]}>Footpath</Text>
                  </TouchableOpacity>
                  
                  {/* radio5 */}
                  <TouchableOpacity style={[styles.radioButton, selectedOption === 'Tunnel' && styles.selectedRadioButton,]}
                    onPress={() => handleOptionSelect('Tunnel')}>
                    <Image source={tunnel} style={[{height: 50, width: 50}, selectedOption === 'Tunnel' && styles.selectedRadioButtonImage]}/>
                    <Text style={[styles.radioButtonText, selectedOption === 'Tunnel' && styles.selectedRadioButtonText]}>Tunnel</Text>
                  </TouchableOpacity>
                  
                  {/* radio6 */}
                  <TouchableOpacity style={[styles.radioButton, selectedOption === 'Others' && styles.selectedRadioButton,]}
                    onPress={() => handleOptionSelect('Others')}>
                    <Image source={others} style={[{height: 50, width: 50}, selectedOption === 'Others' && styles.selectedRadioButtonImage]}/>
                    <Text style={[styles.radioButtonText, selectedOption === 'Others' && styles.selectedRadioButtonText]}>Others</Text>
                  </TouchableOpacity>
                </View>

              </View>
              <View style={styles.line} />


              {/* Issue Type */}
              <View style={[{marginTop: 20}]}>
                <Text style={styles.miniHead}>Issue Type</Text>
                <View style={{height: 50, borderColor: '#A3A3A3', borderWidth: 0.5, borderRadius: 10, marginTop: 10, justifyContent: 'center'}}>
                  <Picker
                    selectedValue={type}
                    onValueChange={(itemValue, itemIndex) => setType(itemValue)}
                    mode='dropdown' >
                      <Picker.Item label="Pothole" value="Pothole" />
                      <Picker.Item label="Crack" value="Crack" />
                      <Picker.Item label="Blocked" value="Blocked" />
                      <Picker.Item label="Other" value="Other" />
                  </Picker>
                </View>
              </View>


              {/* Description */}
              <View style={[{marginTop: 20}]}>
                <Text style={styles.miniHead}>Description</Text>
                <View style={styles.description}>
                  <TextInput placeholder='Share your issue description' multiline={true} value={description} onChangeText={setDescription}/>
                </View>
              </View>
              {/* <View style={styles.line} /> */}


              {/* Submit button */}
              <View style={[{marginTop: 30}]}>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>

            </View>

          </KeyboardAwareScrollView>
        </View>


      </View>
    </Modal>

  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  container: {
    backgroundColor: Colors.BACKGROUND,
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 20,
    height: 700,
  },
  closeButton: {
    alignSelf: 'center',
    marginBottom: 8,
    tintColor: Colors.PRIMARY,
    height: 32,
    width: 32
  },
  closeButtonText: {
    color: 'blue',
    fontWeight: 'bold',
  },
  head: {
    fontSize: 22,
    color: Colors.PRIMARY,
    fontWeight: 'bold',
    paddingBottom: 8,
  },
  content: {
    marginTop: 20
  },
  locationInput: {
    height: 50,
    borderWidth: 0.5,
    borderColor: '#A3A3A3',
    borderRadius: 10,
    paddingLeft: 12,
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.HEADLINE,
    marginBottom: 5,
    marginTop: 25
  },
  miniHead: {
    color: Colors.PRIMARY,
    fontWeight: '500',
    letterSpacing: 0.5
  },
  uploadView: {
    height: 90, 
    width: 90, 
    borderWidth: 1, 
    borderStyle: 'dashed', 
    borderColor: '#A3A3A3',
    borderRadius: 10, 
    justifyContent: 'center',
    marginTop: 10
  },
  uploadImage: {
    height: 40, 
    width: 40, 
    alignSelf: 'center', 
    tintColor: '#A3A3A3'
  },
  selectedImage: {
    height: 90,
    width: 90,
    borderRadius: 10,
    marginLeft: -1
  },

  // ----------------- radio button ----------------
  radioButton: {
    height: 100,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#A3A3A3',
    borderRadius: 10,
    gap: 10
  },
  selectedRadioButton: {
    backgroundColor: 'rgba(133, 102, 60, 0.7)' 
  },
  selectedRadioButtonImage: {
    tintColor: Colors.WHITE,
  },
  selectedRadioButtonText: {
    color: Colors.WHITE
  },
  radioButtonText: {
    fontSize: 14,
  },

  // -------------------- dropdown -------------------
  dropdown: {
    height: 50,
    borderColor: '#A3A3A3',
    borderWidth: 0.5,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 10
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 14,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },

  // --------------- description --------------
  description: {
    height: 120,
    borderWidth: 0.5,
    borderColor: '#A3A3A3',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 10,
  },

  // --------------- submit button --------------
  submitButton: {
    height: 50,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 18,
    textTransform: 'uppercase',
    letterSpacing: 1.5
  }
});

export default SlideUpView;
