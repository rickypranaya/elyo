import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, SafeAreaView, KeyboardAvoidingView, TextInput, ScrollView , Alert, TouchableOpacity, ActivityIndicator} from 'react-native';
import Constant from '../components/Constant';
import { Icon } from 'react-native-elements';
import * as Location from 'expo-location';
import DropDownPicker from 'react-native-dropdown-picker';
import Modal from 'react-native-modal';
import MainButton from '../components/MainButton';

export default function Generate(props) {

    //activity indicator
    const [loading, setLoading] = useState(false)

    // const text = "28 Mohon diisi selengkap-lengkapnya ya kak Nama : yanti No telepon : 0818-0408-8452 NO WA : 0818-0408-8452 Kecamatan/Kota : pacitan Kelurahan/Desa : arjowinagun Kode pos :  Email (Jika ada) :  Alamat Lengkap (Jalan/RT/RW/No. Rumah): jln. Jendral Sudirman, rt.3 ,rw. 3, bakso rudal pak min samping indomaret Jumlah Order: paket super ampuh Pembayaran COD/TF: cod ongkir 43rb pot 30rb total cod 299+13=312.000"
    const [text, setText] = useState("")
    // const [no, setNo] = useState("")
    const [nama, setNama] = useState("")
    const [noTelepon, setNoTelepon] = useState("")
    // const [noWA, setNoWa] = useState("")
    const [email, setEmail] = useState("")
    const [kota, setKota] = useState("")
    const kotaRef = useRef("")

    const [desa, setDesa] = useState("")
    const desaRef = useRef("")

    const [postcode, setPostcode] = useState("")
    const postcodeRef = useRef("")

    const [alamat, setAlamat] = useState("")
    const alamatRef = useRef("")

    const [openPembayaran, setOpenPembayaran] = useState(false);
    const [valuePembayaran, setValuePembayaran] = useState('');
    const [itemsPembayaran, setItemsPembayaran] = useState([
      {label: 'COD', value: 'cod'},
      {label: 'Transfer', value: 'transfer'},
    ]);

    //product list
    const [product, setProduct] = useState([])
    const [item, setItem] = useState([])
    const itemRef = useRef([])

    //total penjualan
    const [totalPenjualan, setTotalPenjualan] = useState(0)

    //ongkir
    const [ongkir, setOngkir] = useState(0)
    const [ongkirP, setOngkirP] = useState('')

    //subsidi
    const [subsidi, setSubsidi] = useState(0)
    const [subsidiP, setSubsidiP] = useState('')

    //  modal add item
    const [itemKey, setItemKey] = useState('')
    const [onItemClicked, setOnItemClicked] = useState(false)
    const [itemName, setItemName] = useState('')
    const [jual, setJual]= useState(0)
    const [itemId, setItemId]= useState(0)
    const [quantity, setQuantity] = useState('1')
    const [isModalVisible, setModalVisible]= useState(false)
    const [jualPreview, setJualPreview]= useState('')

    // item dropdown //
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([]);

    //when item is clicked
    const itemClicked = (item) =>{
        setOnItemClicked(true)
        setValue(item.item_value)
        setJualPreview(formatRupiah(item.jual))
        setJual(item.jual)
        setQuantity((item.quantity).toString())
        setItemId(item.item_id)
        setItemKey(item.item_key)
        setItemName(item.name)
        setModalVisible(true)
    }

    //when user remove item
    const handleRemoveItem = () =>{
        const itemIndex = item.findIndex((item) => item.item_key === itemKey)
        item.splice(itemIndex, 1)
        setItem([...item])
        closeModal()
    }

    //when user edit item
    const handleEditItem = () =>{
        if (itemId == 0 && itemName ==""){
            Alert.alert("Silahkan pilih produk")
        } else if (Number(quantity) == 0){
            Alert.alert("Masukan jumlah item")
        } else {
            const itemIndex = item.findIndex((item) => item.item_key === itemKey)
            item[itemIndex].item_id = itemId
            item[itemIndex].item_value = value
            item[itemIndex].name = itemName
            item[itemIndex].jual = jual
            item[itemIndex].quantity = Number(quantity)

            setItem([...item])
            closeModal()
        }   
        
    }

    //when closing modal
    const closeModal = () =>{
        setModalVisible(false)
        setOpen(false)
        setValue(null)
        setJualPreview('')
        setJual(0)
        setQuantity('1')
        setItemId(0)
        setItemName('')
        setOnItemClicked(false)
        setItemKey('')
    }


    useEffect(()=>{
        // const pattern = /nama/i
        // console.log("----------" +text.match(pattern))
        // console.log("nama: "+ nama)
        // console.log("noTelepon: "+ noTelepon)
        // console.log("noWA: "+ noWA)
        // console.log("email: "+ email)
        // console.log("kota: "+ kota)
        // console.log("desa: "+ desa)
        // console.log("postcode: "+ postcode)
        // console.log("alamat: "+ alamat)
        var totj = 0
        item.map((item)=>{
            totj += item.jual * item.quantity
        })

        setTotalPenjualan(totj)
        
    },[item])

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

    useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission to access location was denied');
            return;
          }

        })();
        getProduct();
   
    }, []);

    const searchLoc = async (search)=>{
        let geocodeAsync = await Location.geocodeAsync(search);
        //console.log(geocodeAsync)
        if (geocodeAsync.length != 0){
          let location = {
            latitude: geocodeAsync[0].latitude,
            longitude : geocodeAsync[0].longitude
          }
  
           getLocData(location);
        //   locationLists(location);
        } 
      }

      //when user choose item
    const handlePickItem = (val) =>{
        if (val ){
        var arr = val.split('/*/')
        var item_id = Number(arr[0])
        var jual = Number(arr[1])
        var name = arr[2]
        
        setJualPreview(formatRupiah(jual))
        setItemId(item_id)
        setJual(jual)
        setItemName(name)
        }
    }

    const getLocData = async (location)=>{
        let reverseGeocodeAsync = await Location.reverseGeocodeAsync(location)
        console.log(reverseGeocodeAsync[0])
        if (kotaRef.current == ""){
            setKota(reverseGeocodeAsync[0].city)
        }
        if (desaRef.current == ""){
            setDesa(reverseGeocodeAsync[0].subregion)
        }

        if (postcodeRef.current == "" && kotaRef.current == ""){
            setPostcode(reverseGeocodeAsync[0].postalCode)
        }

        if (alamatRef.current == ""){
            setAlamat(reverseGeocodeAsync[0].street+" "+reverseGeocodeAsync[0].district+", "+reverseGeocodeAsync[0].city+", "+reverseGeocodeAsync[0].subregion+", "+reverseGeocodeAsync[0].postalCode)
        }
    }


    const addPasted = async ()=>{
        console.log(text)
        
        setNama("")
        setNoTelepon("")
        // setNoWa("")
        setKota("")
        setDesa("")
        setPostcode("")
        setEmail("")
        setAlamat("")

        setOngkirP("")
        setOngkir(0)
        setSubsidi(0)
        setSubsidiP("")

        setItem([])
        setValuePembayaran('')
        itemRef.current = []

        kotaRef.current = ""
        desaRef.current = ""
        postcodeRef.current = ""
        alamatRef.current = ""
        
        var arr = text.split('\n').filter(n => n)
        arr.forEach((x, i) => {
            if (x.match(/nama/i)){
                if(x.match(/:/)){
                    setNama(x.split(":")[1].trim())
                }else {
                    setNama(x.split(";")[1].trim())
                }
                

            } else if (x.match(/telepon/i) || x.match(/hp/i) || x.match(/08/i) || x.match(/\+62/i)){
                if(x.match(/:/)){
                    setNoTelepon(x.split(":")[1].trim())
                }else if(x.match(/;/)){
                    setNoTelepon(x.split(";")[1].trim())
                } else {
                    setNoTelepon(x.trim())
                }
               

            }  else if (x.match(/cod\/tf/i) || x.match(/cod\/transfer/i) ||x.match(/pembayaran/i) ){
                if(x.match(/:/)){
                    var tmp = x.split(":")[1].trim()
                    if (tmp.match(/cod/i)) {
                        setValuePembayaran('cod')
                    } else {
                        setValuePembayaran('transfer')
                    }
                }else if(x.match(/;/)){
                    var tmp = x.split(";")[1].trim()
                    if (tmp.match(/cod/i)) {
                        setValuePembayaran('cod')
                    } else {
                        setValuePembayaran('transfer')
                    }
                } 

            } else if ((x.match(/kota/i) || x.match(/kecamatan/i)) && x.length <40){
                if(x.match(/:/)){
                    setKota(x.split(":")[1].trim())
                    kotaRef.current = x.split(":")[1].trim()
                }else if(x.match(/;/)){
                    setKota(x.split(";")[1].trim())
                    kotaRef.current = x.split(";")[1].trim()
                }

            } else if ((x.match(/desa/i) || x.match(/kelurahan/i)) && x.length <40){
                if(x.match(/:/)){
                    setDesa(x.split(":")[1].trim())
                    desaRef.current = x.split(":")[1].trim()
                }else if(x.match(/;/)){
                    setDesa(x.split(";")[1].trim())
                    desaRef.current = x.split(";")[1].trim()
                }

            } else if (x.match(/pos/i)){
                if(x.match(/:/)){
                    setPostcode(x.split(":")[1].trim())
                    postcodeRef.current = x.split(":")[1].trim()
                }else if(x.match(/;/)){
                    setPostcode(x.split(";")[1].trim())
                    postcodeRef.current = x.split(";")[1].trim()

                }

            } else if (x.match(/ongkir/i)){
                if(x.match(/:/)){
                    setOngkir(parseInt((x.split(":")[1].trim()).replace('.','')))
                    setOngkirP(formatRupiah(parseInt((x.split(":")[1].trim()).replace('.',''))))
                    
                }else if(x.match(/;/)){
                    setOngkir(parseInt((x.split(";")[1].trim()).replace('.','')))
                    setOngkirP(formatRupiah(parseInt((x.split(";")[1].trim()).replace('.',''))))
                }

            } else if (x.match(/pot/i)){
                if(x.match(/:/)){
                    setSubsidi(parseInt((x.split(":")[1].trim()).replace('.','')))
                    setSubsidiP(formatRupiah(parseInt((x.split(":")[1].trim()).replace('.',''))))
                    
                }else if(x.match(/;/)){
                    setSubsidi(parseInt((x.split(";")[1].trim()).replace('.','')))
                    setSubsidiP(formatRupiah(parseInt((x.split(";")[1].trim()).replace('.',''))))
                }

            } else if (x.match(/email/i)){
                if(x.match(/:/)){
                    setEmail(x.split(":")[1].trim())
                }else if(x.match(/;/)){
                    setEmail(x.split(";")[1].trim())
                }

            } else if (x.match(/alamat/i) || x.match(/alamt/i) || x.match(/almt/i) || x.match(/jln/i) || x.match(/jalan/i)){
                if(x.match(/:/)){
                    let address = x.split(":")[1].trim()
                    if (address.length > 20){
                        setAlamat(x.split(":")[1].trim())
                        alamatRef.current = x.split(":")[1].trim()

                        // searchLoc(x.split(":")[1].trim())
                    }
                } else if(x.match(/;/)){
                    let address = x.split(";")[1].trim()
                    if (address.length > 20){
                        setAlamat(x.split(";")[1].trim())
                        alamatRef.current = x.split(";")[1].trim()

                        // searchLoc(x.split(":")[1].trim())
                    }
                }

                searchLoc(x)
            

            } 
        })

        product.forEach(x => {
            var pasteText = text.toLowerCase()
            var idx = pasteText.indexOf(x.name.toLowerCase())
            var regex = /\d+/g;
            if (idx > -1){
                console.log("==================")
                console.log(x.name)
                var str = pasteText.split(x.name.toLowerCase())[0]
                var matches = str.match(regex); 
                var qty = matches.slice(-1)[0]
                
                var randId = Math.random();
                setItemKey(randId.toString())
                var object = {
                    item_key : randId.toString(),
                    item_value : x.id.toString()+'/*/'+x.price.toString()+'/*/'+x.name,
                    item_id : x.id,
                    name : x.name,
                    jual : x.price,
                    quantity : Number(qty)
                }
                itemRef.current = [...itemRef.current, object]
                setItem(itemRef.current)

            }
            
        });

        // console.log(arr)
        // console.log(arr[2].split(":")[1].trim())
    }

     // to get produk list
     const getProduct = async ()=>{
        const URL = Constant.BASE_URL+"/product_get";

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
                } else {
                    var data = responseData.data 
                    setProduct(data)

                    var itemList =[]
                    data.map((item)=>{
                        var object = {
                            label: item.name,
                            value: item.id.toString()+'/*/'+item.price.toString()+'/*/'+item.name,
                        }
                        itemList = [...itemList, object]
                    }) 
                    setItems(itemList)
                }
            }
        }catch(error){
            Alert.alert('Tidak ada Koneksi Internet');
            console.log(error)
        }
    }

    //when user click add
    const handleAdd = ()=>{
        if (itemId == 0 && itemName ==""){
            Alert.alert("Silahkan pilih produk")
        } else if (Number(quantity) == 0){
            Alert.alert("Masukan jumlah item")
        } else {
            var randId = Math.random();
            setItemKey(randId.toString())
            var object = {
                item_key : randId.toString(),
                item_value : value,
                item_id : itemId,
                name : itemName,
                jual : jual,
                quantity : Number(quantity)
            }
            setItem([...item, object])
            closeModal()
        }   
    }

    // to handle quantity
    const handleQty = (val)=>{
        var amount = val.replace(/[^0-9]/g, '')
        setQuantity (amount)
    }

    // to handle of money input
    const handleMoneyInput = (val, type)=>{
        var amount = val.replace(/[^0-9]/g, '')
        if (type == 'ongkir') {
            setOngkirP(formatRupiah(amount))
            setOngkir(amount ? amount : 0)
        } else if (type == 'subsidi'){
            setSubsidiP(formatRupiah(amount))
            setSubsidi(amount ? amount : 0)
        } else if (type == 'jual'){
            setJualPreview(formatRupiah(amount))
            setJual(amount ? amount : 0)
        }
    }

    //render list of item
    const ItemList = ({item}) =>{
        return (
            <TouchableOpacity style={{ flexDirection:'row',  paddingVertical:5}} onPress={()=>{itemClicked(item)}} >
                <Text>({item.quantity})</Text>
                <Text style={{flex:1, paddingLeft:10, paddingRight:10}}>{item.name}</Text>
                <Text>{formatRupiah(item.jual)}</Text>
            </TouchableOpacity>
    )}

    const handleSimpan = async () =>{
        if (nama == ''){
            Alert.alert('masukkan nama pelanggan')
        } else if (noTelepon == '') {
            Alert.alert('masukkan no telepon pelanggan')
        } else if (alamat == ''){
            Alert.alert('masukkan alamat pelanggan')
        } else if (totalPenjualan == 0){
            Alert.alert('masukkan item penjualan')

        } else if (valuePembayaran == '') {
            Alert.alert('pilih metode pembayaran')
        } else {
            var date = new Date()
            var created_at = require('moment')(date).format('YYYY-MM-DD');
            setLoading(true)
    
            const URL = Constant.BASE_URL+"/count_packet";
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
                    throw new Error("something is wrong!");
    
                } else {
                    const responseData = await response.json();
                    if (responseData.status != 200){
                        console.log('failed')
                        setLoading(false)
    
                    } else {
                        var resData = responseData.data
                        console.log('=---------hey----------=')
                        var no 
                        if (resData.length > 0 ){
                            console.log(resData[0].no)
                            no = resData[0].no + 1
                        } else {
                            no = 1
                        }
                        console.log(no)
                        
    
                        let obj = {
                            no : no,
                            nama : nama,
                            no_telpon : noTelepon,
                            email : email,
                            alamat : alamat,
                            kota : kota,
                            desa : desa,
                            postcode : postcode,
                            total_penjualan : totalPenjualan,
                            ongkir : ongkir,
                            subsidi : subsidi,
                            total : Number(totalPenjualan) + Number(ongkir) - Number(subsidi),
                            item : JSON.stringify(item),
                            pembayaran : valuePembayaran,
                            created_at : created_at,
                            edited_at : created_at,
                        }
    
    
                        const URL2 = Constant.BASE_URL+"/transaction_add";
                        try{
                            const response = await fetch(URL2, {
                                method: "POST",
                                body: JSON.stringify(obj),
                                headers:{
                                    'Accept': 'application/json',
                                    "Content-Type" : "application/json"
                                }
                            });
                
                            if(response.status !=200){
                                throw new Error("something is wrong!");
                
                            } else {
                                const responseData = await response.json();
                                if (responseData.status != 200){
                                    console.log('failed')
                                    setLoading(false)
    
                                } else {
                                    var resData = responseData.data
                                    console.log(resData)
                                                            
                                    setText("")
                                    setNama("")
                                    setNoTelepon("")
                                    // setNoWa("")
                                    setKota("")
                                    setDesa("")
                                    setPostcode("")
                                    setEmail("")
                                    setAlamat("")
    
                                    setOngkirP("")
                                    setOngkir(0)
                                    setSubsidi(0)
                                    setSubsidiP("")
                                    setTotalPenjualan(0)
    
                                    setItem([])
                                    setValuePembayaran('')
                                    itemRef.current = []
    
                                    kotaRef.current = ""
                                    desaRef.current = ""
                                    postcodeRef.current = ""
                                    alamatRef.current = ""
                                    setLoading(false)

                                    props.navigation.navigate(
                                        {
                                            name: 'Transaksi', 
                                            params: {
                                                date: new Date()
                                                },
                                        })
    
                                }
                            }
                        }catch(error){
                            setLoading(false)
                            Alert.alert('Tidak ada Koneksi Internet');
                        }
    
                        
                    }
                }
            }catch(error){
                setLoading(false)
                Alert.alert('Tidak ada Koneksi Internet');
            }
    
    
            // console.log(obj)
    
        }

       

    }


  return (
    <SafeAreaView style={styles.container}>

        {/*===== COPY AND PASTE =====*/}
        <View style={{width:'100%',  flexDirection:'row', alignItems:'center', paddingHorizontal:20}}>
            <TextInput
                value = {text}
                // keyboardType="number-pad"
                placeholder= 'Copy dan Paste disini'
                placeholderTextColor={Constant.GREY_PLACEHOLDER}
                returnKeyType="done"
                autoCapitalize="words"
                multiline
                maxHeight={160}
                style={{
                    flex:1,
                    borderColor: '#BABABA',
                    borderWidth:1,
                    paddingVertical:  5,
                    paddingHorizontal: 10,
                    justifyContent:'center',
                    alignItems:'center',
                    // marginHorizontal: 20,
                    borderRadius:5,
                    marginVertical:10,
                }}
                onChangeText={setText}
                // onFocus={()=>{setQuantity('')}}
                // onBlur={()=>{ if (quantity == '') {setQuantity('1')}}}
            />
            
            
        </View>

        <TouchableOpacity onPress={addPasted} style={{backgroundColor:Constant.PRIMARY_COLOR,  borderRadius:5, marginHorizontal:20, alignSelf:'flex-start', justifyContent:'center', alignItems:'center', marginBottom:10}}>
                {/* <Icon
                    name='add'
                    type='material'
                    color= 'white'
                    size={25}
                /> */}
                <Text style={{color:'white', paddingHorizontal:20, paddingVertical:7}}> Generate </Text>
            </TouchableOpacity>
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
                    onChangeText={setNama}
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
                    onChangeText={setNoTelepon}
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
                    onChangeText={setEmail}
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
                onChangeText={setKota}
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
                onChangeText={setDesa}
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
                onChangeText={setPostcode}
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
                onChangeText={setAlamat}
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

                {/* add item icon */}
                <TouchableOpacity style={styles.addIconContainer} onPress={()=> { setOpen(true); setModalVisible(true)}}>
                    <View style={styles.addIcon}>
                        <Icon
                            name='plus'
                            type='material-community'
                            color="white"
                            size={12}
                        />
                    </View>    
                </TouchableOpacity>
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
                onChangeText={(val)=>{handleMoneyInput(val, 'ongkir')}}
                onBlur={()=>{if(ongkir == 0) setOngkirP(formatRupiah(0))}}

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
                onChangeText={(val)=>{handleMoneyInput(val, 'subsidi')}}
                onBlur={()=>{if(subsidi == 0) setSubsidiP(formatRupiah(0))}}
                // onFocus={()=>{setQuantity('')}}
                // onBlur={()=>{ if (quantity == '') {setQuantity('1')}}}
            />
        </View>

        <View style={{flexDirection:'row', paddingVertical:10, borderTopColor:'#f0f0f0', borderTopWidth:1}}>
            <Text style={{flex:1, fontWeight:'bold', fontSize:16}}>Total</Text>
            <Text style={{fontWeight:'bold', fontSize:16, color:Constant.PRIMARY_COLOR}}>{formatRupiah(Number(totalPenjualan) + Number(ongkir) - Number(subsidi))}</Text>
        </View>

        <View style={{ alignItems:'center', paddingTop:5, paddingBottom:10}}>
            <MainButton title='Simpan'  onPress={handleSimpan}/>
        </View>

        </ScrollView>


        {/* ========== MODAL =========== */}
        <Modal
            style={styles.modal}
            isVisible={isModalVisible}
            onBackdropPress={closeModal}
            onBackButtonPress={closeModal}
            >   
            <KeyboardAvoidingView behavior= {Platform.OS === 'ios'? 'position': null}>
                <View style={[styles.bottomModal,{height: open && items.length != 0? Constant.DEVICE_HEIGHT*0.6 : null}]}>
                    {/* header */}
                    <View style={styles.header}>
                        <Text style={styles.headerText}>{onItemClicked?"Edit Item" : "Tambah Item"}</Text>

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
                        {onItemClicked&&
                        <TouchableOpacity style={styles.removeButton} onPress={handleRemoveItem}>
                            <Icon
                                name='trash'
                                type='ionicon'
                                color="#FF5959"
                                size={25}
                            />
                        </TouchableOpacity>
                        }
                    </View>

                    {/* nama item */}
                    <View style={styles.section}>
                        <Text>Nama Produk</Text>

                        <DropDownPicker
                            dropDownDirection="BOTTOM"
                            maxHeight={Constant.DEVICE_HEIGHT*0.4}
                            searchable={true}
                            searchPlaceholder="Cari..."
                            searchContainerStyle={styles.searchContainerStyle}
                            searchTextInputStyle={styles.searchTextInputStyle}
                            ArrowUpIconComponent={() => <Icon name='arrow-drop-up' type='material' color="black" size={30}/>}
                            ArrowDownIconComponent={() => <Icon name='arrow-drop-down' type='material' color="black" size={30}/>}
                            placeholder="Pilih Produk"
                            placeholderStyle={{color: Constant.GREY_PLACEHOLDER}}
                            style={styles.dropdownStyle}
                            dropDownContainerStyle={styles.dropDownContainerStyle}
                            open={open}
                            value={value}
                            items={items}
                            setOpen={setOpen}
                            setValue={setValue}
                            setItems={setItems}
                            onChangeValue={handlePickItem}
                        />
                    </View>

                    <View style={styles.hargaContainer}>

                        {/* Harga Jual*/}
                        <View style={[styles.section, {width:'47%'}]}>
                            <Text>Harga Jual</Text>
                    
                            <TextInput
                                value = {jualPreview}
                                clearButtonMode='while-editing'
                                keyboardType="number-pad"
                                placeholder= 'Rp 0'
                                placeholderTextColor={Constant.GREY_PLACEHOLDER}
                                returnKeyType="done"
                                autoCapitalize="words"
                                style={styles.textInput}
                                onChangeText={(val)=>handleMoneyInput(val,'jual')}
                                onBlur={()=>{if(jual == 0) setJualPreview(formatRupiah(0))}}
                            />
                        </View>

                        {/* Jumlah */}
                    <View style={[styles.section,{zIndex:-1}]}>
                        <Text>Jumlah</Text>
                        <View style={styles.quantity}>

                            {/* minus item */}
                            <TouchableOpacity style={styles.addIconContainer} onPress={()=>{if((Number(quantity)>1)) setQuantity((Number(quantity)-1).toString())}}>
                                <View style={styles.addIcon}>
                                    <Icon
                                        name='minus'
                                        type='material-community'
                                        color="white"
                                        size={15}
                                    />
                                </View>    
                            </TouchableOpacity>

                            {/* amount */}
                            <TextInput
                                value = {quantity}
                                // clearButtonMode='while-editing'
                                keyboardType="number-pad"
                                placeholder= '0'
                                placeholderTextColor={Constant.GREY_PLACEHOLDER}
                                returnKeyType="done"
                                autoCapitalize="words"
                                style={styles.qtyInput}
                                onChangeText={handleQty}
                                onFocus={()=>{setQuantity('')}}
                                onBlur={()=>{ if (quantity == '') {setQuantity('1')}}}
                            />

                            {/* add item */}
                            <TouchableOpacity style={styles.addIconContainer} onPress={()=>{setQuantity((Number(quantity)+1).toString())}}>
                                <View style={styles.addIcon}>
                                    <Icon
                                        name='plus'
                                        type='material-community'
                                        color="white"
                                        size={15}
                                    />
                                </View>    
                            </TouchableOpacity>
                        </View>
                    </View>
                    </View>


                    {/* "Tambah" Button */}
                    <View style={{alignItems:'center', zIndex:-1}}>
                        {onItemClicked?
                            <MainButton title='Simpan'  onPress={handleEditItem}/>
                        :
                            <MainButton title='Tambah'  onPress={handleAdd}/>
                        }
                    </View>

                </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* loading indicator */}
            {loading &&
            <View style={styles.loading}>
                <View style={{backgroundColor:'white', borderRadius:10, padding:20}}>
                    <ActivityIndicator size="small" color={Constant.PRIMARY_COLOR}/>
                </View>
            </View>
            }
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop:40,
        // justifyContent: 'center',
    },
    scroll:{
        paddingHorizontal:20,
        flex:1, 
        width:'100%'
    },
    textField:{
        backgroundColor: Constant.GREY_BACKGROUND,
        paddingVertical: 5,
        paddingHorizontal: 16,
        justifyContent:'center',
        alignItems:'center',
        // marginHorizontal: 20,
        borderRadius:5,
        marginVertical:5
    },
    labelText:{
        fontWeight:'bold',
        fontSize:14,
        marginTop:5
    },
    customerField:{
        backgroundColor: Constant.GREY_BACKGROUND,
        flexDirection:'row', 
        alignItems:'center', 
        justifyContent:'space-between',
      
        paddingHorizontal: 16,
        borderRadius:5,
        marginVertical:5
    },
    dropdownStyle: {
        backgroundColor: Constant.GREY_BACKGROUND,
        borderRadius:5,
        borderColor: "white",
        marginTop:0,
        height:45,
    
    },
    dropDownContainerStyle: {
        borderColor: Constant.GREY_BACKGROUND,
        backgroundColor:'white',
        marginTop:5
    },
    addIconContainer: {
        alignItems:'flex-start', 
        paddingVertical:10
    },
    addIcon : {
        backgroundColor: Constant.PRIMARY_COLOR, 
        padding:5, 
        borderRadius:50 
    },
    searchTextInputStyle: {
        color: "#000",
        borderColor: "#dfdfdf",
        paddingVertical: Platform.OS === 'ios' ? 12 : 5
    },
    searchContainerStyle: {
        borderBottomColor: "white"
    },
    hargaContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        zIndex:-1
    },
    quantity:{
        flexDirection:'row',
        alignItems:'center',
    },
    qtyInput:{
        backgroundColor: Constant.GREY_BACKGROUND,
        paddingVertical: Platform.OS === 'ios'? 15 : 7,
        paddingHorizontal: 20,
        justifyContent:'center',
        alignItems:'center',
        marginHorizontal: 20,
        borderRadius:10,
        marginVertical:5
    },
    hargaContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        zIndex:-1
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
    boldText:{
        fontWeight:'bold'
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
        height:Constant.DEVICE_HEIGHT, 
        justifyContent:'center', 
        alignItems:'center'
    },
});
