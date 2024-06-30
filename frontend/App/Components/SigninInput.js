import React from "react";
import { View, Image, TextInput, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from "../Utils/styles";
import passwordIcon from '../../assets/images/password.png';

const SigninInput = ({icon, placeholder, component, keyboardtype, ...rest}) => {

    return (

            <View style={styles.input}>
                <Image source={icon} style={styles.inputicon}/>
                <TextInput 
                    contentContainerStyle={styles.maincontainer}
                    keyboardShouldPersistTaps="handled" 
                    style={styles.textinput} 
                    placeholder={placeholder} 
                    keyboardType={keyboardtype} 
                    {...rest} 
                 />
            </View>

    );
};

export default SigninInput;