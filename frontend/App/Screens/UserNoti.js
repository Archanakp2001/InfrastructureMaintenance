import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

import MainTitle from '../Components/MainTitle';
import place from '../../assets/images/place.png';
import menuVertical from '../../assets/images/menuVertical.png';
import styles from '../Utils/styles';
import Colors from '../Utils/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROOT } from '../../apiroot';
import { useNavigation } from '@react-navigation/native';
import { UserNotificationsContext } from '../Contexts/UserNotificationsContext';
import no_noti from './../../assets/images/no_noti.png';

const UserNoti = () => {

  const { userNotifications, removeUserNotification } = useContext(UserNotificationsContext);
  const [username, setUsername] = useState(null);
  const [badgeCount, setBadgeCount] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    const getUsername = async () => {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(API_ROOT + '/user-profile/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (response.data && response.data.username) {
        setUsername(response.data.username);
        console.log(response.data.username);
      } else {
        console.error("Unexpected response format:", response.data);
      }
    };
    
    getUsername();
  }, []);

  const filteredNotifications = userNotifications.filter(notification => notification.user === username);

  useEffect(() => {
    if (username) {
      setBadgeCount(filteredNotifications.length);
      navigation.setOptions({
        tabBarBadge: filteredNotifications.length > 0 ? filteredNotifications.length : null,
      });
    }
  }, [username, userNotifications, navigation]);

  
  // ---------------- handle notification press ----------------------
  const handleNotificationPress = async (issueId, notificationId) => {
    // Navigate to the issue report screen
    navigation.navigate('IssueReport', { issueId });

    // Delete the notification
    await removeUserNotification(notificationId);
  };


  return (
    <View style={styles.mainContainer}>
      
      {/* ----------------- Title ------------------- */}
      <MainTitle title='Notifications'/>


      {/* ------------------ Notifications ------------------- */}
      <View style={styles.cards}>
        
        {filteredNotifications.length === 0 ? (
          <View style={{alignItems: 'center', marginTop: 70}}>
            <Image source={no_noti} style={{height: 300, width: 300, marginLeft: 50}} />
            <Text style={{color: Colors.PRIMARY}}>No new notifications found</Text>
          </View>
        ) : 
        (filteredNotifications.map((notification) => (
          <TouchableOpacity key={notification.id} style={styles.notifications} onPress={() => handleNotificationPress(notification.issueId, notification.id)}>
            <View>
              <View style={[{flexDirection: 'row', borderBottomWidth: 0.5, borderColor: '#B3B3B3' ,width: 340, paddingBottom: 6, marginBottom: 10, justifyContent: 'space-between'}]}>
                <Text style={[{fontWeight: 'bold'}]}>{notification.title}</Text>
                <Text>#{notification.issueId}</Text>
              </View>
              <View style={[{flexDirection: 'row', gap: 10}]}>
                <Image source={place} />
                <Text>{notification.location}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )))
        }

        
      </View>

    </View>
  );
};

export default UserNoti;