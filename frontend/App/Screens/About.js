import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import MiniTitle from '../Components/MiniTitle';
import ProfileCard from './../Components/ProfileCard.js';
import forward from './../../assets/images/forward.png';
import TermsOfUse from '../Components/TermsOfUse.js';
import PrivacyPolicy from '../Components/PrivacyPolicy.js';
import AboutApp from '../Components/AboutApp.js';

import styles from '../Utils/styles';
import Colors from '../Utils/Colors.js';

const About = () => {
  // ---------------- Back Icon click --------------
  const navigation = useNavigation();
  const onIconClick = () => {
    navigation.goBack();
  }

  // --------------------- Terms of use popup ----------------------
  const [isTermsVisible, setIsTermsVisible] = useState(false);

  const termsPopup = () => {
    setIsTermsVisible(!isTermsVisible);
  };

  // --------------------- Privacy popup ----------------------
  const [isPrivacyVisible, setIsPrivacyVisible] = useState(false);

  const privacyPopup = () => {
    setIsPrivacyVisible(!isPrivacyVisible);
  };

  // --------------------- About app popup ----------------------
  const [isAboutVisible, setIsAboutVisible] = useState(false);

  const aboutPopup = () => {
    setIsAboutVisible(!isAboutVisible);
  };

  return (
    
    <View style={styles.mainContainer}>
      
      {/* ---------------------- Title ------------------- */}
      <MiniTitle title='About' navigateTo={onIconClick}/>


      {/* --------------------- Features --------------------- */}
      <View style={[styles.cards, {marginTop: 30}]}>

        <ProfileCard title="Terms of use" icon={forward} navigateTo={termsPopup} />
        <TermsOfUse isVisible={isTermsVisible} onClose={termsPopup} />

        <ProfileCard title="Privacy Policy" icon={forward} navigateTo={privacyPopup} />
        <PrivacyPolicy isVisible={isPrivacyVisible} onClose={privacyPopup} />

        <ProfileCard title="About App" icon={forward} navigateTo={aboutPopup} />
        <AboutApp isVisible={isAboutVisible} onClose={aboutPopup} />

        <View style={styles.profileCard}>
          <Text style={styles.cardTitle}>App Version</Text>
          <Text style={{marginRight: 25}}>v1.0</Text>
        </View>
        
      </View>
    </View>

  );
};


export default About;
