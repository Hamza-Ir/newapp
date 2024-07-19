import React, {useEffect} from 'react';
import {Alert, View, Text} from 'react-native';

const Notification = () => {
  useEffect(() => {
    // Create a WebSocket connection
    const ws = new WebSocket('ws://44.201.164.10:6000/ws/notifications/');

    // Function to handle incoming messages
    const handleMessage = event => {
      const message = event.data;
      // Display an alert with the received message
      Alert.alert('Notification', message);
    };

    // Set up event listeners
    ws.onmessage = handleMessage;
    ws.onerror = error => {
      console.error('WebSocket Error: ', error);
    };
    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Clean up the WebSocket connection on component unmount
    return () => {
      ws.close();
    };
  }, []);

  return (
    <View>
      <Text>WebSocket Notifications</Text>
    </View>
  );
};

export default Notification;
