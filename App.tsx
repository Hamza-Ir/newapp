import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from './Screens/HomeScreen';
import Stream from './Screens/Stream';
import Settings from './Screens/Settings';
import LoginScreen from './Screens/LoginScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import 'react-native-url-polyfill/auto';
import Toast from 'react-native-toast-message';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator screenOptions={{tabBarActiveTintColor: 'purple'}}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Stream"
        component={Stream}
        options={{
          tabBarLabel: 'RTSP Stream',
        }}
      />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
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
