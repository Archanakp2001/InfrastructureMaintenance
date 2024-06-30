// Popup.js
import React from 'react';
import { View, Modal, Text, TouchableOpacity, Image, Button, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from '../Utils/styles';
import closeButton from './../../assets/images/closeButton.png';
import Colors from '../Utils/Colors';

const TermsOfUse = ({ isVisible, onClose }) => {
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
          <Text style={style.modalHead}>Terms of Use</Text>
          
          <ScrollView>
            <Text style={style.smallHead}>1. Introduction</Text>
            <Text style={style.modalText}>
            The use of our website is subject to the following terms and conditions of use, as amended from time to time (the “Terms”). 
            The Terms are to be read together by you with any terms, conditions or disclaimers provided in the pages of our website. 
            Please review the Terms carefully. The Terms apply to all users of our website, including without limitation, users who are browsers, customers, merchants, vendors and/or contributors of content. 
            If you access and use this website, you accept and agree to be bound by and comply with the Terms and our Privacy Policy. 
            If you do not agree to the Terms or our Privacy Policy, you are not authorized to access our website, use any of our website’s services or place an order on our website.
            </Text>

            <Text style={style.smallHead}>2. Use of our Website</Text>
            <Text style={style.modalText}>
            You agree to use our website for legitimate purposes and not for any illegal or unauthorized purpose, including without limitation, in violation of any intellectual property or privacy law. 
            By agreeing to the Terms, you represent and warrant that you are at least the age of majority in your state or province of residence and are legally capable of entering into a binding contract.
            You agree to not use our website to conduct any activity that would constitute a civil or criminal offence or violate any law. 
            You agree not to attempt to interfere with our website’s network or security features or to gain unauthorized access to our systems.
            You agree to provide us with accurate personal information, such as your email address, mailing address and other contact details in order to complete your order or contact you as needed. 
            You agree to promptly update your account and information. You authorize us to collect and use this information to contact you in accordance with our Privacy Policy.
            </Text>

            <Text style={style.smallHead}>3. General Conditions</Text>
            <Text style={style.modalText}>
            We reserve the right to refuse service to anyone, at any time, for any reason. 
            We reserve the right to make any modifications to the website, including terminating, changing, suspending or discontinuing any aspect of the website at any time, without notice. 
            We may impose additional rules or limits on the use of our website. 
            You agree to review the Terms regularly and your continued access or use of our website will mean that you agree to any changes.
            You agree that we will not be liable to you or any third party for any modification, suspension or discontinuance of our website or for any service, content, feature or product offered through our website.
            </Text>

            <Text style={style.smallHead}>4. Links to Third-Party Websites</Text>
            <Text style={style.modalText}>
            Links from or to websites outside our website are meant for convenience only. 
            We do not review, endorse, approve or control, and are not responsible for any sites linked from or to our website, the content of those sites, the third parties named therein, or their products and services. 
            Linking to any other site is at your sole risk and we will not be responsible or liable for any damages in connection with linking. 
            Links to downloadable software sites are for convenience only and we are not responsible or liable for any difficulties or consequences associated with downloading the software. 
            Use of any downloaded software is governed by the terms of the license agreement, if any, which accompanies or is provided with the software.
            </Text>
 
            <Text style={style.smallHead}>6. Use Comments, Feedback, and Other Submissions</Text>
            <Text style={style.modalText}>
            You acknowledge that you are responsible for the information, profiles, opinions, messages, comments and any other content (collectively, the “Content”) that you post, distribute or share on or through our website or services available in connection with our website. 
            You further acknowledge that you have full responsibility for the Content, including but limited to, with respect to its legality, and its trademark, copyright and other intellectual property ownership.
            You agree that any Content submitted by you in response to a request by us for a specific submission may be edited, adapted, modified, recreated, published, or distributed by us. 
            You further agree that we are under no obligation to maintain any Content in confidence, to pay compensation for any Content or to respond to any Content.
            You agree that you will not post, distribute or share any Content on our website that is protected by copyright, trademark, patent or any other proprietary right without the express consent of the owner of such proprietary right. 
            You further agree that your Content will not be unlawful, abusive or obscene nor will it contain any malware or computer virus that could affect our website’s operations. 
            You will be solely liable for any Content that you make and its accuracy. We have no responsibility and assume no liability for any Content posted by you or any third-party.
            We reserve the right to terminate your ability to post on our website and to remove and/or delete any Content that we deem objectionable. 
            You consent to such removal and/or deletion and waive any claim against us for the removal and/or deletion of your Content.
            </Text>
 
            <Text style={style.smallHead}>7. Your Personal Information</Text>
            <Text style={style.modalText}>
            Please see our Privacy Policy to learn about how we collect, use, and share your personal information.
            </Text>
 
            <Text style={style.smallHead}>8. Errors and Omissions</Text>
            <Text style={style.modalText}>
            Please note that our website may contain typographical errors or inaccuracies and may not be complete or current. 
            We reserve the right to correct any errors, inaccuracies or omissions and to change or update information at any time, without prior notice (including after an order has been submitted). 
            Such errors, inaccuracies or omissions may relate to product description, pricing, promotion and availability and we reserve the right to cancel or refuse any order placed based on incorrect pricing or availability information, to the extent permitted by applicable law.
            We do not undertake to update, modify or clarify information on our website, except as required by law.
            </Text>

            <Text style={style.smallHead}>9. Disclaimer and Limitation of Liability</Text>
            <Text style={style.modalText}>
            You assume all responsibility and risk with respect to your use of our website, which is provided “as is” without warranties, representations or conditions of any kind, either express or implied, with regard to information accessed from or via our website, including without limitation, all content and materials, and functions and services provided on our website, 
            all of which are provided without warranty of any kind, including but not limited to warranties concerning the availability, accuracy, completeness or usefulness of content or information, uninterrupted access, and any warranties of title, non-infringement, merchantability or fitness for a particular purpose. 
            We do not warrant that our website or its functioning or the content and material of the services made available thereby will be timely, secure, uninterrupted or error-free, that defects will be corrected, or that our websites or the servers that make our website available are free of viruses or other harmful components.
            The use of our website is at your sole risk and you assume full responsibility for any costs associated with your use of our website. We will not be liable for any damages of any kind related to the use of our website.
            In no event will we, or our affiliates, our or their respective content or service providers, or any of our or their respective directors, officers, agents, contractors, suppliers or employees be liable to you for any direct, indirect, special, incidental, consequential, exemplary or punitive damages, losses or causes of action, or lost revenue, lost profits, lost business or sales, or any other type of damage, whether based in contract or tort (including negligence), strict liability or otherwise, arising from your use of, or the inability to use, or the performance of, our website or the content or material or functionality through our website, even if we are advised of the possibility of such damages.
            Certain jurisdictions do not allow limitation of liability or the exclusion or limitation of certain damages. In such jurisdictions, some or all of the above disclaimers, exclusions, or limitations, may not apply to you and our liability will be limited to the maximum extent permitted by law.
            </Text>
 
            <Text style={style.smallHead}>10. Entire Agreement</Text>
            <Text style={style.modalText}>
            The Terms and any documents expressly referred to in them represent the entire agreement between you and us in relation to the subject matter of the Terms and supersede any prior agreement, understanding or arrangement between you and us, whether oral or in writing. 
            Both you and we acknowledge that, in entering into these Terms, neither you nor we have relied on any representation, undertaking or promise given by the other or implied from anything said or written between you and us prior to such Terms, except as expressly stated in the Terms.
            </Text>

            <Text style={style.smallHead}>11. Questions or Concerns</Text>
            <Text style={style.modalText}>
            Please send all questions, comments and feedback to us at paveguard@gmail.com.
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


export default TermsOfUse;
