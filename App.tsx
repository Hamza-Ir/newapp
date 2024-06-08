import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from './Screens/HomeScreen';
import Stream from './Screens/Stream';
import Settings from './Screens/Settings';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
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
    </NavigationContainer>
  );
};

export default App;
