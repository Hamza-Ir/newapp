import * as React from 'react';
import {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from './Screens/HomeScreen';
import Stream from './Screens/Stream';
import Settings from './Screens/Settings';
import LoginScreen from './Screens/LoginScreen';
import SignupScreen from './Screens/SignupScreen';
import {Alert} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SERVER_IP, SERVER_PORT} from './config';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'purple',
        tabBarInactiveTintColor: 'gray',
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Stream"
        component={Stream}
        options={{
          tabBarLabel: 'RTSP Stream',
          tabBarIcon: ({color, size}) => (
            <Icon name="videocam" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const sendTokenToServer = async token => {
  try {
    // Retrieve CSRF token and userId from AsyncStorage
    const csrf = (await AsyncStorage.getItem('csrf')) || '';
    const userId = (await AsyncStorage.getItem('userId')) || '';

    // Set headers
    const headers = {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrf,
      id: userId,
    };

    // Send POST request with the token and headers
    const response = await fetch(
      `http://${SERVER_IP}:${SERVER_PORT}/api/sendToken`,
      {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({token}),
      },
    );

    // Check if the response is ok
    if (!response.ok) {
      throw new Error('Failed to send token to server');
    }

    // // Parse and log the server response
    // const data = await response.json();
    // console.log('Server response:', data);
  } catch (error) {
    console.error('Error sending token to server:', error);
  }
};

const getToken = async () => {
  try {
    const token = await messaging().getToken();
    //console.log('Token:', token);
    await sendTokenToServer(token);
  } catch (error) {
    console.error('Error getting token:', error);
  }
};

const App = () => {
  useEffect(() => {
    getToken();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('Intruder Detected!');
    });
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
};

export default App;
