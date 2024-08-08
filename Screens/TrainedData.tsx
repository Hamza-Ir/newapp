import React, {useState, useCallback} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SERVER_IP, SERVER_PORT} from '../config';

const TrainedData = () => {
  const [names, setNames] = useState([]);

  const fetchNames = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const csrf = await AsyncStorage.getItem('csrf');

      if (!userId || !csrf) {
        throw new Error('User ID or CSRF token not found');
      }

      const headers = {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrf,
        id: userId,
      };

      const response = await axios.get(
        `http://${SERVER_IP}:${SERVER_PORT}/api/GetTrainedData`,
        {headers},
      );
      setNames(response.data); // Assuming the response is an array of names
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNames();
    }, []),
  );

  const deleteName = async name => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const csrf = await AsyncStorage.getItem('csrf');

      if (!userId || !csrf) {
        throw new Error('User ID or CSRF token not found');
      }

      const headers = {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrf,
        id: userId,
      };

      await axios.post(
        `http://${SERVER_IP}:${SERVER_PORT}/api/deleteImage`,
        {name},
        {headers},
      );
      setNames(names.filter(item => item !== name)); // Update local state to reflect the change
    } catch (error) {
      console.error('Error deleting name:', error);
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item}</Text>
      <TouchableOpacity
        onPress={() => deleteName(item)}
        style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={names}
        renderItem={renderItem}
        keyExtractor={item => item}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
    color: 'black',
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default TrainedData;
