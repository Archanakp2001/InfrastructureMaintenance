import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert, TextInput, RefreshControl } from 'react-native';
import axios from 'axios';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainTitle from '../Components/MainTitle';
import place from '../../assets/images/place.png';
import calendar from '../../assets/images/calendar.png';
import alert from '../../assets/images/alert.png';
import styles from '../Utils/styles';
import { API_ROOT } from '../../apiroot';
import Colors from '../Utils/Colors';
import no_issue from './../../assets/images/no_issue.png';

const FilterComponent = ({ filterCriteria, setFilterCriteria }) => {
  return (
      <View style={{flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginTop: -30, marginBottom: 5}}>
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


const UserIssues = () => {
  const [issues, setIssues] = useState([]);
  const isFocused = useIsFocused(); // Hook to check if the screen is focused
  const navigation = useNavigation();
  const [filterCriteria, setFilterCriteria] = useState({ issueWith: "", status: "", location: "" });


  const fetchIssues = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(API_ROOT + '/api/complaints/?user_specific=true', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.data && Array.isArray(response.data.results)) {
        // Reverse the order of issues array to show recent issues first
        const reversedIssues = response.data.results.reverse();
        setIssues(reversedIssues);
        // console.log(reversedIssues);
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching issues:", error.message || error);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [isFocused]); // Fetch data when the screen is focused or refreshed


  // ------------------- Handle issue click ---------------------
  const onIssueClick = (issueId) => {
      navigation.navigate('IssueReport', { issueId });
  };

  
  // ---------------- Delete issue -------------------
  const handleDeleteConfirmation = (issueId) => {
    Alert.alert(
      'Delete Issue',
      'Are you sure you want to delete this issue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => onDeleteIssue(issueId) },
      ],
      { cancelable: true }
    );
  };

  const onDeleteIssue = async (issueId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`${API_ROOT}/api/complaints/${issueId}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      // Refresh issues after deletion
      fetchIssues();
    } catch (error) {
      console.error("Error deleting issue:", error.message || error);
    }
  };


  // ----------------- fetch issues -----------------------
  const filterIssues = () => {
    return issues.filter(issue => {
        return (
            (filterCriteria.issueWith === "" || issue.issue_with.includes(filterCriteria.issueWith)) &&
            (filterCriteria.status === "" || issue.status.includes(filterCriteria.status)) &&
            (filterCriteria.location === "" || issue.location.includes(filterCriteria.location))
        );
    });
  };


  // ----------------- refresh the issues ----------------
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    fetchIssues().finally(() => setRefreshing(false));
  };


  return (
    <View style={[styles.mainContainer, { paddingBottom: 80 }]}>
      <MainTitle title='Issues' />

      {/* ---------------- filter the issues ----------------- */}
      {filterIssues().length === 0 ? (<View />): (
        <FilterComponent filterCriteria={filterCriteria} setFilterCriteria={setFilterCriteria} />
      )}


      {/* ----------------- Issues list ------------------- */}
      <ScrollView refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>

        <View style={[styles.cards, {marginTop: 25}]}>
          {filterIssues().length === 0 ? (
            <View style={{alignItems: 'center', marginTop: 50}}>
                <Image source={no_issue} style={{height: 300, width: 350, marginRight: 30}}/>
                <Text style={{color: Colors.PRIMARY}}>No issues found</Text>
            </View>
          ) : (
            filterIssues().map((issue) => (
              <TouchableOpacity
                key={issue.id}
                style={styles.issues}
                onPress={() => onIssueClick(issue.id)}
                onLongPress={() => handleDeleteConfirmation(issue.id)}
                activeOpacity={0.8}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.8, borderColor: '#B3B3B3', paddingBottom: 10 }}>
                  <Text style={{ fontWeight: 'bold' }}>{new Date(issue.created_at).toLocaleDateString()}</Text>
                  <Text style={{ fontWeight: 'bold' }}>{issue.status.toUpperCase()}</Text>
                </View>

                <View style={{ marginTop: 20, gap: 18 }}>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <Image source={place} style={{ height: 24, width: 24 }} />
                    <Text>{issue.location}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <Image source={alert} style={{ height: 24, width: 24 }} />
                    <Text>{issue.issue_with} - {issue.issue_type}</Text>
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

export default UserIssues;
