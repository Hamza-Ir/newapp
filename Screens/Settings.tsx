import {View, Text, StyleSheet, TextInput, Button} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';

const Settings = () => {
  const [text, onChangeText] = useState('http://52.66.121.78:5001/video_feed');
  const navigation = useNavigation();

  const handleLogout = () => {
    // Perform any additional logout logic here if needed
    // Navigate back to the login screen
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add a stream!</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
      />
      <Button
        title="Add"
        onPress={() => navigation.navigate('Stream', {streamUrl: text})}
      />
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
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'darkblue',
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    color: 'darkblue',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    color: 'darkblue',
  },
});

export default Settings;
