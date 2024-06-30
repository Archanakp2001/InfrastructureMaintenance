import React, {useState, useEffect} from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

import MiniTitle from '../Components/MiniTitle';

import styles from '../Utils/styles';
import Colors from '../Utils/Colors';
import getUserDetails from '../Contexts/UserDetails';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ROOT } from '../../apiroot';

const UserEditProfile = () => {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [place, setPlace] = useState('');

  const navigation = useNavigation();
  const onPasswordChange = () => {
    navigation.navigate('PasswordChange')
  }
  
  const onIconClick = () => {
    navigation.goBack()
  }

  const fetchUserDetails = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        const details = await getUserDetails(token);
        setUsername(details.username);
        setEmail(details.email);
        setPhone(details.profile.phone);
        setPlace(details.profile.place);

    } catch (error) {
        setError(error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
      fetchUserDetails();
  }, []);


  // -------------------- update profile --------------------
  const onSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.put(
        API_ROOT + '/update-profile/', 
        {
          username,
          email,
          profile: {
            phone,
            place
          }
        },
        {
          headers: {
            Authorization: `Token ${token}`
          }
        }
      );

      if (response.status === 200) {
        Alert.alert('Success', 'Profile updated successfully');
        navigation.goBack();
      } else {
        console.log('Error updating profile:', response.data);
      }
    } catch (error) {
      console.log('Error updating profile:', error);
      setError(error);
    }
  };


  // -------------------- loading -------------------------
  if (loading) {
    return (
      <View style={{flex: 1, backgroundColor: Colors.BACKGROUND, paddingTop: 80}}>
          <ActivityIndicator size="large" color="#0000ff" />
      </View>
  );
  }

  if (error) {
    return <Text style={{paddingTop: 100}}>Error: {error.message}</Text>;
}

  return (


    <View style={styles.miniContainer}>

                  <View style={styles.mainContainer}>

                  {/* ---------------------- Title ------------------- */}
                  <MiniTitle title='Edit Profile' navigateTo={onIconClick}/>
            
            
                  {/* -------------------- Edit fields ------------------- */}
                  <View style={[{alignItems: 'center', marginTop: 30}]}>
                  <TextInput
                    style={styles.editInput}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Username"
                    
                  />
                  <TextInput
                    style={styles.editInput}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                  />
                  <TextInput
                    style={styles.editInput}
                    keyboardType="numeric"
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Phone no"
                  />
                  <TextInput
                    style={styles.editInput}
                    value={place}
                    onChangeText={setPlace}
                    placeholder="Place"
                  />
                  </View>
            
            
                  {/* ------------------ Change password -------------------- */}
                  <TouchableOpacity onPress={onPasswordChange} style={[{alignItems: 'center'}]}>
                    <View style={[{ width: 350, marginTop: 40, borderColor: Colors.PRIMARY, borderWidth: 1, height:50, borderRadius: 15, justifyContent: 'center'}]}>
                      <Text style={[{color:Colors.PRIMARY, letterSpacing: 1, fontSize: 16, textAlign: 'center'}]}>Change Password</Text>
                    </View>
                  </TouchableOpacity>
            
            
                  {/* ----------------- Submit button --------------------- */}
                  <TouchableOpacity onPress={onSubmit} style={[{alignItems: 'center', }]}>
                    <View style={[styles.button, {width: 350, marginTop: 20}]}>
                      <Text style={[styles.buttonText, {letterSpacing: 2, fontSize: 18}]}>SUBMIT</Text>
                    </View>
                  </TouchableOpacity>
            
            
                </View>


    </View>



    
  );
};

export default UserEditProfile;