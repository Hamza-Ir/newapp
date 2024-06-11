import React from 'react';
import {View, Text, Button} from 'react-native';

const LoginScreen = ({navigation}) => {
  const handleLogin = () => {
    // Perform login logic here (e.g., authenticate user)
    // After successful login, navigate to the Tab Navigator
    navigation.replace('MainTabs');
  };

  return (
    <View>
      <Text>Login Screen</Text>
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;
