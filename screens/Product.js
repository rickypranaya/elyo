import React, { useEffect , useRef, useState} from 'react';
import {Animated, View, Text, useColorScheme, StyleSheet,Platform, Image, Alert,TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, TextInput } from 'react-native';

//components
import Constant from '../components/Constant'
import Header from '../components/Header'
import ListProduct from '../components/ListProduct'
import MainButton from '../components/MainButton'

//import library
import { Icon } from 'react-native-elements';
import Modal from 'react-native-modal';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const Product = props=>{
    // when search is ready
    const [searchReady, setSearchReady] = useState(false)

    //search data
    const [searchList, setSearchList] = useState([])
    const [searchFocus, setSearchFocus] = useState(false)
    const [searchKeyword, setSearchKeyword] = useState('');

    //color scheme
    const colorScheme = useColorScheme();

    // loading state 
    const [ready, setReady] = useState(false);

    //delte modal
    const [deleteModal, setDeleteModal] = useState(false)

    // Animation Variables
    const animate = useRef(new Animated.Value(0)).current;

    //today date
    var today = (require('moment')().format('DD MMM YYYY'))

    //activity indicator
    const [loading, setLoading] = useState(false)

    //on editmode
    const [editMode, setEditMode] = useState(false)

    //datalist
    const [data, setData] = useState([])
    const [totalData, setTotalData] = useState(0)

    //data per item
    const [isModalVisible, setModalVisible]= useState(false)
    const [id, setId] = useState (0)
    // const [modal, setModal] = useState(0)
    // const [modalPreview, setModalPreview] = useState('')
    const [price, setPrice] = useState(0)
    const [pricePreview, setPricePreview] = useState('')
    const [name, setName] = useState('')


    // first retrieve data 
    useEffect(()=>{
        fetchData()
    },[]);

    // update data 
    const [updateData, setUpdateData] = useState(false)
    useEffect(()=>{
        if (updateData){
            fetchData()
            searchData(searchKeyword)
            setUpdateData(false)
        }
    },[updateData]);


    // to fetch expense data
     const fetchData = async ()=>{
        setReady(false)

        Animated.timing(animate, {
            toValue: Constant.DEVICE_WIDTH ,
            duration: 2500,
            useNativeDriver: false
        }).start()

        const URL = Constant.BASE_URL+"/product_get";
        console.log(URL)
        try{
            const response = await fetch(URL, {
                method: "POST",
                body: JSON.stringify({
                    id:1
                   }),
                headers:{
                    'Accept': 'application/json',
                    "Content-Type" : "application/json"
                }
            });

            if(response.status !=200){
                throw new Error("Terjadi Kesalahan, silahkan hubungi Steviani");

            } else {
                const responseData = await response.json();
                if (responseData.status != 200){
                    console.log('no product found')
                    setData([])
                    setTotalData(0)
                    setReady(true)
                    animate.setValue(0)
                } else {
                    console.log('found')
                    var data = responseData.data 
                    setData(data)
                    setTotalData(data.length)
                    setReady(true)
                    animate.setValue(0)
                }
            }
        }catch(error){
            Alert.alert('Tidak ada Koneksi Internet');
            console.log(error)
        }
    }

    //when closing modal
    const closeModal = () =>{
        setModalVisible(false)
        // setModalPreview('')
        setPricePreview('')
        // setModal(0)
        setPrice(0)
        setName('')
        setId(0)
        setEditMode(false) 
    }

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

    // to handle of money input
    const handleMoneyInput = (val, type)=>{
        var amount = val.replace(/[^0-9]/g, '')

            setPricePreview(formatRupiah(amount))
            setPrice(amount ? amount : 0)  
              
    }

    //when user click add
    const handleAdd = ()=>{
        if (name == ""){
            Alert.alert("Masukkan nama produk")
        } else if (price == 0){
            Alert.alert("Masukkan harga produk")
        } else {
            setModalVisible(false)
            setLoading(true)

            var object = {
                id : id,
                name : name,
                price : price
            }

            if (editMode){
                setTimeout(() => {
                    editProduct(object)
                }, 100);
            } else {
                setTimeout(() => {
                    addProduct(object)
                }, 100);
            }
        }   
    }

    // to store product
    const addProduct = async (object) =>{
        const URL = Constant.BASE_URL+"/product_add";

        try{
            const response = await fetch(URL, {
                method: "POST",
                body: JSON.stringify(object),
                headers:{
                    'Accept': 'application/json',
                    "Content-Type" : "application/json"
                }
            });

            if(response.status !=200){
                setLoading(false)
                throw new Error("Terjadi kesalahan! silahkan hubungi Steviani");

            } else {
                const responseData = await response.json();
                if (responseData.status != 200){
                    setLoading(false)
                    Alert.alert('terjadi kesalahan! silahkan hubungi Steviani')
                } else {

                    console.log('add product success')

                    setLoading(false)
                    setData([...data])
                    closeModal()
                    setUpdateData(true)
                }
            }
        }catch(error){
            setLoading(false)
            console.log(error)
            Alert.alert('Tidak ada Koneksi Internet');
        }
    }

    // to edit product
    const editProduct = async (object) => {
        const URL = Constant.BASE_URL+"/product_edit";

        try{
            const response = await fetch(URL, {
                method: "POST",
                body: JSON.stringify(object),
                headers:{
                    'Accept': 'application/json',
                    "Content-Type" : "application/json"
                }
            });

            if(response.status !=200){
                setLoading(false)
                throw new Error("Terjadi kesalahan! silahkan hubungi Steviani");

            } else {
                const responseData = await response.json();
                if (responseData.status != 200){
                    setLoading(false)
                    Alert.alert('terjadi kesalahan! silahkan hubungi Steviani')
                } else {

                    console.log('edit product success')

                    setLoading(false)
                    setData([...data])
                    closeModal()
                    setUpdateData(true)
                }
            }
        }catch(error){
            setLoading(false)
            console.log(error)
            Alert.alert('Tidak ada Koneksi Internet');
        }
    }

    //when user press on item
    const onPressItem = (item)=>{
        // setModalPreview(formatRupiah(item.modal))
        setPricePreview(formatRupiah(item.price))
        setId(item.id)
        // setModal(item.modal)
        setPrice(item.price)
        setName(item.name)
        setEditMode(true)
        setModalVisible(true)
    }   

    //when user remove item
    const handleRemoveItem = async () =>{
        setDeleteModal(false)
        setLoading(true)
        const URL = Constant.BASE_URL+"/product_remove";

        try{
            const response = await fetch(URL, {
                method: "POST",
                body: JSON.stringify({
                    id : id
                }),
                headers:{
                    'Accept': 'application/json',
                    "Content-Type" : "application/json"
                }
            });

            if(response.status !=200){
                setLoading(false)
                throw new Error("Terjadi kesalahan! silahkan hubungi Steviani");

            } else {
                const responseData = await response.json();
                if (responseData.status != 200){
                    setLoading(false)
                    Alert.alert('terjadi kesalahan! silahkan hubungi Steviani')
                } else {

                    console.log('remove product success')

                    setLoading(false)
                    setData([...data])
                    closeModal()
                    setUpdateData(true)
                }
            }
        }catch(error){
            setLoading(false)
            console.log(error)
            Alert.alert('Tidak ada Koneksi Internet');
        }
    }

    const SplashScreen = () =>{
        return (
            <View style={styles.splash}>
                <View style={styles.splashBar}/>
                <View style={styles.splashBar}/>
                <View style={styles.splashBar}/>
                <View style={styles.splashBar}/>

                <Animated.View style={{height:'100%', width: animate, backgroundColor:'white', position:'absolute',opacity:0.4}}/>
            </View>
        )
    }


    //handle search
    const onFocus = ()=>{
        setSearchFocus(true)
    }

    const onBlur = ()=>{
        setSearchFocus(false)
    }

    const onSearch = (val)=>{
        if(val != ''){
            searchData(val)
        }
        setSearchKeyword(val)
    }

    // to search data
     const searchData = async (val)=>{

        setSearchReady(false)

        const URL = Constant.BASE_URL+"/product_search";

        try{
            const response = await fetch(URL, {
                method: "POST",
                body: JSON.stringify({
                    keyword: val
                   }),
                headers:{
                    'Accept': 'application/json',
                    "Content-Type" : "application/json"
                }
            });

            if(response.status !=200){
                throw new Error("Terjadi Kesalahan, silahkan hubungi Steviani");

            } else {
                const responseData = await response.json();
                if (responseData.status != 200){
                    console.log('no product found')
                    setSearchList([])
                    setSearchReady(true)
                } else {
                    console.log('product found')
                    var data = responseData.data 
                    setSearchList(data)
                    setSearchReady(true)
                }
            }
        }catch(error){
            Alert.alert('Tidak ada Koneksi Internet');
        }
    }

    const onDelete = (item_id)=>{
        setId(item_id)
        setDeleteModal(true)
    }

    return(
        <View style={styles.screen}>
            <View style={styles.mainArea}>
                <Header onAdd={()=>setModalVisible(true)} disabled={searchFocus} onFocus={onFocus} onBlur={onBlur} onSearch={onSearch}/>

                {!searchFocus?
                    <View style={{flex:1}}>
                        {ready ?
                        <View style={styles.contentArea}>
                            <Text style={{color:'orange', paddingVertical:5, paddingHorizontal:16}}>Jumlah produk : {totalData}</Text>
                            <ListProduct data ={data} onPressItem={onPressItem} onDelete={onDelete}/>
                        </View>
                        :
                        <SplashScreen/>
                        }
                    </View>
                :
                    <View style={{flex:1}}>
                        {searchReady ?
                        <View style={styles.contentArea}>
                            <ListProduct data ={searchList} onPressItem={onPressItem} onDelete={onDelete}/>
                        </View>
                        :
                        <SplashScreen/>
                        }
                    </View>
                }
            </View>
            
            {/* ===== Modal ===== */}
            <Modal
            style={styles.modal}
            isVisible={isModalVisible}
            onBackdropPress={closeModal}
            onBackButtonPress={closeModal}
            >   
            <KeyboardAvoidingView behavior= {Platform.OS === 'ios'? 'position': null}>
                <View style={styles.bottomModal}>
                    {/* header */}
                    <View style={styles.header}>
                        <Text style={styles.headerText}>{editMode?"Edit Produk" : "Tambah Produk"}</Text>

                        {/* close modal icon */}
                        <TouchableOpacity style={styles.backButton} onPress={closeModal}>
                            <Icon
                                name='x'
                                type='feather'
                                color="black"
                                size={30}
                            />
                        </TouchableOpacity>

                        {/* remove item icon */}
                        {editMode&&
                        <TouchableOpacity style={styles.removeButton} onPress={()=>{setModalVisible(false); setDeleteModal(true)}}>
                            <Icon
                                name='trash'
                                type='ionicon'
                                color="#FF8383"
                                size={25}
                            />
                        </TouchableOpacity>
                        }
                    </View>

                    

                    {/* name */}
                    <View style={styles.section}>
                        <Text>Nama Produk</Text>
                
                        <TextInput
                            multiline
                            value ={name}
                            clearButtonMode='while-editing'
                            placeholder= 'Paket ...'
                            placeholderTextColor={Constant.GREY_PLACEHOLDER}
                            returnKeyType="done"
                            autoCapitalize="words"
                            style={[styles.textInput, {paddingTop:Platform.OS === 'ios'? 12 : 7,maxHeight:120}]}
                            onChangeText={setName}
                        />
                    </View>

                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>

                        {/* jual */}
                        <View style={[styles.section, {width:'47%'}]}>
                            <Text>Harga Produk</Text>
                    
                            <TextInput
                                value = {pricePreview}
                                clearButtonMode='while-editing'
                                keyboardType="number-pad"
                                placeholder= 'Rp 0'
                                placeholderTextColor={Constant.GREY_PLACEHOLDER}
                                returnKeyType="done"
                                autoCapitalize="words"
                                style={styles.textInput}
                                onChangeText={(val)=>handleMoneyInput(val, 'price')}
                                onBlur={()=>{if(price == 0) setPricePreview(formatRupiah(0))}}
                            />
                        </View>
                    </View>

                    {/* "Tambah" Button */}
                    <View style={{alignItems:'center', paddingTop: 20}}>
                        <MainButton title={editMode?'Simpan':'Tambah'}  onPress={handleAdd}/>
                    </View>

                </View>
            </KeyboardAvoidingView>
            </Modal>

            {/* loading indicator */}
            { loading &&
            <View style={styles.loading}>
                <View style={{backgroundColor:'white', borderRadius:10, padding:20}}>
                    <ActivityIndicator size="small" color={Constant.PRIMARY_COLOR}/>
                </View>
            </View>
            }

            {/* delete modal */}
            {deleteModal &&
            <View style={{position:'absolute',elevation:2, backgroundColor:'rgba(52, 52, 52, 0.8)', height:'100%', width:'100%',justifyContent:'center', alignItems:'center'}}>
                <View style={{backgroundColor:'white',  paddingVertical:10, borderRadius:15}}>
                    <Text style={{paddingTop:20, paddingBottom:10, paddingHorizontal:16,fontWeight:'bold', fontSize:16}}>Yakin ingin delete produk ini?</Text>
                    
                    <TouchableOpacity onPress={handleRemoveItem} style={{ justifyContent:'center', paddingVertical:12, marginTop:20, borderTopColor:'#f0f0f0', borderTopWidth:1}}>
                        <Text style={{textAlign:'center', color: '#FF8383'}}>Delete</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>{setDeleteModal(false)}} style={{ justifyContent:'center', paddingVertical:12, borderTopColor:'#f0f0f0', borderTopWidth:1}}>
                        <Text style={{textAlign:'center'}}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    screen :{
        flex:1,
        backgroundColor:'white'
    },
    mainArea:{
        flex:1, 
        paddingTop: Constant.STATUSBAR
    },
    contentArea:{
        borderTopWidth:1,
        borderTopColor: '#f0f0f0',
        flex:1,
        // paddingHorizontal:16
    },
    header:{
        flexDirection:'row',
        alignItems:'center',
        height: 44,
        justifyContent:"space-between"
    },
    headerText: {
        position: 'absolute', 
        textAlign:'center', 
        width:'100%'
    },
    backButton:{
        height:'100%', 
        justifyContent:'center', 
        paddingRight: 16
    },
    removeButton:{
        height:'100%', 
        justifyContent:'center', 
        paddingLeft: 16
    },
    section:{
        paddingVertical: 8,
    },
    modal:{
        margin:0, 
        flex:1, 
        justifyContent:'flex-end'
    },
    bottomModal:{
        
        backgroundColor:'white',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingTop:10,
        paddingHorizontal:16,
        paddingBottom: Platform.OS === 'ios' ? 34 : 0
    },
    textInput:{
        backgroundColor: Constant.GREY_BACKGROUND,
        borderRadius: 10,
        paddingVertical: Platform.OS === 'ios'? 12 : 7,
        borderRadius: 10,
        paddingHorizontal: 16,
        marginTop:5,
    },
    loading: {
        backgroundColor:'rgba(52, 52, 52, 0.8)', 
        position: 'absolute', 
        width:'100%', 
        height:'100%', 
        justifyContent:'center', 
        alignItems:'center'
    },
    splash:{
        paddingHorizontal:16,
        flex:1
    },
    splashBar:{
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        marginTop:10,
        height: 60
    }
});

export default Product;