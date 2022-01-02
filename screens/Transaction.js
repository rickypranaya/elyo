import React, { useEffect , useRef, useState} from 'react';
import {Animated, View, Text, useColorScheme, StyleSheet,Platform, Image, Alert,TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, TextInput } from 'react-native';

//components
import Constant from '../components/Constant'
import Search from '../components/Search';
import Header from '../components/Header';
import ListTransaction from '../components/ListTransaction';


//import library
import { Icon } from 'react-native-elements';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Modal from 'react-native-modal';
import { ScrollView } from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';

const Transaction = props=>{
    const [nama, setNama] = useState("")
    const [noTelepon, setNoTelepon] = useState("")
    const [email, setEmail] = useState("")
    const [kota, setKota] = useState("")

    const [desa, setDesa] = useState("")

    const [postcode, setPostcode] = useState("")

    const [alamat, setAlamat] = useState("")

    const [openPembayaran, setOpenPembayaran] = useState(false);
    const [valuePembayaran, setValuePembayaran] = useState('');
    const [itemsPembayaran, setItemsPembayaran] = useState([
      {label: 'COD', value: 'cod'},
      {label: 'Transfer', value: 'transfer'},
    ]);

    //product list
    const [item, setItem] = useState([])

    //total penjualan
    const [totalPenjualan, setTotalPenjualan] = useState(0)

    //ongkir
    const [ongkir, setOngkir] = useState(0)
    const [ongkirP, setOngkirP] = useState('')

    //subsidi
    const [subsidi, setSubsidi] = useState(0)
    const [subsidiP, setSubsidiP] = useState('')

    //color scheme
    const colorScheme = useColorScheme();

    // when search is ready
    const [searchReady, setSearchReady] = useState(false)

    //search data
    const [searchList, setSearchList] = useState([])
    const [searchFocus, setSearchFocus] = useState(false)
    const [searchKeyword, setSearchKeyword] = useState('');

     // loading state 
     const [ready, setready] = useState(false);

     //delte modal
     const [deleteModal, setDeleteModal] = useState(false)

     const [isModalVisible, setModalVisible]= useState(false)

 
     // Animation Variables
     const animate = useRef(new Animated.Value(0)).current;
 
     //handle date
    var today = (require('moment')().format('DD MMMM YYYY'))
    const [date, setDate] = useState(new Date())
    const [dateString, setDateString] = useState(today)

     //date picker
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false)

    //on date confirm
    const handleConfirm = (date) => {
        var dateStr = (require('moment')(date).format('DD MMMM YYYY'))
        setDatePickerVisibility(false)
        setDate(date)
        setDateString(dateStr)
    };
 
     //activity indicator
     const [loading, setLoading] = useState(false)

     //datalist
    const [data, setData] = useState([])

     //update data on inserted transaksi
     useEffect(() => {
        if (props.route.params?.date){
            setDate(props.route.params.date)
            var dateStr = (require('moment')(props.route.params.date).format('DD MMMM YYYY'))
            setDateString(dateStr)
            fetchData()
        }
    }, [props.route.params?.date]);


    // update data 
    useEffect(()=>{
        fetchData()
    },[date]);

    // to fetch transaction data
    const fetchData = async ()=>{
        setready(false)

        Animated.timing(animate, {
            toValue: Constant.DEVICE_WIDTH ,
            duration: 2000,
            useNativeDriver: false
        }).start()

        var created_at = require('moment')(date).format('YYYY-MM-DD')
        const URL = Constant.BASE_URL+"/transaction_get";

        try{
            const response = await fetch(URL, {
                method: "POST",
                body: JSON.stringify({
                    created_at : created_at
                   }),
                headers:{
                    'Accept': 'application/json',
                    "Content-Type" : "application/json"
                }
            });

            if(response.status !=200){
                throw new Error("Terjadi Kesalahan, silahkan hubungi Steviani");

            } else {
                console.log('supppp')
                const responseData = await response.json();
                if (responseData.status != 200){
                    console.log('no data')
                    setData([])
                    setready(true)
                    animate.setValue(0)
                } else {
                    var data = responseData.data
                    var firstItem
                    var listItem =[]
                    data.map((item)=>{
                        var firstItem = JSON.parse(item.item)[0]
                        console.log(item)
                        var date = new Date(item.created_at)
                        var dateStr = require('moment')(date).format('DD/MM/YY')

                        var object = {
                            id: item.id,
                            no: item.no,
                            nama : item.nama,
                            name : firstItem.name,
                            quantity : firstItem.quantity,
                            total : item.total,
                            created_at : dateStr
                        }
                        listItem = [...listItem, object]
                    })
                    setData(listItem)
                    setready(true)
                    animate.setValue(0)
                }
            }
        }catch(error){
            Alert.alert('Tidak ada Koneksi Internet');
        }
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

        const URL = Constant.BASE_URL+"/search_get";

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
                console.log('hey')
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
                    var firstItem
                    var listItem =[]
                    data.map((item)=>{
                        var firstItem = JSON.parse(item.item)[0]
                        var date = new Date(item.created_at)
                        var dateStr = require('moment')(date).format('DD/MM/YY')
    
                        var object = {
                            id: item.id,
                            no: item.no,
                            nama : item.nama,
                            name : firstItem.name,
                            quantity : firstItem.quantity,
                            total : item.total,
                            created_at : dateStr
                        }
                        listItem = [...listItem, object]
                    })

                    setSearchList(listItem)
                    setSearchReady(true)
                }
            }
        }catch(error){
            Alert.alert('Tidak ada Koneksi Internet');
        }
    }

    //when user press transaction item
    const onPressItem = (item) =>{
        setModalVisible(true)
        console.log(item)
    }

    //empty state
    const EmptyState = ()=>{
        return (
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Image
                    style={{width: '70%', height:'30%'}} 
                    source={require("../assets/empty.png")}
                    resizeMode='contain'
                />
                <Text style={{fontWeight:'bold', marginVertical:10}}>Tidak Ada Transaksi</Text>
            </View>
        )
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

    //when closing modal
    const closeModal = () =>{
        setModalVisible(false)
        // setModalPreview('')
        // setPricePreview('')
        // // setModal(0)
        // setPrice(0)
        // setName('')
        // setId(0)
        // setEditMode(false) 
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

    return(
        <View style={styles.screen}>
            <View style={styles.mainArea}>
                <Header onAdd={()=>{}} disabled={true} onFocus={onFocus} onBlur={onBlur} onSearch={onSearch}/>
                
                <View style={styles.section}>
                    {/* collapse button */}
                    {!searchFocus?
                <View style={styles.section}>
                    {/* collapse button */}
                    <TouchableOpacity style={styles.collapse} onPress={()=>{setDatePickerVisibility(true)}}>
                        <Text>{dateString}</Text>
                        <Icon
                            name='calendar'
                            type='feather'
                            color= {Constant.PRIMARY_COLOR}
                            size={22}
                        />
                    </TouchableOpacity>

                    {/* the content of it */}
                    
                    {ready ?
                        <View style={{flex:1}}>
                            {data.length != 0 ?
                                <ListTransaction data={data} onPressItem = {onPressItem}/>
                            : 
                                <EmptyState/>
                            }
                        </View> 
                    :
                        <SplashScreen/>
                    }
                        
                </View>
                :
                    <View style={styles.section}>

                    {/* the content of it */}         
                    {searchReady ?
                        <View style={{flex:1}}>
                            {searchList.length != 0 ?
                                <ListTransaction data={searchList} onPressItem = {onPressItem}/>
                            : 
                                <EmptyState/>
                            }
                        </View> 
                    :
                        <SplashScreen/>
                    }
                        
                </View>
                }
                </View>
            </View>

            {/* ======= Date Picker ======== */}
            <DateTimePickerModal
                    isDarkModeEnabled = {colorScheme == "dark" ? true : false}
                    date = {date}
                    display={Platform.OS === 'ios' ? "inline" : "calendar"}
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={()=>{setDatePickerVisibility(false)}}
                /> 

                {/* ===== Modal ===== */}
            <Modal
            style={styles.modal}
            isVisible={isModalVisible}
            onBackdropPress={closeModal}
            onBackButtonPress={closeModal}
            >   
                <ScrollView  style={styles.scroll}>
                     {/* ===== DATA PELANGGAN ===== */}
        <View style={{width:'100%', flexDirection:'column', justifyContent:'flex-start'}}>
            <Text style={styles.labelText}>Data Pelanggan</Text>
            <View style={styles.customerField}>
                <Text style={{marginRight:10, fontSize:13, fontWeight:'bold'}}>Nama</Text>
                <TextInput
                    value = {nama}
                    // keyboardType="number-pad"
                    placeholder= 'Nama lengkap'
                    placeholderTextColor={Constant.GREY_PLACEHOLDER}
                    returnKeyType="done"
                    // autoCapitalize="words"
                    style={{flex:1,textAlign:'right', paddingVertical: 5}}
                    // onChangeText={setNama}
                    // onFocus={()=>{setQuantity('')}}
                    // onBlur={()=>{ if (quantity == '') {setQuantity('1')}}}
                />
            </View>

            <View style={styles.customerField}>
                <Text style={{marginRight:10, fontSize:13, fontWeight:'bold'}}>No Telepon</Text>
                <TextInput
                    value = {noTelepon}
                    keyboardType="number-pad"
                    placeholder= 'Nomor Telepon'
                    placeholderTextColor={Constant.GREY_PLACEHOLDER}
                    returnKeyType="done"
                    // autoCapitalize="words"
                    style={{flex:1,textAlign:'right', paddingVertical: 5}}
                    // onChangeText={setNoTelepon}
                    // onFocus={()=>{setQuantity('')}}
                    // onBlur={()=>{ if (quantity == '') {setQuantity('1')}}}
                />
            </View>

            {/* <View style={styles.customerField}>
                <Text style={{marginRight:10, fontSize:13, fontWeight:'bold'}}>No WA</Text>
                <TextInput
                    value = {noWA}
                    keyboardType="number-pad"
                    placeholder= 'Nomor Whatsapp'
                    placeholderTextColor={Constant.GREY_PLACEHOLDER}
                    returnKeyType="done"
                    // autoCapitalize="words"
                    style={{flex:1,textAlign:'right', paddingVertical: 5}}
                    onChangeText={setNoWa}
                    // onFocus={()=>{setQuantity('')}}
                    // onBlur={()=>{ if (quantity == '') {setQuantity('1')}}}
                />
            </View> */}

            <View style={styles.customerField}>
                <Text style={{marginRight:10, fontSize:13, fontWeight:'bold'}}>Email</Text>
                <TextInput
                    value = {email}
                    keyboardType="email-address"
                    placeholder= 'Alamat Email'
                    placeholderTextColor={Constant.GREY_PLACEHOLDER}
                    returnKeyType="done"
                    // autoCapitalize="words"
                    style={{flex:1,textAlign:'right', paddingVertical: 5}}
                    // onChangeText={setEmail}
                    // onFocus={()=>{setQuantity('')}}
                    // onBlur={()=>{ if (quantity == '') {setQuantity('1')}}}
                />
            </View>
            
        </View>
        
        {/* ===== KECAMATAN / KOTA ===== */}
        <View style={{width:'100%', flexDirection:'column', justifyContent:'flex-start'}}>
            <Text style={styles.labelText}>Kecamatan / Kota</Text>
            <TextInput
                value = {kota}
                // keyboardType="number-pad"
                placeholder= 'Nama kota'
                placeholderTextColor={Constant.GREY_PLACEHOLDER}
                returnKeyType="done"
                // autoCapitalize="words"
                style={styles.textField}
                // onChangeText={setKota}
                // onFocus={()=>{setQuantity('')}}
                // onBlur={()=>{ if (quantity == '') {setQuantity('1')}}}
            />
        </View>
        
        {/* ===== KELURAHAN / DESA ===== */}
        <View style={{width:'100%', flexDirection:'column', justifyContent:'flex-start'}}>
            <Text style={styles.labelText}>Kelurahan / Desa</Text>
            <TextInput
                value = {desa}
                // keyboardType="number-pad"
                placeholder= 'Nama Kelurahan'
                placeholderTextColor={Constant.GREY_PLACEHOLDER}
                returnKeyType="done"
                // autoCapitalize="words"
                style={styles.textField}
                // onChangeText={setDesa}
                // onFocus={()=>{setQuantity('')}}
                // onBlur={()=>{ if (quantity == '') {setQuantity('1')}}}
            />
        </View>

        {/* ===== KODE POS ===== */}
        <View style={{width:'100%', flexDirection:'column', justifyContent:'flex-start'}}>
            <Text style={styles.labelText}>Kode Pos</Text>
            <TextInput
                value = {postcode}
                keyboardType="number-pad"
                placeholder= 'Kode pos'
                placeholderTextColor={Constant.GREY_PLACEHOLDER}
                returnKeyType="done"
                // autoCapitalize="words"
                style={styles.textField}
                // onChangeText={setPostcode}
                // onFocus={()=>{setQuantity('')}}
                // onBlur={()=>{ if (quantity == '') {setQuantity('1')}}}
            />
        </View>

        {/* ===== ALAMAT LENGKAP ===== */}
        <View style={{width:'100%', flexDirection:'column', justifyContent:'flex-start'}}>
            <Text style={styles.labelText}>Alamat lengkap</Text>
            <TextInput
            multiline
                value = {alamat}
                // keyboardType="number-pad"
                placeholder= 'Jalan/RT/RW/No.Rumah'
                placeholderTextColor={Constant.GREY_PLACEHOLDER}
                returnKeyType="done"
                autoCapitalize="words"
                
                style={[styles.textField,{paddingVertical:10, minHeight:70, textAlignVertical:'top'}]}
                // onChangeText={setAlamat}
                // onFocus={()=>{setQuantity('')}}
                // onBlur={()=>{ if (quantity == '') {setQuantity('1')}}}
            />
        </View>

        
        {/* ===== Metode Pembayaran ===== */}
        <View style={{width:'100%', flexDirection:'column', justifyContent:'flex-start'}}>
            <Text style={styles.labelText}>Pembayaran</Text>
            <View style={{paddingVertical:5, height: openPembayaran ? 140 :null}}>
                <DropDownPicker
                    dropDownDirection="BOTTOM"
                    ArrowUpIconComponent={() => <Icon name='arrow-drop-up' type='material' color="black" size={30}/>}
                    ArrowDownIconComponent={() => <Icon name='arrow-drop-down' type='material' color="black" size={30}/>}
                    placeholder="Bayar Melalui"
                    placeholderStyle={{color: Constant.GREY_PLACEHOLDER}}
                    style={[styles.dropdownStyle, {marginTop:0}]}
                    dropDownContainerStyle={[styles.dropDownContainerStyle,{marginTop:0}]}
                    maxHeight={300}
                    open={openPembayaran}
                    value={valuePembayaran}
                    items={itemsPembayaran}
                    setOpen={setOpenPembayaran}
                    setValue={setValuePembayaran}
                    setItems={setItemsPembayaran}
                    onChangeValue={(val)=>{}}
                />
            </View>
        </View>



        {/* ===== ITEM ====== */}
        <View style={{width:'100%', flexDirection:'column', justifyContent:'flex-start'}}>
            <Text style={styles.labelText}>Item</Text>
            
            <View style={{ paddingVertical:5, borderBottomColor:'#f0f0f0', borderBottomWidth:1}}>
                
                {/* render item list */}
                {item.map((item, index)=> <ItemList key={index} item={item}/>)}

            </View>

            <View style={{flexDirection:'row', paddingVertical:10}}>
                <Text style={{flex:1, fontWeight:'bold'}}>Total Penjualan</Text>
                <Text style={{fontWeight:'bold'}}>{formatRupiah(totalPenjualan)}</Text>
            </View>

        </View>

        {/* ===== Harga Ongkir ===== */}
        <View style={{width:'100%', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
            <Text >Ongkos Kirim</Text>
            <TextInput
                value = {ongkirP}
                keyboardType="number-pad"
                placeholder= 'Rp 0'
                placeholderTextColor={Constant.GREY_PLACEHOLDER}
                returnKeyType="done"
                // autoCapitalize="words"
                style={[styles.textField,{ width:'40%', textAlign:'right'}]}
                // onChangeText={(val)=>{handleMoneyInput(val, 'ongkir')}}
                // onBlur={()=>{if(ongkir == 0) setOngkirP(formatRupiah(0))}}

                // onFocus={()=>{setQuantity('')}}
                // onBlur={()=>{ if (quantity == '') {setQuantity('1')}}}
            />
        </View>

        {/* ===== Subsidi ===== */}
        <View style={{width:'100%', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
            <Text >Subsidi</Text>
            <TextInput
                value = {subsidiP}
                keyboardType="number-pad"
                placeholder= 'Rp 0'
                placeholderTextColor={Constant.GREY_PLACEHOLDER}
                returnKeyType="done"
                // autoCapitalize="words"
                style={[styles.textField,{ width:'40%', textAlign:'right'}]}
                // onChangeText={(val)=>{handleMoneyInput(val, 'subsidi')}}
                // onBlur={()=>{if(subsidi == 0) setSubsidiP(formatRupiah(0))}}
                // // onFocus={()=>{setQuantity('')}}
                // onBlur={()=>{ if (quantity == '') {setQuantity('1')}}}
            />
        </View>

        <View style={{flexDirection:'row', paddingVertical:10, borderTopColor:'#f0f0f0', borderTopWidth:1}}>
            <Text style={{flex:1, fontWeight:'bold', fontSize:16}}>Total</Text>
            <Text style={{fontWeight:'bold', fontSize:16, color:Constant.PRIMARY_COLOR}}>{formatRupiah(Number(totalPenjualan) + Number(ongkir) - Number(subsidi))}</Text>
        </View>

       

        </ScrollView>
            </Modal>

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
    section : {
        flex:1,
    },
    collapse:{
        backgroundColor: Constant.GREY_BACKGROUND,
        flexDirection : 'row',
        paddingHorizontal: 16,
        borderRadius: 10,
        justifyContent:'space-between',
        alignItems:'center',
        marginTop:12,
        marginHorizontal:16,
        paddingVertical: Platform.OS === 'ios'? 10 : 10,
    },
    splash:{
        flex:1
    },
    splashBar:{
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        marginTop:10,
        height: 60
    },
    modal:{
        margin:0, 
        flex:1, 
        justifyContent:'flex-end'
    },
    scroll:{
        paddingHorizontal:20,
        flex:1, 
        width:'100%'
    },
});

export default Transaction;