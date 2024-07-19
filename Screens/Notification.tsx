import React, {useEffect, useState, useRef} from 'react';
import {View, Text, Button, Alert, StyleSheet, ScrollView} from 'react-native';

const Notification = () => {
  const [unknownCount, setUnknownCount] = useState(0);
  const ws = useRef(null); // Use useRef for WebSocket instance

  useEffect(() => {
    // Initialize WebSocket connection on component mount
    ws.current = new WebSocket('ws://44.201.164.10:5000/ws/notifications/');

    ws.current.onmessage = e => {
      const data = JSON.parse(e.data);
      console.log('Received message:', data);

      // Check if identity is "Unknown" and increment count
      if (data.identity === 'Unknown') {
        setUnknownCount(prevCount => prevCount + 1);
        //console.log('Unknown count:', unknownCount);

        // Show notification if "Unknown" count reaches 10, and reset count
        // if (unknownCount + 1 >= 10) {
        //   console.log('Count is 10 initiating alert');
        //   setUnknownCount(0);
        //   Alert.alert(
        //     'Multiple Unknown Identities Detected',
        //     `Camera ID: ${data.camera_id} - Unknown identities detected multiple times.`,
        //   );
        // }
      } else {
        // Reset count if identity is not "Unknown"
        if (unknownCount > 0) {
          // console.log('Resetting count as identity is not Unknown');
          // setUnknownCount(0);
        }
      }
    };

    ws.current.onerror = e => {
      console.log('WebSocket error', e);
    };

    ws.current.onclose = e => {
      console.log('WebSocket closed', e);
    };

    return () => {
      // Close WebSocket connection on component unmount
      ws.current.close();
    };
  }, []); // Empty dependency array ensures effect runs only once on mount

  return (
    <View style={styles.container}>
      <Button
        title="Enable Notifications"
        onPress={() => {
          Alert.alert('Notifications enabled.');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 10,
  },
});

export default Notification;
