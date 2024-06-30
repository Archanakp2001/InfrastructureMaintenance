
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';

import SignupInput from '../Components/SignupInput';

import userIcon from './../../assets/images/user.png';
import phoneIcon from './../../assets/images/phone.png';
import emailIcon from './../../assets/images/email.png';
import placeIcon from './../../assets/images/place.png';
import panchayathIcon from './../../assets/images/panchayath.png';
import passwordIcon from './../../assets/images/password.png';
import confirm from './../../assets/images/confPassword.png';

import styles from '../Utils/styles';
import Colors from '../Utils/Colors';
import useLoginOrSignup from '../loginsignupAuth/CustomHooks/useLoginOrSignup';

const UserSignup = () => {

  // --------------- set input data ----------------
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [place, setPlace] = useState('');
  const [password, setPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');


// --------------- navigation -------------------
const navigation = useNavigation();
const { usernameError, emailError, phoneError, passwordError, confPasswordError, handleSignup, loading } = useLoginOrSignup(navigation)
  
  
  const onSignInClick = () => {
    navigation.navigate('SignInScreen');
  }
  

  return (
    <View style={styles.container}>
    <KeyboardAwareScrollView
      contentContainerStyle={styles.maincontainer}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={true}
      showsVerticalScrollIndicator={false} >


      <View style={[styles.container, {marginTop: 20}]}>

        <StatusBar style='auto'/>

        {/* ------------ Title --------------- */}
        <View style={styles.title}>
          <Text style={styles.titleHead}>User Sign Up</Text>
          <View style={styles.line} />
        </View>

        {/* ------------- Details ------------- */}
        <View style={{marginTop: 20}}>

          <SignupInput style={[styles.input, {marginTop: 30}]} icon={userIcon} placeholder='User Name' keyboardtype='default' onChangeText={(text)=>setUsername(text)}/>
          {/* <Text style={{color: 'red'}}> { usernameError } </Text> */}
          {usernameError ? <Text style={{ color: 'red', fontSize: 12, paddingLeft: 10, paddingTop: 5 }}>{usernameError}</Text> : null}
          
          <SignupInput style={[styles.input, {marginTop: 30}]} icon={phoneIcon} placeholder='Phone no' keyboardtype='default' onChangeText={(text)=>setPhone(text)}/>
          {phoneError ? <Text style={{ color: 'red', fontSize: 12, paddingLeft: 10, paddingTop: 5 }}>{phoneError}</Text> : null}

          <SignupInput style={[styles.input, {marginTop: 30}]} icon={emailIcon} placeholder='Email id' keyboardtype='default' onChangeText={(text)=>setEmail(text)}/>
          {emailError ? <Text style={{ color: 'red', fontSize: 12, paddingLeft: 10, paddingTop: 5 }}>{emailError}</Text> : null}

          <SignupInput style={[styles.input, {marginTop: 30}]} icon={placeIcon} placeholder='Place' keyboardtype='default' onChangeText={(text)=>setPlace(text)}/>
          
          <SignupInput style={[styles.input, {marginTop: 30}]} icon={passwordIcon} placeholder='Password' keyboardtype='default' onChangeText={(text)=>setPassword(text)} secureTextEntry/>
          {passwordError ? <Text style={{ color: 'red', fontSize: 12, paddingLeft: 10, paddingTop: 5 }}>{passwordError}</Text> : null}

          <SignupInput style={[styles.input, {marginTop: 30}]} icon={confirm} placeholder='Confirm Password' keyboardtype='default' onChangeText={(text)=>setConfPassword(text)} secureTextEntry/>        
          {confPasswordError ? <Text style={{ color: 'red', fontSize: 12, paddingLeft: 10, paddingTop: 5 }}>{confPasswordError}</Text> : null}

          {/* ------------------ Signup button --------------- */}
          <View>{loading}</View>
          <TouchableOpacity onPress={() => handleSignup(username, email, password, phone, place, confPassword)}>
            <View style={[styles.button, {marginTop: 50}]}>
              <Text style={styles.buttonText}>SIGN UP</Text>
            </View>
          </TouchableOpacity>

          <View style={[{flexDirection: 'row'}, {justifyContent: 'center'}, {marginTop: 30}]}>
            <Text style={[styles.text, {letterSpacing: 0.5}, ]}>Already have an account? </Text>
            <TouchableOpacity onPress={onSignInClick}>
              <Text style={[styles.text, {textDecorationLine:'underline'}, {letterSpacing: 0.5}, {color:Colors.PRIMARY}]}>Sign In</Text>
            </TouchableOpacity>
          </View>
                  
        </View>

      </View>
    
        
    </KeyboardAwareScrollView>
    </View>
  );
};

export default UserSignup;
