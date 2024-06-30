import React from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import { useState } from "react";

import downArrow from '../../assets/images/downArrow.png';
import upArrow from '../../assets/images/upArrow.png';
import styles from "../Utils/styles";
import Colors from "../Utils/Colors";

const Faqs = ({title, description}) => {

    const [isCollapsed, setIsCollapsed] = useState(true);
  
    const toggleCollapse = () => {
      setIsCollapsed(!isCollapsed);
    };

    return(
        <View>

            <TouchableOpacity onPress={toggleCollapse} style={{paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', marginTop: 20}}>
                <Text style={{ fontSize: 16, fontWeight: '500' }}>{title}</Text>
                <Image source={isCollapsed ? downArrow : upArrow} style={{height: 26, width: 30}}/>
            </TouchableOpacity>

            {/* Collapsible content */}
            {!isCollapsed && (
            <View style={{ marginTop: 10, paddingLeft: 30, paddingRight: 24 }}>
                <Text style={{ lineHeight: 23, color:Colors.TEXT, textAlign: 'justify' }}>
                {description}
                </Text>
            </View>
            )}
            <View style={[styles.line,{alignSelf: 'center'}]}/>

        </View>
    )
}

export default Faqs;