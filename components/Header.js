import React from 'react'
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';

// components
import Search from './Search';
import AddButton from './AddButton';

const Header = ({onAdd, onSearch, onBlur, onFocus, disabled}) =>{

    return (
        <View style={styles.header}>
            <View style={styles.searchContainer}>
                <Search
                    onFocus={onFocus} 
                    onBlur={onBlur} 
                    onSearch={onSearch}
                />
                {!disabled && 
                <AddButton onPress={onAdd}/>
                }
            </View>
        </View>
    )
}   

const styles = StyleSheet.create({
    header:{
        height:50,
        paddingHorizontal:16,
        justifyContent:'center'
    },
    searchContainer:{
        flexDirection:'row',
        alignItems:'center'
    }
});

export default Header;