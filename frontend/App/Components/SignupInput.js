import React from "react";
import { View, Image, TextInput } from "react-native";
import styles from "../Utils/styles";

const SignupInput = ({icon, style, placeholder, keyboardtype, ...rest}) => {


    return (

            // <View style={[styles.input, {marginTop: 20}]}>
            <View style={style}>
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

export default SignupInput;