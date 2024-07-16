import React, {useEffect, useState} from 'react';
import {View, Text, Button, Alert, Platform} from 'react-native';
import PushNotification from 'react-native-push-notification';
import {WebSocketProvider, useWebSocket} from 'react-native-websocket';

// Function to configure push notifications
const configurePushNotifications = () => {
  PushNotification.configure({
    onRegister: function (token) {
      console.log('TOKEN:', token);
    },
    onNotification: function (notification) {
      console.log('NOTIFICATION:', notification);
      notification.finish(PushNotification.FetchResult.NoData);
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: Platform.OS === 'ios',
  });
};

const NotificationHandler = () => {
  const [notifications, setNotifications] = useState([]);
  const ws = useWebSocket('ws://35.154.37.245:5000/ws/notifications/');

  useEffect(() => {
    configurePushNotifications();

    ws.onmessage = e => {
      const data = JSON.parse(e.data);
      console.log('Received message:', data);
      setNotifications(prev => [...prev, data]);

      // Display a local notification
      PushNotification.localNotification({
        title: `Camera ID: ${data.camera_id}`,
        message: `Identity: ${data.identity}, Confidence: ${(
          data.confidence * 100
        ).toFixed(2)}%`,
      });
    };

    ws.onerror = e => {
      console.log('WebSocket error', e);
    };

    ws.onclose = e => {
      console.log('WebSocket closed', e);
    };

    return () => {
      ws.close();
    };
  }, [ws]);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Button
        title="Enable Notifications"
        onPress={() => {
          PushNotification.requestPermissions().then(permission => {
            console.log('Notification permission status:', permission);
            if (permission.alert || permission.badge || permission.sound) {
              Alert.alert('Desktop notifications enabled.');
            } else {
              Alert.alert('Desktop notifications denied.');
            }
          });
        }}
      />
      {notifications.map((notification, index) => (
        <View
          key={index}
          style={{
            margin: 10,
            padding: 10,
            backgroundColor: '#f9f9f9',
            borderLeftWidth: 6,
            borderLeftColor: '#4caf50',
          }}>
          <Text style={{fontWeight: 'bold'}}>
            Camera ID: {notification.camera_id}
          </Text>
          <Text>Identity: {notification.identity}</Text>
          <Text style={{color: '#888'}}>
            Confidence: {(notification.confidence * 100).toFixed(2)}%
          </Text>
        </View>
      ))}
    </View>
  );
};

export default NotificationHandler;
