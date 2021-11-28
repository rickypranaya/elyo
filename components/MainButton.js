import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import Constant from './Constant.js';

const MainButton = props =>{
    return (
        <TouchableOpacity style={[styles.main_button,{backgroundColor: props.welcome? 'white': Constant.PRIMARY_COLOR}]} onPress={() => { props.onPress() }}>
            <Text style = {styles.button_text}>{props.title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    main_button:{
        flexDirection:'row',
        marginVertical:10,
        justifyContent:'center',
        alignItems:'center',
        width: Constant.DEVICE_WIDTH *0.6,
        paddingVertical: Platform.OS === 'ios'? 15 : 12,
        borderRadius:5,
    },
    button_text:{
        color:'white',
        fontWeight:'bold',
    },
});

export default MainButton;