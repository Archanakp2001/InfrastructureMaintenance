import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Pressable, Alert, TouchableOpacity, Modal, TouchableWithoutFeedback, ActivityIndicator, Button, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MiniTitle from '../Components/MiniTitle';
import idImage from '../../assets/images/id.png';
import dateImage from '../../assets/images/calendar.png';
import alertImage from '../../assets/images/alert.png';
import loadinggif from '../../assets/loading.mp4';
import { API_ROOT } from '../../apiroot';

import styles from '../Utils/styles';
import Colors from '../Utils/Colors';
import { CountsContext } from '../Contexts/CountsContext';
import { UserNotificationsContext } from '../Contexts/UserNotificationsContext';

const IssueStatusUpdate = () => {
  const route = useRoute();
  const { issueId } = route.params;
  const navigation = useNavigation();

  const [issue, setIssue] = useState(null);     // for fetching data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);     // for displaying images
  const [show, setShow] = useState(false);      // for displaying images
  const [issueStatus, setIssueStatus] = useState('Issue Inspected');
  const { setCounts } = useContext(CountsContext);    // for status update
  const { addUserNotification } = useContext(UserNotificationsContext);
  const [newImages, setNewImages] = useState([]);   // for storing new images to be uploaded

  useEffect(() => {
    const fetchIssueData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${API_ROOT}/api/complaints/${issueId}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (response.data) {
          console.log(response.data);
          setIssue(response.data);

          if (response.data.image) {
            setImages([response.data.image]); // Convert single image URL to an array
          }
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (err) {
        setError(err.message || err);
      } finally {
        setLoading(false);
      }
      setShow(!show);
    };

    fetchIssueData();
  }, [issueId]);


  // --------------------- navigate back --------------------
  const onIconClick = () => {
    navigation.goBack();
  };

  // ------------------ update the status -------------------
  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const formData = new FormData();
      formData.append('status', issueStatus);

      // Add new images to the form data
      if (newImages.length > 0) {
        newImages.forEach((imageUri, index) => {
          formData.append('resolved_image', {
            uri: imageUri,
            type: 'image/jpeg',
            name: `resolved_image_${index}.jpg`,
          });
        });
      }

      const response = await axios.post(
        `${API_ROOT}/api/complaints/${issueId}/update_status/`,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        Alert.alert('Success', 'Status updated successfully');

        // Fetch updated issues and recalculate counts
        fetchIssues(token);

        // Add notification
        addUserNotification({
          id: new Date().getTime(),
          title: `Status updated to ${issueStatus}`,
          issueId: issue.id,
          location: issue.location,
          user: issue.user.username,
        });

        // Optionally, you can navigate back to the previous screen after successful update
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to update status');
      }

    } catch (error) {
      console.log('Error', error.message);
    }
  };


  // Fetch issues and recalculate counts
  const fetchIssues = async (token) => {
    try {
        const response = await axios.get(API_ROOT + '/api/complaints/?user_specific=false', {
            headers: {
                Authorization: `Token ${token}`, // Include the token in the headers
            },
        });

        if (response.data && Array.isArray(response.data.results)) {
            const issues = response.data.results.reverse();
            console.log(issues)
            setCounts({
                inspectedCount: issues.filter(issue => issue.status === 'Issue Inspected' || issue.status === 'Work Issued' || issue.status === 'Work In-Progress' || issue.status === 'Work Completed').length,
                workIssuedCount: issues.filter(issue => issue.status === 'Work Issued').length,
                workCompletedCount: issues.filter(issue => issue.status === 'Work Completed').length,
                totalIssues: issues.length,
            });
        } else {
            console.error("Unexpected response format:", response.data);
        }
    } catch (error) {
        console.error("Error fetching issues:", error.message || error);
    }
  };


  // -------------------- Show fullscreen images on click -----------------------
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (imageUri) => {
    setSelectedImage(imageUri);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };


  // ----------------- upload new images -------------------
  const handleImagePick = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setNewImages([...newImages, result.assets[0].uri]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong while trying to open the gallery.");
    }
  };

  const renderContent = () => {
    if (!issue) {
      return null; // or a placeholder
    }

    return (

      <View>

        {/* ---- issue summary ---- */}
        <View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 55, marginBottom: 30 }}>
            
            {/* Issue ID */}
            <View style={{ flexDirection: 'row', gap: 5 }}>
              <Image source={idImage} style={{ height: 42, width: 42, tintColor: '#B5B5B5' }} />
              <View>
                <Text style={{ color: Colors.PRIMARY }}>Issue ID</Text>
                <Text style={{ fontWeight: 'bold' }}>#{issue.id}</Text>
              </View>
            </View>
            {/* Issue Date */}
            <View style={{ flexDirection: 'row', gap: 5 }}>
              <Image source={dateImage} style={{ height: 42, width: 42, tintColor: '#B5B5B5' }} />
              <View>
                <Text style={{ color: Colors.PRIMARY }}>Issue Date</Text>
                <Text style={{ fontWeight: 'bold' }}>{issue.created_at}</Text>
              </View>
            </View>

          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 40 }}>
            
            {/* Issue With */}
            <View style={{ flexDirection: 'row', gap: 5 }}>
              <Image source={alertImage} style={{ height: 42, width: 42, tintColor: '#B5B5B5' }} />
              <View>
                <Text style={{ color: Colors.PRIMARY }}>Issue With</Text>
                <Text style={{ fontWeight: 'bold' }}>{issue.issue_with}</Text>
              </View>
            </View>
            {/* Issue Type */}
            <View style={{ flexDirection: 'row', gap: 5 }}>
              <Image source={alertImage} style={{ height: 42, width: 42, tintColor: '#B5B5B5' }} />
              <View>
                <Text style={{ color: Colors.PRIMARY }}>Issue Type</Text>
                <Text style={{ fontWeight: 'bold' }}>{issue.issue_type}</Text>
              </View>
            </View>

          </View>
          <View style={[styles.line, { width: 340, alignSelf: 'center', marginTop: 30 }]} />

          {/* Location */}
          <View style={{ marginTop: 20 }}>
            <Text style={{ color: Colors.PRIMARY, marginBottom: 10, fontSize: 15 }}>Location</Text>
            <Text style={{ lineHeight: 20, textAlign: 'justify' }}>{issue.location}</Text>
          </View>
          <View style={[styles.line, { width: 340, alignSelf: 'center', marginTop: 20 }]} />


          {/* Problem Description */}
          <View style={{ marginTop: 20 }}>
            <Text style={{ color: Colors.PRIMARY, marginBottom: 10, fontSize: 15 }}>Problem Description</Text>
            <Text style={{ lineHeight: 20, textAlign: 'justify' }}>{issue.description}</Text>
          </View>
          <View style={[styles.line, { width: 340, alignSelf: 'center', marginTop: 20 }]} />


          {/* Images */}
          <View style={{ marginTop: 20 }}>
            
            <Text style={{ color: Colors.PRIMARY, marginBottom: 10, fontSize: 15 }}>Images</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {show && images.map((imageUri, index) => (
                <TouchableOpacity key={index} onPress={() => handleImageClick(imageUri)}>
                  <Image style={{ height: 100, width: 100, borderRadius: 8 }} source={{ uri: imageUri }} />
                </TouchableOpacity>
              ))}
            </View>

            <Modal visible={modalVisible} transparent={true} animationType="fade" onRequestClose={handleCloseModal}>
              <TouchableWithoutFeedback onPress={handleCloseModal}>
                <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center'}}>
                  {selectedImage && (
                    <Image style={{width: '90%', height: '90%', resizeMode: 'contain'}} source={{ uri: selectedImage }} />
                  )}
                </View>
              </TouchableWithoutFeedback>
            </Modal>

          </View>
          <View style={[styles.line, { width: 340, alignSelf: 'center', marginTop: 20 }]} />


          {/* Track the Status */}
          <View style={{ marginTop: 20 }}>
            
            <Text style={{ color: Colors.PRIMARY, marginBottom: 10, fontSize: 15 }}>Update Status</Text>
            <View style={{marginBottom: 20, height: 50, borderColor: '#A3A3A3', borderWidth: 0.5, borderRadius: 10, marginTop: 10, justifyContent: 'center'}}>
                <Picker
                  selectedValue={issueStatus}
                  onValueChange={(itemValue, itemIndex) => setIssueStatus(itemValue)}
                  mode='dropdown' >
                    <Picker.Item label="Issue Inspected" value="Issue Inspected" />
                    <Picker.Item label="Work Issued" value="Work Issued" />
                    <Picker.Item label="Work In-Progress" value="Work In-Progress" />
                    <Picker.Item label="Work Completed" value="Work Completed" />
                </Picker>
            </View>

          </View>


        {/* end of issue summary */}
        </View> 

      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <MiniTitle title="Update Issue Status" navigateTo={onIconClick} />
      {loading ? (
        <ActivityIndicator size="large" color={Colors.PRIMARY} style={{ marginTop: 50 }} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (

        <ScrollView>
          <View>

            {/* ---- username ----- */}
            <View style={{ flexDirection: 'row', marginTop: 15, alignSelf: 'center' }}>
              <View style={{ height: 0.5, width: 100, backgroundColor: Colors.PRIMARY, marginTop: 13 }} />
              <Text style={{ fontWeight: 'bold' }}>  User : </Text>
              <Text>{issue.user.username}  </Text>
              <View style={{ height: 0.5, width: 100, backgroundColor: Colors.PRIMARY, marginTop: 13 }} />
            </View>

            <View style={style.issueSummary}>

              {renderContent()}

              {/* Image Upload Button */}
              {(issueStatus === 'Work In-Progress' || issueStatus === 'Work Completed') && (
                  <View>
                    <Pressable style={{height: 40,borderWidth: 1, borderColor: Colors.PRIMARY, borderRadius: 10, justifyContent: 'center', marginBottom: 20}} onPress={handleImagePick}>
                      <Text style={{color: Colors.PRIMARY, textAlign: 'center', fontSize: 15, letterSpacing: 1, fontWeight: '500'}}>Upload Image</Text>
                    </Pressable>
                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                      {newImages.map((image, index) => (
                        <Image key={index} style={{ height: 100, width: 100, borderRadius: 8, marginBottom: 20 }} source={{ uri: image }} value={newImages} onValueChange={setNewImages}/>
                      ))}
                    </View>
                  </View>
              )}

              {/* Update button */}
              <Pressable onPress={handleUpdate} style={{height: 45, backgroundColor: Colors.PRIMARY, borderRadius: 10, justifyContent: 'center'}}>
                  <Text style={{color: '#fff', textAlign: 'center', fontSize: 15, letterSpacing: 1, fontWeight: '500'}}>UPDATE</Text>
              </Pressable>

            </View>
          </View>
        </ScrollView>

      )}
    </View>
  );
};

const style = StyleSheet.create({
  issueSummary: {
    width: 360,
    borderWidth: 0.5,
    borderColor: Colors.BORDER,
    borderRadius: 15,
    alignSelf: 'center',
    marginTop: 20,
    padding: 20,
    marginBottom: 50,
  },
  summaryImages: {
    height: 100,
    width: 100,
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#A3A3A3',
  },
});

export default IssueStatusUpdate;
