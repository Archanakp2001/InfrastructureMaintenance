import React from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import PropTypes from 'prop-types';

import backward from './../../assets/images/backward.png';
import Colors from "../Utils/Colors";

const MiniTitle = ({ title, navigateTo }) => {
    return (
        <View style={[{paddingTop: 50}]}>
            <View style={style.miniTitle}>
            <TouchableOpacity onPress={navigateTo}><Image source={backward} style={style.miniIcon} /></TouchableOpacity>
            <Text style={style.miniHead}>{title}</Text>
            </View>
            <View style={style.miniLine} />
        </View>
    );
};

MiniTitle.propTypes = {
    title: PropTypes.string.isRequired,
};

const style = StyleSheet.create({
    miniTitle: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      miniIcon: {
        height: 34,
        width: 34,
        marginLeft: 15,
      },
      miniHead: {
        fontSize: 20,
        color: Colors.PRIMARY,
        fontWeight: 'bold',
        letterSpacing: 1,
        paddingLeft: 20
      },
      miniLine: {
        width: '100%',
        height: 1,
        backgroundColor: Colors.HEADLINE,
        marginVertical: 10,
      },
});

export default MiniTitle;