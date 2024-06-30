import React, {useState} from "react";
import { View, TextInput, Image, TouchableOpacity } from "react-native";

import menu from '../../assets/images/menu.png';
import search from '../../assets/images/search.png';
import styles from '../Utils/styles';
import Colors from '../Utils/Colors';

const SearchBar = ({onSearch}) => {

    const [searchTerm, setSearchTerm] = useState('');
    const handleSearch = () => {
        if (searchTerm.trim() !== '') {
            onSearch(searchTerm.trim());
        }
    };

    return (
        <View style={[{position: 'absolute', top: 0, zIndex: 1, paddingLeft: 25, marginTop: 50, flexDirection: 'row', gap: 10}]}>
          <View style={[styles.mapSearch, {flexDirection: 'row'}]}>
            <TouchableOpacity onPress={handleSearch}><Image source={search} style={[{height: 20, width: 20, marginRight: 6}]}/></TouchableOpacity>
            <TextInput
              placeholder="Enter location..."
              value={searchTerm}
              onChangeText={setSearchTerm} />
          </View>
          <Image source={menu} style={[{height: 30, width: 30, marginTop: 5, tintColor: Colors.PRIMARY}]}/>
        </View>
    )
}

export default SearchBar;