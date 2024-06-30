import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, TextInput, Button, TouchableOpacity, Linking, Alert, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useEffect, useState } from 'react';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import LoadingScreen from './LoadingScreen';
import SigninInput from '../Components/SigninInput';
import SignupPopup from '../Components/SignupPopup';
import useLoginOrSignup from '../loginsignupAuth/CustomHooks/useLoginOrSignup';

import userIcon from './../../assets/images/user.png';
import passwordIcon from './../../assets/images/password.png';

import styles from '../Utils/styles';
import Colors from '../Utils/Colors';
import { API_ROOT } from '../../apiroot';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function SignInScreen() {

  // ------------ Loading screen --------------
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const delay = setTimeout(() => {
      setIsLoading(false); // Set isLoading to false after delay (simulated loading complete)
    }, 2000); // Simulated loading time: 2 Authoritys

    return () => clearTimeout(delay); // Cleanup timer on component unmount
  }, []);

  const route = useRoute();
  const { resetAuthoPassword, resetUserPassword } = route.params || {};
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  
// --------------- set input data ------------
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
// State variable to track password visibility 
const [showPassword, setShowPassword] = useState(false);  
// Function to toggle the password visibility state 
const toggleShowPassword = () => { 
    setShowPassword(!showPassword); 
}; 

// ------------- handle navigation reset -------------
useEffect(() => {
  if (resetAuthoPassword) {
    setPassword('');
  }
  if (resetUserPassword) {
    setPassword('');
  }
}, [resetAuthoPassword, resetUserPassword]);


// ------------------------- SignIn -----------------------------
const [usernameError, setUsernameError] = useState('')
const [passwordError, setPasswordError] = useState('')
const [loading, setLoading] = useState(false)

const clearErrors = () => {
  setUsernameError('')
  setPasswordError('')
};

const handleLogin = async () => {
  clearErrors();
    if(username == '')
    {
      setUsernameError('Username cannot be empty')
      return
    }
    if(password == '') {
      setPasswordError('Password cannot be empty')
      return
    }

  const payload = {
    username,
    password,
  };

  setLoading(true);

  try {
    const response = await axios.post(API_ROOT + '/api-token-auth/', payload);
    
    if (response.status === 200) {
      const token = response.data.token;
      await AsyncStorage.setItem('token', token); // Store the token
      console.log(token);

      const userProfile = response.data.user.profile ? 'profile' : 'authority_profile';
      console.log('User Verified:', response.data.user.verified);
      
      if (userProfile === 'profile') {
        navigation.navigate('User');
      } else if (userProfile === 'authority_profile') {
        if (response.data.user.verified) {
          navigation.navigate('Authority');
        } else {
            Alert.alert('Authority not verified by admin');
        }
      }

    }
  } catch (error) {
    if (error.response && error.response.status === 403) {
      Alert.alert('Authority not verified by admin');
    } else {
      setPasswordError('Invalid credentials');
    }
  }

  setLoading(false);
};


// --------------- Popup -----------------
const [isPopupVisible, setIsPopupVisible] = useState(false);

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };


// ---------------- Forgot password --------------
const handlePress = () => {
    Linking.openURL('https://www.google.co.in/');
    console.log('Forgot Paswword');
}


if (isLoading) {
  return <LoadingScreen />;
}

  return (
    <View style={styles.container}>

      <KeyboardAwareScrollView
        contentContainerStyle={styles.maincontainer}
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false} >

          <View style={styles.container}>

              <StatusBar style="auto" />
              
              {/* ---------- SignIn Image ---------------- */}
              <View style={styles.imgcontainer}>
                  <Image style={[{height: 400}, {width: 400, marginTop: 50}]} source={require('./../../assets/images/image.png')}/>
              </View>


              {/* -------------- SignIn Form ---------------- */}
              <View style={styles.formcontainer}>


                {/* ---------- Inputs ----------- */}

                  {/* --- username field --- */}
                  <SigninInput icon={userIcon} placeholder='Username' keyboardtype='default' onChangeText={(text)=>setUsername(text)} />
                  {usernameError ? <Text style={{ color: 'red', fontSize: 12, paddingLeft: 10, paddingTop: 5 }}>{usernameError}</Text> : null}
                  
                  {/* --- password field --- */}
                  <View style={{flexDirection: 'row', marginTop: 30,borderColor: Colors.BORDER,borderWidth: 0.4,width: 340,height: 50,borderRadius: 15}}> 
                      <Image source={passwordIcon} style={[styles.inputicon, {marginRight: 10}]}/>
                      <TextInput 
                          // Set secureTextEntry prop to hide  
                          //password when showPassword is false 
                          secureTextEntry={!showPassword} 
                          value={password} 
                          onChangeText={setPassword} 
                          style={{flex: 1, color: '#333', paddingVertical: 10, paddingRight: 10, fontSize: 16, letterSpacing: 1 }} 
                          placeholder="Password"
                          placeholderTextColor={Colors.TEXT}
                      /> 
                      <MaterialCommunityIcons 
                          name={showPassword ? 'eye' : 'eye-off'} 
                          size={24} 
                          color="#aaa"
                          style={{marginRight: 15, marginTop: 12}} 
                          onPress={toggleShowPassword} 
                      /> 
                  </View>
                  {passwordError ? <Text style={{ color: 'red', fontSize: 12, paddingLeft: 10, paddingTop: 5 }}>{passwordError}</Text> : null}
 
                  {/* -------- forgot password ---------
                  <TouchableOpacity onPress={handlePress}><Text style={[styles.text, {textAlign: 'right', color:Colors.PRIMARY, paddingTop: 10}]}>Forgot Password?</Text></TouchableOpacity>
                   */}

                {/* --------- Sign in button ----------- */}
                  <View>{loading ? <ActivityIndicator color={Colors.PRIMARY} style={{marginTop: 20, marginBottom: -40}}></ActivityIndicator> : null}</View>
                  <TouchableOpacity onPress={handleLogin}>
                      <View style={[styles.button, {marginTop: 50}]}>
                          <Text style={styles.buttonText}>{loading ? 'SIGNING IN...' : 'SIGN IN'}</Text>
                      </View>
                  </TouchableOpacity>


                {/* ------------ For sign up -------------- */}
                  <View style={[{flexDirection: 'row'}, {justifyContent: 'center'}, {marginTop: 30}]}>
                      <Text style={[styles.text, {letterSpacing: 0.5}, ]}>Don't have an account? </Text>
                      <TouchableOpacity onPress={togglePopup}>
                          <Text style={[styles.text, {textDecorationLine:'underline'}, {letterSpacing: 0.5}, {color:Colors.PRIMARY}]}>Sign Up</Text>
                      </TouchableOpacity>
                      <SignupPopup isVisible={isPopupVisible} onClose={togglePopup} />
                  </View>
                  
              </View>
          
          </View>

      </KeyboardAwareScrollView>
    </View>

  );
}