import {View, Text, StyleSheet, TextInput, Button} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';

const Settings = () => {
  const [text, onChangeText] = useState(
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  );
  const navigation = useNavigation();

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
