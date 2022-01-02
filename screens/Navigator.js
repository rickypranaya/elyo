import * as React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

//import library
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import {Icon} from 'react-native-elements';

//components
// import Constant from '../components/Constants';

//import screens
import Generate from './Generate'
import Product from './Product';
import Transaction from './Transaction'

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function Navigator() {
    // const [userRole, setUserRole] = React.useState('')

    const Tabs =()=>{
        return(
            <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                let type;
                let iconSize;

                if (route.name === 'Transaksi') {
                    if (iconName = focused){
                        iconName = 'tag'
                        type = 'material-community'
                        iconSize = 22
                    } else {
                        iconName = 'tag-outline'
                        type = 'material-community'
                        iconSize = 22
                    }
                } else if (route.name === 'Tambah') {
                    if (iconName = focused){
                        iconName = 'add-circle-sharp'
                        type = 'ionicon'
                        iconSize = 27
                    } else {
                        iconName = 'add-circle-outline'
                        type = 'ionicon'
                        iconSize =27
                    }
                } else  if (route.name === 'Produk') {
                    if (iconName = focused){
                        iconName = 'list-circle'
                        type = 'ionicon'
                        iconSize = 26
                    } else {
                        iconName = 'list-circle-outline'
                        type = 'ionicon'
                        iconSize = 26
                    }
                } else  {
                    if (iconName = focused){
                        iconName = 'person-circle'
                        type = 'ionicon'
                        iconSize = 26
                    } else {
                        iconName = 'person-circle-outline'
                        type = 'ionicon'
                        iconSize =26
                    }
                }
                return (
                    <Icon
                    name={iconName}
                    type={type}
                    color={color}
                    size={iconSize}
                    />);
                },
            })}

            tabBarOptions={{
            
                activeTintColor: 'blue',
                inactiveTintColor: '#676767',
                style:{ paddingBottom:10, paddingTop:6, height:58}
            }}
            >
                <Tab.Screen name="Transaksi" component={Transaction}/>
                <Tab.Screen name="Tambah" component={Generate} />
                <Tab.Screen name="Produk" component={Product} />
      
            </Tab.Navigator>
        )
    }

  return (
    <NavigationContainer>
            <Tabs/>
    </NavigationContainer>
  );
}