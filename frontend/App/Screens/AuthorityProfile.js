import React, { useEffect, useState } from "react";
import { Image, Pressable, Text, TextInput, ToastAndroid, TouchableOpacity, View } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import styles from "../Utils/styles";
import Colors from "../Utils/Colors";

import user from '../../assets/images/signup_User.png';
import edit from '../../assets/images/edit.png';
import deleteIcon from './../../assets/images/delete.png';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_ROOT } from "../../apiroot";

const AuthorityProfile = () => {

    const navigation = useNavigation();
    const onEditClick = () => {
        navigation.navigate('AuthorityEdit')
    }


    // ----------------------- Get Authority details -------------------------
    const [authoname, setAuthoname] = useState('');
    const [phone, setPhone] = useState('');
    const [place, setPlace] = useState('');
    const [email, setEmail] = useState('');
    const [department, setDepartment] = useState('');
    const [license, setLicense] = useState('');
    const [imageUri, setImageUri] = useState(null);
    const isFocused = useIsFocused();


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


    // ------------------- Get Authority details ---------------------- 
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
            setImageUri(response.data.photo);
        } else {
            console.error("Unexpected response format:", response.data);
        }
        
        } catch (error) {
        console.error("Error fetching username:", error.message || error);
        }
    };

    useEffect (() => {
        fetchAuthority();
    }, [isFocused]); // Fetch data when the screen is focused or refreshed


    // ----------------- Logout -----------------------
    const onLogOut = async () => {
        try {
            await AsyncStorage.removeItem('token');
            console.log("Logged out successfully");
            navigation.navigate('SignInScreen', { resetAuthoPassword: true });
            ToastAndroid.show('Logged out succesfully', ToastAndroid.SHORT)
        } catch (error) {
            console.error("Error logging out: ", error);
        }
    };


    return (
        <View style={styles.mainContainer}>

            {/* ----------------- Title ------------------- */}
            <View style={[{backgroundColor: Colors.BACKGROUND, }]}>
                <View style={[{flexDirection:'row', justifyContent:'center'}]}>
                    <View style={[{backgroundColor: Colors.PRIMARY, height: 180, width: 330, borderBottomLeftRadius: 60}]}>
                        <Text style={[{paddingTop: 50,fontSize: 20, color: Colors.WHITE, fontWeight: '500', letterSpacing: 1, alignSelf: 'center', paddingLeft: 80}]}>Profile</Text>
                    </View>
                    <View style={[{backgroundColor: Colors.PRIMARY, height: 240, width: 80}]}></View>
                </View>
                <View style={[{width: 410, height: 60, marginTop: -60, backgroundColor: Colors.BACKGROUND, borderTopRightRadius: 60}]}></View>
            </View>


            {/* ------------------ Authority profile picture ------------------ */}
            <Pressable onPress={openGallery}>
                {imageUri ? (
                    <Pressable style={styles.authoProfileImg} onPress={openGallery}>
                        <Image style={{width: 100, height: 100, borderRadius: 50, marginTop: -2}} source={{ uri: imageUri }} />
                        <Pressable onPress={handleDelete}><Image source={deleteIcon} style={{marginLeft: 80, marginTop: -6, height: 15, width: 15}} /></Pressable>
                    </Pressable>
                ) : (
                    <Pressable style={styles.authoProfileImg} onPress={openGallery}>
                        <Image source={user}  style={{height: 90, width: 90}}/>
                        {/* <Image source={edit} style={{height: 18, width: 18, marginLeft: 80}} /> */}
                    </Pressable>
                    
                )}
            </Pressable>

            
            {/* ------------------ Editing view ----------------- */}
            <View style={styles.profileEdit}>
                <TouchableOpacity onPress={onEditClick} style={styles.editImg}><Image source={edit} style={{height: 28, width: 28}}/></TouchableOpacity>
                <Text style={styles.editTextInput}>{authoname}</Text>
                <Text style={styles.editTextInput}>{phone}</Text>
                <Text style={styles.editTextInput}>{email}</Text>
                <Text style={styles.editTextInput}>{place}</Text>
                <Text style={styles.editTextInput}>{department}</Text>
                <Text style={styles.editTextInput}>{license}</Text>
            </View>
            

            {/* --------------- Log out button ---------------- */}
            <TouchableOpacity onPress={onLogOut} style={[{alignItems: 'center'}]}>
                <View style={[styles.button, {width: 350, marginTop: 60, backgroundColor: Colors.BACKGROUND, borderColor: Colors.PRIMARY, borderWidth:1}]}>
                <Text style={[styles.buttonText, {letterSpacing: 1, color: Colors.PRIMARY}]}>Log Out</Text>
                </View>
            </TouchableOpacity>

        </View>
    );
};

export default AuthorityProfile;