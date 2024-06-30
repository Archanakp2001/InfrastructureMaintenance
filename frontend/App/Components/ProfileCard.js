import React from "react";
import { View, Text, Image, TouchableHighlight } from "react-native";
import PropTypes from 'prop-types';
import styles from "../Utils/styles";
import Colors from "../Utils/Colors";

const ProfileCard = ({ title, icon, navigateTo }) => {
    return (
        <TouchableHighlight onPress={navigateTo} underlayColor={Colors.BACKGROUND}>
        <View style={styles.profileCard}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Image source={icon} style={styles.cardIcon} />
        </View>
        </TouchableHighlight>
    );
};

ProfileCard.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.oneOfType([
        PropTypes.number, // for local images (require('./path/to/image.png'))
        PropTypes.object, // for network images ({ uri: 'https://example.com/image.png' })
    ]).isRequired,
};


export default ProfileCard;
