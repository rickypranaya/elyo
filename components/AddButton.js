import React from 'react'
import {View, StyleSheet, TouchableOpacity } from 'react-native'
import Constant from './Constant';
import { Icon } from 'react-native-elements';

const AddButton = ({onPress}) => {
    return (
        <TouchableOpacity style={styles.addButton} onPress={onPress}> 
            <Icon
            name='plus'
            type='material-community'
            color='white'
            size={20}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    addButton :{
        backgroundColor: Constant.PRIMARY_COLOR,
        justifyContent:'center',
        alignItems:'center',
        height:35,
        width:35,
        borderRadius:10,
        marginLeft:16
    }

});

export default AddButton