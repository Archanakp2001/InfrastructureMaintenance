
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Pressable, Alert } from 'react-native';
import { StatusBar } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

import SignupInput from '../Components/SignupInput';

import userIcon from './../../assets/images/user.png';
import phoneIcon from './../../assets/images/phone.png';
import emailIcon from './../../assets/images/email.png';
import placeIcon from './../../assets/images/place.png';
import departmentIcon from './../../assets/images/panchayath.png';
import licenseIcon from './../../assets/images/license.png';
import passwordIcon from './../../assets/images/password.png';
import confirmIcon from './../../assets/images/confPassword.png';
import User from './../../assets/images/signup_User.png';
import add from './../../assets/images/add.png';
import deleteIcon from './../../assets/images/delete.png';

import styles from '../Utils/styles';
import Colors from '../Utils/Colors';
import axios from 'axios';
import { API_ROOT } from './../../apiroot';

const AuthoSignup = () => {

  // ---------------- pass data ------------------
  const [authoName, setAuthoName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [place, setPlace] = useState('');
  const [department, setDepartment] = useState('');
  const [license, setLicense] = useState('');
  const [password, setPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  // ---------------------- open gallery for profile photo --------------------
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
    }
  }catch (error) {
    console.error(error);
    Alert.alert("Error", "Something went wrong while trying to open the gallery.");
  }
  };

  const handleDelete = () => {
    setImageUri(null);
  }


  // --------------------- Signin button ---------------------
  const onSignInClick = () => {
    navigation.navigate('SignInScreen')
  }


  // ---------------------- Signup --------------------------
  const onSignupClick = async () => {
    if (password !== confPassword) {
      Alert.alert('Passwords do not match');
      return;
    }

    const payload = {
      username: authoName,
      email,
      password,
      profile: {
        phone,
        place,
        department,
        license_no: license,
        verified: false,
      }
    };

    setIsLoading(true);

    try {
      const response = await axios.post(API_ROOT + '/signup-authority/', payload);

      if (response.status === 201) {
        Alert.alert('Success', 'Account created successfully!');
        navigation.navigate('SignInScreen');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong during signup');
      console.log(error.message);
    }

    setIsLoading(false);
  };


  return (
    <View style={[styles.container, {paddingTop: 20}]}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.maincontainer}
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false} >


        <StatusBar style='auto'/>

        {/* ------------ Title --------------- */}
        <View style={styles.title}>
          <Text style={styles.titleHead}>Authority Sign Up</Text>
          <View style={styles.line} />
        </View>

        {/* ------------- Profile pic ------------- */}
        <Pressable onPress={openGallery} style={[styles.categoryIcon, {height: 100, width: 100} ]}>
          {imageUri ? (
            <View>
              <Image style={{width: 100, height: 100, borderRadius: 50, marginTop: 10}} source={{ uri: imageUri }} />
              <Pressable onPress={handleDelete}><Image source={deleteIcon} style={{marginLeft: 80, marginTop: -6, height: 15, width: 15}} /></Pressable>
            </View>
          ) : (
            <View>
              <Image style={[{ height: 80, width: 80, marginTop: 10 }]} source={User} />
              <Image source={add} style={[{marginLeft: 60}, {marginTop: -6}]} />
            </View>
            
          )}
          
        </Pressable>
        
        {/* ------------- Details ------------- */}
        <View>

          <SignupInput style={[styles.input, {marginTop: 15}]} icon={userIcon} placeholder='Authority Name' keyboardtype='default' value={authoName} onChangeText={setAuthoName} />
          <SignupInput style={[styles.input, {marginTop: 15}]} icon={phoneIcon} placeholder='Phone no' keyboardtype='numeric' value={phone} onChangeText={setPhone} />
          <SignupInput style={[styles.input, {marginTop: 15}]} icon={emailIcon} placeholder='Email id' keyboardtype='default' value={email} onChangeText={setEmail} />
          <SignupInput style={[styles.input, {marginTop: 15}]} icon={placeIcon} placeholder='Place' keyboardtype='default' value={place} onChangeText={setPlace} />
          <SignupInput style={[styles.input, {marginTop: 15}]} icon={departmentIcon} placeholder='Department' keyboardtype='default' value={department} onChangeText={setDepartment} />
          <SignupInput style={[styles.input, {marginTop: 15}]} icon={licenseIcon} placeholder='License no' keyboardtype='default' value={license} onChangeText={setLicense} />
          <SignupInput style={[styles.input, {marginTop: 15}]} icon={passwordIcon} placeholder='Password' keyboardtype='default' secureTextEntry={true} value={password} onChangeText={setPassword} />
          <SignupInput style={[styles.input, {marginTop: 15}]} icon={confirmIcon} placeholder='Confirm Password' keyboardtype='default' secureTextEntry={true} value={confPassword} onChangeText={setConfPassword} />        
          
          <TouchableOpacity onPress={onSignupClick}>
            <View style={[styles.button, {marginTop: 20}]}>
              <Text style={styles.buttonText}>{isLoading ? 'Signing up...' : 'SIGN UP'}</Text>
            </View>
          </TouchableOpacity>

          <View style={[{flexDirection: 'row'}, {justifyContent: 'center'}, {marginTop: 20}]}>
            <Text style={[styles.text, {letterSpacing: 0.5}, ]}>Already have an account? </Text>
            <TouchableOpacity onPress={onSignInClick}>
              <Text style={[styles.text, {textDecorationLine:'underline'}, {letterSpacing: 0.5}, {color:Colors.PRIMARY}]}>Sign In</Text>
            </TouchableOpacity>
          </View>
                  
        </View>



      </KeyboardAwareScrollView>

        
    </View>
    
        
    
  );
};

export default AuthoSignup;
