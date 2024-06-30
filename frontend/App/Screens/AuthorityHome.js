import React, { useContext, useEffect, useState } from "react";
import { Button, Image, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Calendar, LocaleConfig } from 'react-native-calendars';
import Modal from 'react-native-modal';
import styles from "../Utils/styles";
import Colors from "../Utils/Colors";
import MainTitle from "../Components/MainTitle";
import { CountsContext } from "../Contexts/CountsContext";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_ROOT } from "../../apiroot";

const AuthorityHome = () => {
    
    const { counts, setCounts } = useContext(CountsContext); // Destructure counts from context
    const isFocused = useIsFocused(); // Hook to check if the screen is focused
    const navigation = useNavigation();


    // ----------------------- Get Authority name -------------------------
    const [authoname, setAuthoname] = useState('');
    const fetchAuthority = async () => {
        try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(API_ROOT + '/authority-profile/', {
            headers: {
            Authorization: `Token ${token}`,
            },
        });

        if (response.data && response.data.username) {
            setAuthoname(response.data.username);
        } else {
            console.error("Unexpected response format:", response.data);
        }
        
        } catch (error) {
        console.error("Error fetching username:", error.message || error);
        }
    };

    useEffect (() => {
        fetchAuthority();
    }, [isFocused]); // Fetch data when the screen is focused or refreshed



    // Fetch issues and recalculate counts when screen is refreshed
    const fetchIssues = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(API_ROOT + '/api/complaints/?user_specific=false', {
                headers: {
                    Authorization: `Token ${token}`, // Include the token in the headers
                },
            });

            if (response.data && Array.isArray(response.data.results)) {
                const issues = response.data.results.reverse();
                setCounts({
                    inspectedCount: issues.filter(issue =>
                        issue.status === 'Issue Inspected' ||
                        issue.status === 'Work Issued' ||
                        issue.status === 'Work In-Progress' ||
                        issue.status === 'Work Completed'
                    ).length,
                    workIssuedCount: issues.filter(issue => issue.status === 'Work Issued').length,
                    workCompletedCount: issues.filter(issue => issue.status === 'Work Completed').length,
                    totalIssues: issues.length,
                });
            console.log('Successfully retrieved issue counts!');
            } else {
                console.error("Unexpected response format:", response.data);
            }
        } catch (error) {
            console.error("Error fetching issues:", error.message || error);
        }
    };

    // Refresh data when the screen is focused
    useEffect(() => {
        if (isFocused) {
            fetchIssues();
        }
    }, [isFocused]);


    // Calculate the width of each progress bar based on the maximum count
    const maxCount = Math.max(
        counts.totalIssues
    );

    const totalIssuesWidth = (counts.totalIssues / maxCount) * 100;
    const inspectedCountWidth = (counts.inspectedCount / maxCount) * 100;
    const workIssuedCountWidth = (counts.workIssuedCount / maxCount) * 100;
    const workCompletedCountWidth = (counts.workCompletedCount / maxCount) * 100;


    // Set the locale for the calendar
    LocaleConfig.locales['en'] = {
        monthNames: [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
        ],
        monthNamesShort: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ],
        dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    };
    LocaleConfig.defaultLocale = 'en';

    const [markedDates, setMarkedDates] = useState({});
    const [selectedDate, setSelectedDate] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [note, setNote] = useState('');
    const [notes, setNotes] = useState({});

    const onDayPress = (day) => {
        const date = day.dateString;
        if (notes[date]) {
        setSelectedDate(date);
        setNote(notes[date]);
        setModalVisible(true);
        } else {
        setSelectedDate(date);
        setNote('');
        setModalVisible(true);
        }
    };

    const handleSaveNote = async () => {
        const token = await AsyncStorage.getItem('token');
        const noteData = { date: selectedDate, note };
        try {
            const response = await axios.post(API_ROOT + '/api/authority-calendar-notes/', noteData, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            const newMarkedDates = { ...markedDates };
            newMarkedDates[selectedDate] = { selected: true, selectedColor: Colors.PRIMARY };
            const newNotes = { ...notes, [selectedDate]: note };
            setMarkedDates(newMarkedDates);
            setNotes(newNotes);
            setModalVisible(false);
        } catch (error) {
            console.error("Error saving note:", error.message || error);
        }
    };

    const fetchNotes = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(API_ROOT + '/api/authority-calendar-notes/', {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
    
            if (response.data && response.data.notes && Array.isArray(response.data.notes)) {
                const notesData = {};
                const markedDatesData = {};
                response.data.notes.forEach(note => {
                    notesData[note.date] = note.note;
                    markedDatesData[note.date] = { selected: true, selectedColor: Colors.PRIMARY };
                });
                setNotes(notesData);
                setMarkedDates(markedDatesData);
                console.log('Successfully retrieved calendar notes!');
            } else {
                console.error("Unexpected response format:", response.data);
            }
        } catch (error) {
            console.error("Error fetching notes:", error.message || error);
        }
    };
    
    useEffect(() => {
        if (isFocused) {
            fetchNotes();
        }
    }, [isFocused]);
    


    const handleDeleteNote = async () => {
        const token = await AsyncStorage.getItem('token');
        try {
            await axios.delete(`${API_ROOT}/api/authority-calendar-notes/${selectedDate}/`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            const newMarkedDates = { ...markedDates };
            delete newMarkedDates[selectedDate];
            const newNotes = { ...notes };
            delete newNotes[selectedDate];
            setMarkedDates(newMarkedDates);
            setNotes(newNotes);
            setModalVisible(false);
        } catch (error) {
            console.error("Error deleting note:", error.message || error);
        }
    };
    

    // ---------------------- fetch feedbacks -----------------------
    const [feedbacks, setFeedbacks] = useState([]);

  const fetchFeedbacks = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(API_ROOT + '/api/feedbacks/?user_specific=false', {
        headers: {
          Authorization: `Token ${token}`,
        },
        
      });
      if (response.data && Array.isArray(response.data.results)) {
        // Reverse the order of issues array to show recent issues first
        const reversedFeeds = response.data.results.reverse();
        setFeedbacks(reversedFeeds);
        console.log('Successfully retrieved user feedbacks!');
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching issues:", error.message || error);
    }
  };

    useEffect (() => {
    fetchFeedbacks();
    }, [isFocused]); // Fetch data when the screen is focused or refreshed
    

    return (
        <View style={[styles.mainContainer,]}>
            

            {/* ------------------- Main title ---------------------- */}
            <View style={[{backgroundColor: Colors.BACKGROUND, }]}>
                <View style={[{flexDirection:'row', justifyContent:'center'}]}>
                    <View style={[{backgroundColor: Colors.PRIMARY, height: 120, width: 330, borderBottomLeftRadius: 60}]}>
                        <Text style={[{paddingTop: 60, paddingLeft: 60, fontSize: 20, color: Colors.WHITE, fontWeight: '500', letterSpacing: 1, textAlign: 'center'}]}>Welcome {authoname}!!</Text>
                    </View>
                    <View style={[{backgroundColor: Colors.PRIMARY, height: 180, width: 80}]}></View>
                </View>
                <View style={[{width: 410, height: 60, marginTop: -60, backgroundColor: Colors.BACKGROUND, borderTopRightRadius: 60}]}></View>
            </View>
            <ScrollView>

                {/* -------------------- Issues overview -------------------- */}
                <View style={{ marginHorizontal: 25 }}>
                    
                    <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 15, letterSpacing: 0.5, color: Colors.PRIMARY, marginLeft: 5 }}>Issues Overview</Text>
                    <View style={{height: 320, backgroundColor: Colors.CARD, elevation: 6, borderRadius: 15, paddingHorizontal: 20, paddingVertical: 30}}>

                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={{fontSize: 15, letterSpacing: 1, fontWeight: '500'}}>Issues Reported:</Text>
                            <Text style={{fontSize: 15, letterSpacing: 1, color: Colors.PRIMARY}}>{counts.totalIssues}</Text>
                        </View>
                        <View style={{height: 5, backgroundColor: Colors.PRIMARY, marginTop: 12, marginBottom: 30, borderRadius: 10, width: totalIssuesWidth+'%'}}/>

                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={{fontSize: 15, letterSpacing: 1, fontWeight: '500'}}>Issues Inspected:</Text>
                            <Text style={{fontSize: 15, letterSpacing: 1, color: Colors.PRIMARY}}>{counts.inspectedCount}</Text>
                        </View>
                        <View style={{height: 5, backgroundColor: Colors.PRIMARY, marginTop: 12, marginBottom: 30, borderRadius: 10, width: inspectedCountWidth+'%'}}/>

                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={{fontSize: 15, letterSpacing: 1, fontWeight: '500'}}>Pending Works:</Text>
                            <Text style={{fontSize: 15, letterSpacing: 1, color: Colors.PRIMARY}}>{counts.workIssuedCount}</Text>
                        </View>
                        <View style={{height: 5, backgroundColor: Colors.PRIMARY, marginTop: 12, marginBottom: 30, borderRadius: 10, width: workIssuedCountWidth+'%'}}/>

                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={{fontSize: 15, letterSpacing: 1, fontWeight: '500'}}>Work Completed:</Text>
                            <Text style={{fontSize: 15, letterSpacing: 1, color: Colors.PRIMARY}}>{counts.workCompletedCount}</Text>
                        </View>
                        <View style={{height: 5, backgroundColor: Colors.PRIMARY, marginTop: 12, marginBottom: 30, borderRadius: 10, width: workCompletedCountWidth+'%'}}/>

                    </View>

                </View>


                {/* -------------------- Calendar for work issue ---------------- */}
                <View style={{ marginHorizontal: 25, marginTop: 60}}>
                    
                    <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 15, letterSpacing: 0.5, color: Colors.PRIMARY, marginLeft: 5 }}>Get it Done</Text>

                    <Calendar
                        onDayPress={onDayPress}
                        markedDates={markedDates}
                        style={{borderRadius: 10, elevation: 5, paddingBottom: 20, }}
                        theme={{
                            calendarBackground: Colors.CARD,
                            selectedDayBackgroundColor: Colors.PRIMARY,
                            todayTextColor: '#C28603',
                            arrowColor: Colors.PRIMARY
                        }}
                    />
                    
                    <Modal isVisible={modalVisible}>
                        <View style={{backgroundColor: 'white', padding: 20, borderRadius: 10, alignItems: 'center',}}>
                        <Text style={{fontSize: 16}}>Note for {new Date(selectedDate).toLocaleDateString()}</Text>
                        <TextInput
                            style={[styles.input, {paddingHorizontal: 10}]}
                            value={note}
                            onChangeText={setNote}
                            placeholder="Enter note"
                        />
                        <View style={{flexDirection: 'row', gap: 20, marginTop: 20}}>
                            <Pressable style={{height: 35, width: 80, backgroundColor: Colors.PRIMARY, borderRadius: 8, alignItems: 'center', justifyContent: 'center'}} onPress={handleSaveNote}>
                                <Text style={{color: Colors.WHITE, fontSize: 15}}>SAVE</Text>
                            </Pressable>
                            {notes[selectedDate] && 
                                <Pressable style={{height: 35, width: 80, backgroundColor: 'red', borderRadius: 8, alignItems: 'center', justifyContent: 'center'}} onPress={handleDeleteNote} color="red">
                                    <Text style={{color: Colors.WHITE, fontSize: 15}}>DELETE</Text>
                                </Pressable>
                            }
                            <Pressable style={{height: 35, width: 80, backgroundColor: Colors.PRIMARY, borderRadius: 8, alignItems: 'center', justifyContent: 'center'}} onPress={() => setModalVisible(false)}>
                                <Text style={{color: Colors.WHITE, fontSize: 15}}>CLOSE</Text>
                            </Pressable>
                        </View>
                        
                        </View>
                    </Modal>

                </View>


                {/* ------------------------ User feedbacks ---------------------- */}
                <View style={{ marginHorizontal: 25, marginTop: 60, marginBottom: 80}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 15, letterSpacing: 0.5, color: Colors.PRIMARY, marginLeft: 5 }}>User Feedbacks</Text>
                        <Pressable onPress={() => {navigation.navigate('Feedbacks')}}>
                            <Text style={{marginRight: 5, marginTop: 6, color: Colors.TEXT}}>View All</Text>
                        </Pressable>
                    </View>                    
                    <View>
                    {feedbacks.slice(0,2).map((feedback, index) => (
                        <View key={index} style={styles.feedbacks}>
                            <Text style={{textAlign: 'right', color: Colors.PRIMARY}}>{new Date(feedback.created_at).toLocaleDateString()}</Text>
                            <Text style={[{ fontSize: 15 }]}>{feedback.content}</Text>
                        </View>
                    ))}
                    </View>
                </View>


            </ScrollView>


        </View>
    );
};

export default AuthorityHome;