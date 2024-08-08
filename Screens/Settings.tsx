import {View, Button, StyleSheet} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {SERVER_IP, SERVER_PORT} from '../config';
import RNRestart from 'react-native-restart';

const Settings = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      // Retrieve userId and csrf from AsyncStorage
      const userId = await AsyncStorage.getItem('userId');
      const csrf = await AsyncStorage.getItem('csrf');
      const token = await AsyncStorage.getItem('token');

      // If userId or csrf is not available, handle the case (optional)
      if (!userId || !csrf) {
        console.error('User ID or CSRF token not found in AsyncStorage.');
        return;
      }

      // API call to logout endpoint
      const url = `http://${SERVER_IP}:${SERVER_PORT}/api/logout`;
      const headers = {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrf,
        id: userId,
      };

      const response = await axios.post(
        url,
        {
          token: token,
        },
        {headers},
      );

      // Handle logout success
      Toast.show({
        type: 'success',
        text1: response.data.message,
      });

      // Clear AsyncStorage after successful logout

      await AsyncStorage.removeItem('csrf');
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('token');
      RNRestart.Restart();
      // Navigate to Login screen
    } catch (error) {
      // Handle errors
      console.error('Logout error:', error);
      // Optionally, handle logout failure and navigate to login screen
      RNRestart.Restart();
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={handleLogout} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Settings;
