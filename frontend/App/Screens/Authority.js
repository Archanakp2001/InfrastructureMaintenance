
import React, { useContext } from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import screen components
import AuthorityHome from './AuthorityHome';
import AuthorityIssues from './AuthorityIssues';
import AuthorityNotifications from './AuthorityNoti';
import AuthorityProfile from './AuthorityProfile';

import styles from '../Utils/styles';
import Colors from '../Utils/Colors';
import { NotificationContext } from '../Contexts/NotificationContext';

const Tab = createBottomTabNavigator();

const Authority = () => {

  const { notifications } = useContext(NotificationContext);
  const notificationCount = notifications.length;

  

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions = {{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 15,
          right: 15,
          shadowOpacity: 30,
          elevation: 6,
          height: 60,
          borderRadius: 20,
          backgroundColor: Colors.WHITE,
        }, 
        
      }}
      
      
    >
      <Tab.Screen
        name="Home"
        component={AuthorityHome}
        options={{
          tabBarLabel: 'Home' ,
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('./../../assets/images/home.png')}
              style={{ width: 30, height: 30, tintColor: focused ? Colors.PRIMARY : '#B0B0B0'}}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Issues"
        component={AuthorityIssues}
        options={{
          tabBarLabel: 'Issues',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('./../../assets/images/issues.png')}
              style={{ width: 30, height: 30, tintColor: focused ? Colors.PRIMARY : '#B0B0B0' }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={AuthorityNotifications}
        options={{
          tabBarLabel: 'Notifications',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('./../../assets/images/notifications.png')}
              style={{ width: 30, height: 30, tintColor: focused ? Colors.PRIMARY : '#B0B0B0' }}
            />
          ),
          // tabBarBadge: notificationCount
          tabBarBadge: notificationCount > 0 ? notificationCount : null
        }}
      />
      <Tab.Screen
        name="Profile"
        component={AuthorityProfile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('./../../assets/images/user.png')}
              style={{ width: 30, height: 30, tintColor: focused ? Colors.PRIMARY : '#B0B0B0' }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Authority;
