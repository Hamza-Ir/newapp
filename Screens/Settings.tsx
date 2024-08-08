import {View, Button, StyleSheet, ActivityIndicator} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import RNRestart from 'react-native-restart';
import {getServerConfig} from '../config';

const Settings = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true); // Show the loading spinner

    try {
      // Retrieve userId and csrf from AsyncStorage
      const userId = await AsyncStorage.getItem('userId');
      const csrf = await AsyncStorage.getItem('csrf');
      const token = await AsyncStorage.getItem('token');

      // If userId or csrf is not available, handle the case
      if (!userId || !csrf) {
        console.error('User ID or CSRF token not found in AsyncStorage.');
        Toast.show({
          type: 'error',
          text1: 'Logout failed',
          text2: 'User ID or CSRF token not found.',
        });
        return;
      }

      // Get server IP and port from config
      const {ip, port} = await getServerConfig();

      // API call to logout endpoint
      const url = `http://${ip}:${port}/api/logout`;
      const headers = {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrf,
        id: userId,
      };

      const response = await axios.post(url, {token}, {headers});

      // Handle logout success
      Toast.show({
        type: 'success',
        text1: response.data.message,
      });

      // Clear AsyncStorage after successful logout
      await AsyncStorage.removeItem('csrf');
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('token');

      // Restart the app or navigate to Login screen
      RNRestart.Restart();
      // If restarting is not suitable, you can navigate directly:
      // navigation.navigate('Login');
    } catch (error) {
      // Handle errors
      console.error('Logout error:', error);
      Toast.show({
        type: 'error',
        text1: 'Logout failed',
        text2: error.message || 'An unknown error occurred.',
      });

      // Optionally, handle logout failure and navigate to login screen
      // If restarting is not suitable, you can navigate directly:
      // navigation.navigate('Login');
    } finally {
      setLoading(false); // Hide the loading spinner
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Logout" onPress={handleLogout} color="red" />
      )}
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
