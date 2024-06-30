import React, { useContext } from "react";
import { Text, View, Image, TouchableOpacity, ScrollView } from "react-native";
import styles from "../Utils/styles";
import MainTitle from "../Components/MainTitle";
import place from '../../assets/images/place.png';
import calendar from '../../assets/images/calendar.png';
import menuVertical from '../../assets/images/menuVertical.png';
import { NotificationContext } from "../Contexts/NotificationContext";
import { useNavigation } from "@react-navigation/native";
import no_noti from './../../assets/images/no_noti.png';
import Colors from "../Utils/Colors";

const AuthorityNoti = () => {

    const navigation = useNavigation();
    const { notifications, removeNotification } = useContext(NotificationContext);

    const handleNotificationPress = async (issueId, notificationId) => {
        navigation.navigate('IssueStatusUpdate', { issueId });

        // Delete the notification
        await removeNotification(notificationId);
    }; 

    return (
        <View style={styles.mainContainer}>

            {/* ----------------- Title ------------------- */}
            <MainTitle title='Notifications'/>

            <ScrollView>
            {/* ------------------- Notifications ------------------------ */}
            <View style={[styles.cards, {paddingBottom: 70}]}>
                {notifications.length === 0 ? (
                    <View style={{alignItems: 'center', marginTop: 70}}>
                        <Image source={no_noti} style={{height: 300, width: 300, marginLeft: 50}} />
                        <Text style={{color: Colors.PRIMARY}}>No new notifications found</Text>
                    </View>
                ) : (notifications.map(notification => (
                    <TouchableOpacity key={notification.id} style={[styles.notifications, ]} onPress={() => handleNotificationPress(notification.issueId, notification.id)}>
                        <View>
                            <View style={[{ flexDirection: 'row', borderBottomWidth: 0.5, borderColor: '#B3B3B3', width: 340, paddingBottom: 6, marginBottom: 10, justifyContent: 'space-between' }]}>
                                <Text style={[{ fontWeight: 'bold' }]}>{notification.title}</Text>
                                <Text>#{notification.issueId}</Text>
                            </View>
                            <View style={[{ flexDirection: 'row', gap: 10, paddingTop: 6 }]}>
                                <Image source={place} />
                                <Text>{notification.location}</Text>
                            </View>
                            <View style={[{ flexDirection: 'row', gap: 10, paddingTop: 15 }]}>
                                <Image source={calendar} style={{ height: 24, width: 25 }} />
                                <Text>{notification.date}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    ))
                )}
            </View>
            </ScrollView>

        </View>
    );
};

export default AuthorityNoti;