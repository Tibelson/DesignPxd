import "./gesture-handler"
import React, { useEffect } from 'react';
import {NavigationContainer} from "@react-navigation/native"
import {createDrawerNavigator} from "@react-navigation/drawer"
import HomeScreen from './routes/homescreen/HomeScreen.jsx';
import Map from "./routes/directions-page/DirectionHome.jsx";
import EmergencyContacts from './routes/emergency-contacts/EmergencyContacts.jsx';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Alert, Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Provider } from 'react-redux';
import { store } from './store';
import RNBluetoothClassic, { BluetoothDevice } from 'react-native-bluetooth-classic';
const {Navigator, Screen} = createDrawerNavigator();

const requestPermission = async (permission) => {
  try {
    const result = await request(permission);
    return result === RESULTS.GRANTED;
  } catch (error) {
    console.error('Error requesting permission:', error);
    return false;
  }
};

export default function App() {
  // check and request permissions
  useEffect(() => {
    const checkAndRequestPermissions = async () => {
      const permissions = Platform.select({
        android: [
          PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
          PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
          PERMISSIONS.ANDROID.CALL_PHONE,
        ],
        ios: [
          PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL,
          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
          PERMISSIONS.IOS.LOCATION_ALWAYS,
        ],
      }) || [];

      for (const permission of permissions) {
        try {
          const status = await check(permission);
          
          if (status === RESULTS.DENIED) {
            const granted = await requestPermission(permission);
            if (!granted) {
              console.log(`Permission ${permission} denied`);
            }
          } else if (status === RESULTS.BLOCKED) {
            Alert.alert(
              'Permission Required',
              'Please enable the required permissions in your device settings to use all features of the app.',
              [{ text: 'OK' }]
            );
            break;
          }
        } catch (error) {
          console.error(`Error checking permission ${permission}:`, error);
        }
      }
    };

    checkAndRequestPermissions();
  }, []);
  
  useEffect(() => {
    (async () => {
      console.log('configuring bluetooth')
      if (RNBluetoothClassic.isBluetoothEnabled()){
        MAC_ADDR = "00:21:09:00:0A:2C"
        device = await RNBluetoothClassic.getConnectedDevice(MAC_ADDR)
        console.log(device)
        device.onDataReceived((data)=>{
          console.log(data)
        })
    }})();
    
  }, []);

  return(
    <Provider store={store}>
      <NavigationContainer>
        <Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#f8f9fa',
            },
            headerTintColor: '#212529',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            drawerActiveTintColor: '#007AFF',
            drawerInactiveTintColor: '#212529',
          }}
        >
          <Screen 
            name='Home' 
            component={HomeScreen}
            options={{
              title: 'Navigation Assistant',
              drawerIcon: ({focused, size, color}) => (
                <Icon name="home" size={size} color={color} />
              ),
            }}
          />
          <Screen 
            name='EmergencyContacts' 
            component={EmergencyContacts}
            options={{
              title: 'Emergency Contacts',
              drawerIcon: ({focused, size, color}) => (
                <Icon name="contacts" size={size} color={color} />
              ),
            }}
          />
          <Screen 
            name='Direction' 
            component={Map}
            options={{
              title: 'Navigation',
              drawerIcon: ({focused, size, color}) => (
                <Icon name="map-marker-path" size={size} color={color} />
              ),
            }}
          />
        </Navigator>
      </NavigationContainer>
    </Provider>
  );
}
