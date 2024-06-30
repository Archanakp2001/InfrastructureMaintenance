import React, { useState, useEffect, useContext } from "react";
import { Text, View, Image, ScrollView, TouchableOpacity, RefreshControl, Alert, TextInput, Picker } from "react-native";
import styles from "../Utils/styles";

import MainTitle from "../Components/MainTitle";
import place from '../../assets/images/place.png';
import calendar from '../../assets/images/calendar.png';
import { useIsFocused, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_ROOT } from "../../apiroot";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CountsContext } from "../Contexts/CountsContext";
import AuthorityHome from "./AuthorityHome";
import Colors from "../Utils/Colors";
import no_issue from './../../assets/images/no_issue.png';

const FilterComponent = ({ filterCriteria, setFilterCriteria }) => {
    return (
        <View style={{flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginTop: -25, marginBottom: 5}}>
            <Text style={{marginTop: 2}}>Filter by:</Text>
            <TextInput
                style={{borderColor: Colors.BORDER, borderWidth: 0.3, paddingHorizontal: 8, borderRadius: 5, width: 90, }}
                placeholder="Issue With"
                value={filterCriteria.issueWith}
                onChangeText={(text) => setFilterCriteria({ ...filterCriteria, issueWith: text })}
            />
            <TextInput
                style={{borderColor: Colors.BORDER, borderWidth: 0.3, paddingHorizontal: 8, borderRadius: 5, width: 90}}
                placeholder="Location"
                value={filterCriteria.location}
                onChangeText={(text) => setFilterCriteria({ ...filterCriteria, location: text })}
            />
            <TextInput
                style={{borderColor: Colors.BORDER, borderWidth: 0.3, paddingHorizontal: 8, borderRadius: 5, width: 90}}
                placeholder="Status"
                value={filterCriteria.issueType}
                onChangeText={(text) => setFilterCriteria({ ...filterCriteria, status: text })}
            />
        </View>
    );
};

const AuthorityIssues = () => {
    const [issues, setIssues] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [filterCriteria, setFilterCriteria] = useState({ issueWith: "", status: "", location: "" });
    const isFocused = useIsFocused();
    const navigation = useNavigation();
    const { setCounts } = useContext(CountsContext);

    const fetchIssues = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(API_ROOT + '/api/complaints/?user_specific=false', {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });

            if (response.data && Array.isArray(response.data.results)) {
                const reversedIssues = response.data.results.reverse();
                setIssues(reversedIssues);
                calculateCounts(reversedIssues);
            } else {
                console.error("Unexpected response format:", response.data);
            }

        } catch (error) {
            console.error("Error fetching issues:", error.message || error);
        }
    };

    useEffect(() => {
        fetchIssues();
    }, [isFocused]);

    const calculateCounts = (issues) => {
        const inspectedCount = issues.filter(issue => issue.status === 'Issue Inspected' || issue.status === 'Work Issued' || issue.status === 'Work In-Progress' || issue.status === 'Work Completed').length;
        const workIssuedCount = issues.filter(issue => issue.status === 'Work Issued').length;
        const workCompletedCount = issues.filter(issue => issue.status === 'Work Completed').length;

        setCounts({
            inspectedCount,
            workIssuedCount,
            workCompletedCount,
            totalIssues: issues.length,
        });
    };

    const onIssueClick = (issueId) => {
        navigation.navigate('IssueStatusUpdate', { issueId });
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchIssues().finally(() => setRefreshing(false));
    };


    // ---------------------- Filter component ------------------------
    const filterIssues = () => {
        let filteredIssues = issues.filter(issue => {
            return (
                (filterCriteria.issueWith === "" || issue.issue_with.includes(filterCriteria.issueWith)) &&
                (filterCriteria.status === "" || issue.status.includes(filterCriteria.status)) &&
                (filterCriteria.location === "" || issue.location.includes(filterCriteria.location))
            );
        });

        const predictionOrder = {
            'very_poor': 1,
            'poor': 2,
            'satisfactory': 3,
            'good': 4,
        };

        filteredIssues.sort((a, b) => predictionOrder[a.prediction] - predictionOrder[b.prediction]);

        return filteredIssues;
    };


    

    // ------------------------ Get background color based on issue predictions --------------------------
    const getBackgroundColor = (prediction) => {
        switch(prediction) {
           
            case 'good':
                return '#E9FFBF'; // green
            case 'satisfactory':
                return '#ffee93'; // yellow
            case 'poor':
                return '#f6bc66'; // orange
            case 'very_poor':
                return '#E3815D'; // red
            default:
                return '#F1E8D4'; // CARD color
        }
    };


    return (
        <View style={styles.mainContainer}>

            <MainTitle title='Issues' />

            {/* ---------------- filter the issues ----------------- */}
            <FilterComponent filterCriteria={filterCriteria} setFilterCriteria={setFilterCriteria} />


            <ScrollView refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
                <View style={[styles.cards, {marginBottom: 80, marginTop: 30}]}>
                    {filterIssues().length === 0 ? (
                        <View style={{alignItems: 'center', marginTop: 50}}>
                            <Image source={no_issue} style={{height: 300, width: 350, marginRight: 30}}/>
                            <Text style={{color: Colors.PRIMARY}}>No issues found</Text>
                        </View>
                    ) : (filterIssues().map((issue) => (
                            <TouchableOpacity key={issue.id} style={[styles.issues, { backgroundColor: getBackgroundColor(issue.prediction) }]} activeOpacity={0.8} onPress={() => onIssueClick(issue.id)}>
                                <View style={[{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.8, borderColor: '#B3B3B3', paddingBottom: 10 }]}>
                                    <Text style={[{ fontWeight: 'bold' }]}>#{issue.id}</Text>
                                    <Text style={[{ fontWeight: 'bold' }]}>{issue.status.toUpperCase()}</Text>
                                </View>
                                <View style={[{ marginTop: 20, gap: 18 }]}>
                                    <View style={[{ flexDirection: 'row', gap: 10 }]}><Image source={place} /><Text>{issue.location}</Text></View>
                                    <View style={[{ flexDirection: 'row', gap: 10 }]}><Image source={calendar} style={[{ height: 24, width: 24 }]} /><Text>{new Date(issue.created_at).toLocaleDateString()}</Text></View>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

export default AuthorityIssues;
