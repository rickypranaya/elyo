import React from 'react';
import { View,StyleSheet, TouchableHighlight, TouchableOpacity, Text } from 'react-native';
import Constant from './Constant.js';
import { SwipeListView } from 'react-native-swipe-list-view';

const ListProduct = ({data, onPressItem, onDelete}) =>{

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

    const listItem = ({item}) => {
        return (
        <TouchableHighlight underlayColor="#f5f5f5" style={styles.itemContainer} onPress={()=>{onPressItem(item)}}>
            <View>
                <Text style={{}}>{item.name}</Text>

                <View style={{ flexDirection: 'row', justifyContent:'space-between', paddingTop:3}}>

                    {/* harga jual */}
                    <View style={{alignItems:"flex-end"}}>
                        <Text style={[styles.smallText,{color: 'grey'}]}>{formatRupiah(item.price)}</Text>
                    </View>

                </View>
            </View>
        </TouchableHighlight>
        )
    }

    const RenderHiddenItem = ({item})=>{
        return(
            <View style={{backgroundColor:'#FF2D35', flex:1, alignItems:'flex-end'}}>
                <TouchableOpacity  onPress={()=>{onDelete(item.item.id)}} style={styles.deleteButton}>

                    <Text style={styles.hiddenText}>Delete</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (

        <SwipeListView 
            initialNumToRender={10}
            data={data}
            renderItem={({ item }) => 
            {
                return (listItem({item}))
            }
            }
            renderHiddenItem={(item)=> <RenderHiddenItem item={item}/> }
            rightOpenValue={-75}
            keyExtractor={item => item.id.toString()}
            disableRightSwipe={true}
        />
    );
}

const styles = StyleSheet.create({
    smallGreyText:{
        fontSize: 12,
        color : '#c0c0c0'
    },
    itemPrice:{
        flexDirection:'row',
        justifyContent:'space-between'
    },
    smallText:{
        fontSize : Constant.TERTIARY_FONT_SIZE,
        // paddingTop:2
    },
    itemContainer:{
        paddingHorizontal:16,
        backgroundColor:'white',
        paddingVertical:7,
        borderBottomWidth:1,
        borderBottomColor: "#f0f0f0",
    },
    hiddenText:{
        color:'white'
    },
    deleteButton:{
        backgroundColor:'#FF2D35',
        width:75,
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
});

export default ListProduct;