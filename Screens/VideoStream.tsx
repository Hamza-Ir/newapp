import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import WebSocket from 'react-native-websocket';

const WebSocketTest = () => {
  useEffect(() => {
    const socket = new WebSocket('ws://52.66.121.78:5001');

    socket.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    socket.onmessage = event => {
      console.log('Message received from server:', event.data);
    };

    socket.onerror = error => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Testing WebSocket Connection</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default WebSocketTest;
