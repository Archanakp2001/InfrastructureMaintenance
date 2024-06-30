import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Timeline from 'react-native-timeline-flatlist';
import axios from 'axios';

import MiniTitle from '../Components/MiniTitle';
import idImage from '../../assets/images/id.png';
import dateImage from '../../assets/images/calendar.png';
import alertImage from '../../assets/images/alert.png';
import { API_ROOT } from '../../apiroot';

import styles from '../Utils/styles';
import Colors from '../Utils/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IssueReport = () => {
  const route = useRoute();
  const { issueId } = route.params;
  const navigation = useNavigation();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  const [show, setShow] = useState(false);
  const [newImages, setNewImages] = useState([]);   // for images uploaded by authority

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
          if (response.data.resolved_image) {
            setNewImages([response.data.resolved_image]); 
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

  const onIconClick = () => {
    navigation.goBack();
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


  // --------------------- Status -----------------------
  const trackData = [
    { title: 'Issue Reported' },
    { title: 'Issue Inspected' },
    { title: 'Work Issued' },
    { title: 'Work In-Progress' },
    { title: 'Work Completed' },
  ];

  const getTimelineData = () => {
    switch (issue.status) {
      case 'Issue reported':
        return trackData.slice(0, 1);
      case 'Issue Inspected':
        return trackData.slice(0, 2);
      case 'Work Issued':
        return trackData.slice(0, 3);
      case 'Work In-Progress':
        return trackData.slice(0, 4);
      case 'Work Completed':
        return trackData;
      default:
        return [];
    }
  };
  


  const renderContent = () => {
    if (!issue) {
      return null; // or a placeholder
    }
    
    return (
      
      <View style={style.issueSummary}>

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
        <View style={{ marginTop: 30 }}>
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
          <Text style={{ color: Colors.PRIMARY, marginBottom: 20, fontSize: 15 }}>Issue Status</Text>
          
          <Timeline
            data={getTimelineData()}
            circleSize={16}
            circleColor='#998E7F'
            lineColor='#998E7F'
            listViewStyle={{ height: 50, marginTop: -20 }}
            options={{
              style: { paddingTop: 15, },
            }}
            isUsingFlatlist={true}
            showTime={false}
            titleStyle={{marginTop: -12, paddingBottom: 20}}
            
          />

        </View>

        {(newImages.length>0) && (
        <View style={[styles.line, { width: 340, alignSelf: 'center', marginTop: -6}]} />
        )}
        
        {/* Resolved Images */}
        {(newImages.length>0) && (
        <View style={{ marginTop: 30 }}>
          <Text style={{ color: Colors.PRIMARY, marginBottom: 10, fontSize: 15 }}>Images by Authority</Text>
          
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {show && newImages.map((newImageUri, index) => (
              <TouchableOpacity key={index} onPress={() => handleImageClick(newImageUri)}>
                <Image style={{ height: 100, width: 100, borderRadius: 8 }} source={{ uri: newImageUri }} />
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
        )}
        


      </View>
    );
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error fetching issue: {error}</Text>;
  }

  return (
    <View style={[styles.mainContainer]}>
      {/* Title */}
      <MiniTitle title='Issue Report' navigateTo={onIconClick} />

      <FlatList
        data={[{ key: 'content' }]}
        renderItem={({ item }) => renderContent()}
        keyExtractor={(item) => item.key}
      />
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

export default IssueReport;
