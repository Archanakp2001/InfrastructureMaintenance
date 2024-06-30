import React from "react";
import { Text, View, ActivityIndicator, Image } from "react-native";

import logo from '../../assets/images/logo.png';
import styles from "../Utils/styles";
import Colors from "../Utils/Colors";

export default function LoadingScreen() {
    
    return (
        <View style={styles.loadingContainer}>
            {/* <ActivityIndicator size="large" color="#0000ff" />
            <Text style={[{fontSize: 26},{color: Colors.PRIMARY}]}>PaveGuard</Text> */}

            <Image source={logo}/>
        </View>
    )
}