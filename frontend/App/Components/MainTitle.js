import React from "react";
import { View, Text } from "react-native";
import styles from "../Utils/styles";
import Colors from "../Utils/Colors";

const MainTitle = ({title}) => {
    return (
        <View style={[{backgroundColor: Colors.BACKGROUND, }]}>
            <View style={[{flexDirection:'row', justifyContent:'center'}]}>
                <View style={[{backgroundColor: Colors.PRIMARY, height: 100, width: 330, borderBottomLeftRadius: 60}]}>
                    <Text style={[{paddingTop: 50, paddingLeft: 50, fontSize: 20, color: Colors.WHITE, fontWeight: '500', letterSpacing: 1, textAlign: 'center'}]}>{title}</Text>
                </View>
                <View style={[{backgroundColor: Colors.PRIMARY, height: 160, width: 80}]}></View>
            </View>
            <View style={[{width: 410, height: 60, marginTop: -60, backgroundColor: Colors.BACKGROUND, borderTopRightRadius: 60}]}></View>
        </View>
    );
};

export default MainTitle;