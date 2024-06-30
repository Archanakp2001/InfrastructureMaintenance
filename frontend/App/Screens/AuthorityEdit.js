import React, { useEffect, useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import styles from "../Utils/styles";
import MiniTitle from "../Components/MiniTitle";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_ROOT } from "../../apiroot";

const AuthorityEdit = () => {

    // ------------ title ------------
    const navigation = useNavigation();
    const onIconClick = () => {
        navigation.goBack();
    }


    // ----------------------- Get Authority details -------------------------
    const [authoname, setAuthoname] = useState('');
    const [phone, setPhone] = useState('');
    const [place, setPlace] = useState('');
    const [email, setEmail] = useState('');
    const [department, setDepartment] = useState('');
    const [license, setLicense] = useState('');
    const isFocused = useIsFocused();

    const fetchAuthority = async () => {
        try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(API_ROOT + '/authority-profile/', {
            headers: {
            Authorization: `Token ${token}`,
            },
        });

        if (response.data && response.data.username) {
            setAuthoname(response.data.username);
            setPhone(response.data.phone);
            setDepartment(response.data.department);
            setPlace(response.data.place);
            setLicense(response.data.license_no);
            setEmail(response.data.email);
        } else {
            console.error("Unexpected response format:", response.data);
        }
        
        } catch (error) {
        console.error("Error fetching username:", error.message || error);
        }
    };

    useEffect (() => {
        fetchAuthority();
    }, [isFocused]); 



    // ----------- submit -------------
    const onSubmit = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          const response = await axios.put(
            API_ROOT + '/authority-update/', 
            {
              username: authoname,
              email,
              profile: {
                phone,
                place,
                department,
                license_no: license
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


    return (
        <View style={styles.mainContainer}>

            {/* ------------------- Title ------------------ */}
            <MiniTitle title="Edit Profile" navigateTo={onIconClick}/>


            {/* ------------------- Edit profile inputs ------------------- */}
            <View style={[{alignItems: 'center', marginTop: 30}]}>
                <TextInput style={styles.editInput} placeholder="Authority Name" value={authoname} onChangeText={setAuthoname}/>
                <TextInput style={styles.editInput} placeholder="Phone No" value={phone} onChangeText={setPhone}/>
                <TextInput style={styles.editInput} placeholder="Email id" value={email} onChangeText={setEmail}/>
                <TextInput style={styles.editInput} placeholder="Place" value={place} onChangeText={setPlace}/>
                <TextInput style={styles.editInput} placeholder="Department" value={department} onChangeText={setDepartment}/>
                <TextInput style={styles.editInput} placeholder="License no" value={license} onChangeText={setLicense}/>
            </View>


            {/* ------------------- Submit button -------------------- */}
            <TouchableOpacity onPress={onSubmit} style={[{alignItems: 'center'}]}>
                <View style={[styles.button, {width: 350, marginTop: 20}]}>
                    <Text style={[styles.buttonText, {letterSpacing: 2, fontSize: 18}]}>SAVE CHANGES</Text>
                </View>
            </TouchableOpacity>

        </View>
    );
};

export default AuthorityEdit;