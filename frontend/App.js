
import { Keyboard, TouchableWithoutFeedback} from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignInScreen from './App/Screens/SignInScreen';
import UserSignup from './App/Screens/UserSignup';
import AuthoSignup from './App/Screens/AuthoSignup';
import User from './App/Screens/User';
import UserHome from './App/Screens/UserHome';
import UserEditProfile from './App/Screens/UserEditProfile';
import UserFeedback from './App/Screens/UserFeedback';
import UserFaqs from './App/Screens/UserFaqs';
import UserSettings from './App/Screens/UserSettings';
import About from './App/Screens/About';
import UserProfile from './App/Screens/UserProfile';
import PasswordChange from './App/Screens/PasswordChange';
import IssueSummary from './App/Screens/IssueSummary';
import UserIssues from './App/Screens/UserIssues';
import Authority from './App/Screens/Authority';
import AuthorityProfile from './App/Screens/AuthorityProfile';
import AuthorityEdit from './App/Screens/AuthorityEdit';
import IssueReport from './App/Screens/IssueReport';
import IssueStatusUpdate from './App/Screens/IssueStatusUpdate';
import Feedbacks from './App/Screens/Feedbacks';
import Tutorials from './App/Screens/Tutorials';

import MainTitle from './App/Components/MainTitle';
import { CountsProvider } from './App/Contexts/CountsContext';
import { NotificationProvider } from './App/Contexts/NotificationContext';
import { UserNotificationsProvider } from './App/Contexts/UserNotificationsContext';

const Stack = createNativeStackNavigator();

export default function App() {


  return (
    <TouchableWithoutFeedback onPress={()=> {Keyboard.dismiss();}}>
      
      <CountsProvider>
        <NotificationProvider>
          <UserNotificationsProvider>
            
            <NavigationContainer>
              <Stack.Navigator 
                initialRouteName="SignInScreen"
                screenOptions={{
                  headerShown: false
                }}> 
                <Stack.Screen name="SignInScreen" component={SignInScreen} /> 
                <Stack.Screen name="UserSignup" component={UserSignup} />
                <Stack.Screen name="AuthoSignup" component={AuthoSignup} />
                <Stack.Screen name="User" component={User} />
                <Stack.Screen name="UserHome" component={UserHome} />
                <Stack.Screen name="UserProfile" component={UserProfile} />
                <Stack.Screen name="UserIssues" component={UserIssues} />
                <Stack.Screen name="IssueReport" component={IssueReport} />
                <Stack.Screen name="UserEditProfile" component={UserEditProfile} />
                <Stack.Screen name="PasswordChange" component={PasswordChange} />
                <Stack.Screen name="UserFeedback" component={UserFeedback} />
                <Stack.Screen name="UserFaqs" component={UserFaqs} />
                <Stack.Screen name="UserSettings" component={UserSettings} />
                <Stack.Screen name="About" component={About} />
                <Stack.Screen name="MainTitle" component={MainTitle} />
                <Stack.Screen name="IssueSummary" component={IssueSummary} />
                <Stack.Screen name='Authority' component={Authority} />
                <Stack.Screen name='AuthorityProfile' component={AuthorityProfile} />
                <Stack.Screen name='AuthorityEdit' component={AuthorityEdit} />
                <Stack.Screen name='IssueStatusUpdate' component={IssueStatusUpdate} />
                <Stack.Screen name='Feedbacks' component={Feedbacks} />
                <Stack.Screen name='Tutorials' component={Tutorials} />
              </Stack.Navigator>
            </NavigationContainer>
            
          </UserNotificationsProvider>
        </NotificationProvider>
      </CountsProvider>

    </TouchableWithoutFeedback>

  );
}

