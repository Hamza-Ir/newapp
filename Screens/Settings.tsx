import {View, Button, StyleSheet} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

const Settings = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    // Perform any additional logout logic here if needed
    // Navigate back to the login screen
    navigation.replace('Login');
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
