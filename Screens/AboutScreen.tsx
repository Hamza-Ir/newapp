import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

const AboutScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to the AboutScreen Screen!</Text>
      <Text style={styles.text}>This is some additional text.</Text>
      <Text style={styles.text}>Here's some more text.</Text>
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
});

export default AboutScreen;
