import { StyleSheet } from 'react-native';
import Colors from './Colors';
import IssueSummary from '../Screens/IssueSummary';

const styles = StyleSheet.create({
    // -------------- Loading Screen ---------------
    loadingContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      backgroundColor: Colors.BACKGROUND,
    },

    // ------------------ Sign In Screen --------------------
    maincontainer: {
      margin: 0,
      alignItems:'center',
      justifyContent: 'center',
      paddingBottom: 50
    },
    container: {
      flex: 1,
      backgroundColor: Colors.BACKGROUND,
      alignItems:'center',
      justifyContent: 'center',
      // paddingTop: 30,
      // paddingBottom: 120
    },
    imgcontainer: {
      height: 400,
    },
    formcontainer: {
      marginTop: 80
    },
    input :{
      flexDirection: 'row', 
      marginTop: 30,
      borderColor: Colors.BORDER,
      borderWidth: 0.4,
      width: 340,
      height: 50,
      borderRadius: 15,
    },
    inputicon: {
      marginTop: 12,
      marginLeft: 10,
      height: 24,
      width: 24,
    },
    textinput: {
      padding: 10,
      width: 340,
      height: 50,
      letterSpacing: 1,
      fontSize: 16,
      
    },
    text: {
      color: 'Colors.TEXT,'
    },
    button: {
      backgroundColor: Colors.PRIMARY,
      height: 50,
      borderRadius: 15,
      padding: 10,
      marginTop: 30
    },
    buttonText: {
      color: Colors.WHITE,
      textAlign: 'center',
      fontSize: 20,
      letterSpacing: 3,
      fontWeight: '500',
    },

    // ------------- SignUp Popup window -----------------
    modalContainer: {
      flex:1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalContent: {
      backgroundColor: Colors.BACKGROUND,
      height: 320,
      width: 340, 
      padding: 20,
      borderRadius: 15,
      alignItems: 'center',
      elevation: 10
    },
    popupText: {
      color: Colors.PRIMARY,
      fontWeight: 'bold',
      fontSize: 22,
      marginTop: 10
    },
    categoryContainer: {
      marginTop: 50,
      flexDirection: 'row',
      gap: 30,
    },
    category: {
      alignItems: 'center'
    },
    categoryIcon: {
      width: 130,
      height: 130,
      borderWidth: 0.2,
      borderRadius: 100,
      alignItems: 'center',
      justifyContent: 'center',
    },
    categoryText: {
      marginTop: 6,
      color: Colors.TEXT,
    },
    closeButton: {
      marginBottom: 4,
    },

    // ----------------- User Sign up ------------------
    title : {
      flex: 1,
      marginTop: 25,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%'
    },
    titleHead: {
      fontSize: 22,
      color: Colors.PRIMARY,
      fontWeight: 'bold',
      letterSpacing: 1,
    },
    line: {
      width: 390,
      height: 1,
      backgroundColor: Colors.HEADLINE,
      marginVertical: 14,
    },

    // ----------- User Home --------------
    map: {
      flex: 1,
      zIndex: 0
    },
    mapSearch: {
      width: 330,
      height: 40,
      borderRadius: 12,
      padding: 10,
      backgroundColor: Colors.WHITE,
      elevation: 5,
      flexDirection:'row'
    },
    issueButton:{
      height: 50,
      width: 200,
      backgroundColor: 'rgba(138, 102, 60, 0.85)',
      borderRadius: 15,
      marginTop: -24,
      alignItems: 'center',
      justifyContent: 'center',
      
    },

    // ---------------- Common user styles --------------
    mainContainer: {
      flex: 1,
      backgroundColor: Colors.BACKGROUND,
      // paddingTop: 50,
    },
    mainHead: {
      fontSize: 22,
      color: Colors.PRIMARY,
      fontWeight: 'bold',
      letterSpacing: 1,
      paddingLeft: 20
    },
    mainLine: {
      width: '100%',
      height: 1,
      backgroundColor: Colors.HEADLINE,
      marginVertical: 14,
    },
    
    miniContainer: {
      flex:1,

    },

    // ---------------- User profile ----------------
    cards: {
      alignItems: 'center',
      marginTop: 10,
    },
    profileCard: {
      height: 60,
      width: 360,
      backgroundColor: Colors.CARD,
      borderRadius: 15,
      elevation: 5,
      alignItems: 'center',
      flexDirection: 'row',
      marginBottom: 25
    },
    cardTitle: {
      flex: 1,
      fontSize: 18,
      color: Colors.PRIMARY,
      letterSpacing: 0.8,
      paddingLeft: 20,
      fontWeight: '500'
    },
    cardIcon: {
      height: 40,
      width: 40,
      tintColor: Colors.PRIMARY,
      marginRight: 10
    },
    
    // ----------------- Edit Profile -----------------
    editInput: {
      borderBottomWidth: 0.2,
      width: 350,
      height: 40,
      borderColor: Colors.TEXT,
      color: '#000',
      letterSpacing: 1,
      marginBottom: 30,
      fontWeight: '500'
    },

    // ----------------- Feedbacks ----------------------
    feedbacks: {
      width: 360,
      backgroundColor: Colors.CARD,
      marginBottom: 10,
      borderRadius: 10,
      paddingVertical: 20,
      paddingHorizontal: 20,
      elevation: 4
    },
    newFeed : {
      width: 320,
      borderWidth: 0.2,
      borderColor: Colors.BORDER,
      borderRadius: 10,
      padding: 20,
    },

    // --------------------- Settings -----------------------
    settings: {
     flexDirection: 'row',
     alignItems: 'center',
     width: 360,
    //  justifyContent: 'space-between',
     borderBottomWidth: 0.3,
     paddingBottom: 10,
     marginTop: 20
    },

    // ----------------- Notifications --------------------
    notifications: {
      marginBottom: 20,
      backgroundColor: Colors.CARD,
      elevation: 3,
      borderRadius: 15,
      width: 380, 
      padding: 10,
      flexDirection: 'row', 
      justifyContent: 'center',
      
    }, 

    // ----------------- Issues ----------------------
    issues: {
      backgroundColor: Colors.CARD,
      elevation: 6,
      width: 380,
      height: 140,
      borderRadius: 15,
      paddingVertical: 10, 
      paddingHorizontal: 15, 
      marginBottom: 20
    },

    // -------------- Authority Profile ----------------
    authoProfileImg: {
      borderWidth: 1, 
      borderColor: '#EAEAEA', 
      height: 100, 
      width: 100, 
      borderRadius: 100, 
      alignSelf: 'center', 
      marginTop: -100, 
      backgroundColor: Colors.BACKGROUND,
      alignItems: 'center',
    },
    authoName: {
      textAlign: 'center', 
      marginTop: 10, 
      color: Colors.PRIMARY
    },
    profileEdit: {
      width: 360,
      backgroundColor: Colors.BACKGROUND,
      elevation: 5,
      marginTop: 40,
      alignSelf: 'center',
      borderRadius: 15,
      paddingHorizontal: 20,
      paddingBottom: 50
    },
    editImg: {
      height: 45,
      width: 45,
      borderWidth: 1,
      borderColor: '#DCDCDC',
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-end',
      marginRight: 20,
      marginTop: -18,
      backgroundColor: Colors.BACKGROUND
    },
    editTextInput: {
      marginTop: 30,
      borderBottomColor: Colors.BORDER,
      borderBottomWidth: 0.5,
      paddingBottom: 4,
      letterSpacing: 0.5
    }
    
  });
  
  export default styles;