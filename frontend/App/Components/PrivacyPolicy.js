// Popup.js
import React from 'react';
import { View, Modal, Text, TouchableOpacity, Image, Button, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from '../Utils/styles';
import closeButton from './../../assets/images/closeButton.png';
import Colors from '../Utils/Colors';

const PrivacyPolicy = ({ isVisible, onClose }) => {
  const navigation = useNavigation();

  return (
    
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>

        {/* --------- close button ---------- */}
        <TouchableOpacity onPress={onClose}>
            <Image style={styles.closeButton} source={closeButton}/>
        </TouchableOpacity>

        {/* ------------- window --------------- */}
        <View style={style.modalContent}>
          <Text style={style.modalHead}>Privacy Policy</Text>
          
          <ScrollView>
            <Text style={style.smallHead}>1. Introduction</Text>
            <Text style={style.modalText}>
            We are responsible for maintaining and protecting the Personal Information under our control. 
            We have designated an individual or individuals who is/are responsible for compliance with our privacy policy.
            </Text>

            <Text style={style.smallHead}>2. Identifying Purposes</Text>
            <Text style={style.modalText}>
            We collect, use and disclose Personal Information to provide you with the product or service you have requested and to offer you additional products and services we believe you might be interested in. 
            The purposes for which we collect Personal Information will be identified before or at the time we collect the information. 
            In certain circumstances, the purposes for which information is collected may be clear, and consent may be implied, such as where your name, address and payment information is provided as part of the order process.
            </Text>
  
            <Text style={style.smallHead}>3. Consent</Text>
            <Text style={style.modalText}>
            Knowledge and consent are required for the collection, use or disclosure of Personal Information except where required or permitted by law. 
            Providing us with your Personal Information is always your choice. However, your decision not to provide certain information may limit our ability to provide you with our products or services. 
            We will not require you to consent to the collection, use, or disclosure of information as a condition to the supply of a product or service, except as required to be able to supply the product or service.
            </Text>
 
            <Text style={style.smallHead}>4. Limiting Collection</Text>
            <Text style={style.modalText}>
            The Personal Information collected will be limited to those details necessary for the purposes identified by us. 
            With your consent, we may collect Personal Information from you in person, over the telephone or by corresponding with you via mail, facsimile, or the Internet.
            </Text>
 
            <Text style={style.smallHead}>5. Limiting Use, Disclosure and Retention</Text>
            <Text style={style.modalText}>
            Personal Information may only be used or disclosed for the purpose for which it was collected unless you have otherwise consented, or when it is required or permitted by law. 
            Personal Information will only be retained for the period of time required to fulfill the purpose for which we collected it or as may be required by law. 
            </Text>

            <Text style={style.smallHead}>6. Accuracy</Text>
            <Text style={style.modalText}>
            Personal Information will be maintained in as accurate, complete and up-to-date form as is necessary to fulfill the purposes for which it is to be used.
            </Text>
 
            <Text style={style.smallHead}>7. Safeguarding Customer Information</Text>
            <Text style={style.modalText}>
            Personal Information will be protected by security safeguards that are appropriate to the sensitivity level of the information. 
            We take all reasonable precautions to protect your Personal Information from any loss or unauthorized use, access or disclosure.
            </Text>
 
            <Text style={style.smallHead}>8. Openness</Text>
            <Text style={style.modalText}>
            We will make information available to you about our policies and practices with respect to the management of your Personal Information.
            </Text>
 
            <Text style={style.smallHead}>9. Customer Access</Text>
            <Text style={style.modalText}>
            Upon request, you will be informed of the existence, use and disclosure of your Personal Information, and will be given access to it. 
            You may verify the accuracy and completeness of your Personal Information, and may request that it be amended, if appropriate. 
            However, in certain circumstances permitted by law, we will not disclose certain information to you. 
            For example, we may not disclose information relating to you if other individuals are referenced or if there are legal, security or commercial proprietary restrictions.
            </Text>
 
            <Text style={style.smallHead}>10. Cookies</Text>
            <Text style={style.modalText}>
            A cookie is a small computer file or piece of information that may be stored in your computer's hard drive when you visit our websites. We may use cookies to improve our website’s functionality and in some cases, to provide visitors with a customized online experience.
            Cookies are widely used and most web browsers are configured initially to accept cookies automatically. You may change your Internet browser settings to prevent your computer from accepting cookies or to notify you when you receive a cookie so that you may decline its acceptance. 
            Please note, however, if you disable cookies, you may not experience optimal performance of our website.
            </Text>


          </ScrollView>
          
        </View>

      </View>
    </Modal>
  );
};


const style = StyleSheet.create({
    modalContent: {
        height: 750, 
        width: 380,
        backgroundColor: Colors.BACKGROUND, 
        elevation: 3,
        borderRadius: 15,
        marginTop: 10,
        paddingVertical: 20,
        paddingHorizontal: 15
    },
    modalHead: {
        color: Colors.PRIMARY, 
        fontSize: 16, 
        fontWeight: '500',
        borderBottomColor: Colors.BORDER,
        borderBottomWidth: 0.4,
        width: '90%',
        textAlign: 'center',
        paddingBottom: 10,
        alignSelf: 'center',
        marginBottom: 15
    },
    modalText: {
        color: Colors.TEXT,
        textAlign: 'justify',
        lineHeight: 20
    }, 
    smallHead: {
        fontWeight: '500',
        marginTop: 12,
        marginBottom: 4
    }
});


export default PrivacyPolicy;
