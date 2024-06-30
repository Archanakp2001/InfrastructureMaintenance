
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Dimensions, Image, Pressable } from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import styles from '../Utils/styles';
import report from './../../assets/images/report.png';
import reported from './../../assets/images/reported.png';
import form from './../../assets/images/form.png';
import service from './../../assets/images/service.png';
import Colors from '../Utils/Colors';

const { width } = Dimensions.get('window');

const slides = [
  { key: '1', text: "Please press the 'Report an Issue' button", image: report },
  { key: '2', text: 'To report an issue, please complete the form with the necessary details', image: form },
  { key: '3', text: 'Your issue has been successfully reported', image: reported }, 
  { key: '4', text: 'The issue will be addressed by the authority in accordance with the report', image: service }
];

const Tutorials = ({ navigation }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const onSwipeLeft = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigation.navigate('User'); // Navigate to the main screen of the app
    }
  };

  const onSwipeRight = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <GestureRecognizer
      onSwipeLeft={onSwipeLeft}
      onSwipeRight={onSwipeRight}
      style={[styles.mainContainer, {alignItems: 'center'}]}
    >
      <View style={{alignItems: 'center', width: {width}, marginTop: 180}}>
        <Image style={{height: 360, width:400}} source={slides[currentSlide].image}/>
        <Text style={{color: Colors.PRIMARY, fontSize: 16, marginTop: 60, textAlign: 'center', lineHeight: 25 }}>{slides[currentSlide].text}</Text>
      </View>

      {/* -------------------- Dot Indicators --------------------- */}
      <View style={{flexDirection: 'row', marginTop: 20,}}>
        {slides.map((slide, index) => (
          <View
            key={slide.key}
            style={[{width: 10, height: 10, borderRadius: 5, backgroundColor: '#ccc', marginHorizontal: 5,}, index === currentSlide ? {backgroundColor: Colors.PRIMARY} : null]}
          />
        ))}
      </View>

      {/* ------------------ Skip button ------------------- */}
      <Pressable style={[styles.button, {width: 380, height: 40, alignItems: 'center', marginTop: 80}]} onPress={() => navigation.navigate('User')}>
        <Text style={{color: Colors.WHITE, letterSpacing: 2}}>SKIP</Text>
      </Pressable>
      
    </GestureRecognizer>
  );
};


export default Tutorials;
