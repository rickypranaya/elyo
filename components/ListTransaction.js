import React, {useState, useEffect} from 'react';
import { View,StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import Constant from './Constant.js';


const ListTransaction = ({data, onPressItem}) =>{

    // to format to rupiah
    const formatRupiah = (number) =>{
        let n = number
        let balance = n.toString()
        if (balance.length>3 ){
            if(balance.length >6){
                if(balance.length >9){
                    balance =(balance.slice(0,-9)+'.'+balance.slice(-9,-6)+'.'+balance.slice(-6,-3)+'.'+balance.slice(-3))
                }else {
                    balance =(balance.slice(0,-6)+'.'+balance.slice(-6,-3)+'.'+balance.slice(-3))
                } 
            }else {
                balance =(balance.slice(0,-3)+'.'+balance.slice(-3))
            }
        } else {
            balance =(balance)
        } 
        return 'Rp '+balance
    }

    const ListItem = ({item}) => {
        return (
        <TouchableOpacity style={styles.listContainer} onPress={()=>{onPressItem(item)}}>
            <View style={styles.listContainerTop}>
                <Text style={{flex:1, color:Constant.TERTIARY_GREY_COLOR, fontSize:11 }}>No. {item.no}</Text>
                <Text style={styles.profitText}>{formatRupiah(item.total)}</Text>
            </View>

            <Text numberOfLines={1} style={{paddingBottom:3, fontWeight:'bold'}}>{item.nama}</Text>

            <View style={styles.listContainerBottom}>
                <View style={styles.listLeft}>
                    <Text numberOfLines={1} style={{fontSize:13}}>({item.quantity}) {item.name} ...</Text>
                </View>

                <View style={styles.listRight}>
                    <Text>{item.created_at}</Text>
                </View>
            </View>
        </TouchableOpacity>)
    }

    return (
        <FlatList
            initialNumToRender={10}
            showsVerticalScrollIndicator={false}
            data={data}
            renderItem={({ item }) => <ListItem item={item}/>}
            keyExtractor={item => item.id.toString()}
        />
    );
}

const styles = StyleSheet.create({
    listContainerBottom:{
        flexDirection:'row',
    },
    listContainerTop:{
        flexDirection:'row',
    },
    listLeft:{
        flex:1
    },
    listRight:{
        alignItems:'center',
        paddingLeft:10,
    },
    profitText:{
        color: Constant.PRIMARY_COLOR,
        fontSize:13
    },
    boldText:{
        fontWeight:'bold'
    },
    listContainer:{
        paddingHorizontal:16,
        paddingVertical:7,
        borderBottomWidth:1,
        borderBottomColor: "#f0f0f0",
    }
});

export default ListTransaction;