import {
  View,
  StyleSheet,
  Button,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {VLCPlayer} from 'react-native-vlc-media-player';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {SERVER_IP, SERVER_PORT} from '../config';

const Stream = () => {
  const [streams, setStreams] = useState<{name: string; url: string}[]>([]);
  const [selectedStream, setSelectedStream] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [newStreamUrl, setNewStreamUrl] = useState('');
  const [newStreamName, setNewStreamName] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const fetchStreams = async () => {
    try {
      const csrf = await AsyncStorage.getItem('csrf');
      const userId = await AsyncStorage.getItem('userId');

      const headers = {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrf,
        id: userId,
      };

      const response = await axios.get(
        `http://${SERVER_IP}:${SERVER_PORT}/api/getDevicesurl`,
        {headers},
      );
      const streamsData = response.data;

      const streamsArray = Object.entries(streamsData).map(([name]) => ({
        name,
        url: `http://${SERVER_IP}:${SERVER_PORT}/vidstr/` + name,
      }));
      setStreams(streamsArray);
    } catch (error) {
      console.error('Error fetching streams:', error);
      Alert.alert('Error', 'Failed to fetch streams. Please try again.');
    }
  };

  useEffect(() => {
    fetchStreams();
  }, []);

  const handleAddStream = async () => {
    setLoading(true); // Start loading
    try {
      if (newStreamUrl.trim() === '' || newStreamName.trim() === '') {
        Alert.alert(
          'Invalid Input',
          'The stream URL and name cannot be empty.',
        );
        setLoading(false); // Stop loading
        return;
      }

      const url = `http://${SERVER_IP}:${SERVER_PORT}/api/updatedevices`;

      const csrf = await AsyncStorage.getItem('csrf');
      const userId = await AsyncStorage.getItem('userId');

      const headers = {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrf,
        id: userId,
      };

      const data = {
        device_url: {
          [newStreamName]: newStreamUrl,
        },
      };

      await axios.put(url, data, {headers});

      await fetchStreams();

      setNewStreamUrl('');
      setNewStreamName('');
      setShowInput(false);
    } catch (error) {
      console.error('Error adding stream:', error);
      Alert.alert('Error', 'Failed to add stream. Please try again.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleDeleteStream = async name => {
    setLoading(true); // Start loading
    try {
      const url = `http://${SERVER_IP}:${SERVER_PORT}/api/deleteDevice`;

      const csrf = await AsyncStorage.getItem('csrf');
      const userId = await AsyncStorage.getItem('userId');

      const headers = {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrf,
        id: userId,
      };

      const data = {
        key: name,
      };

      await axios.post(url, data, {headers});

      await fetchStreams();
    } catch (error) {
      console.error('Error deleting stream:', error);
      Alert.alert('Error', 'Failed to delete stream. Please try again.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.streamItem}>
      <TouchableOpacity
        style={styles.streamItemText}
        onPress={() => setSelectedStream(item.url)}>
        <VLCPlayer
          style={styles.preview}
          videoAspectRatio="16:9"
          source={{uri: item.url}}
          paused={true}
        />
        <Text style={styles.streamName}>{item.name}</Text>
      </TouchableOpacity>
      <Button
        title="Delete"
        onPress={() => handleDeleteStream(item.name)}
        disabled={loading} // Disable button while loading
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {selectedStream ? (
        <>
          <VLCPlayer
            style={styles.video}
            videoAspectRatio="16:9"
            source={{uri: selectedStream}}
          />
          <Button
            title="Clear Stream"
            onPress={() => setSelectedStream(null)}
          />
        </>
      ) : (
        <>
          {streams.length === 0 ? (
            <Text style={styles.noStreamsText}>No streams added</Text>
          ) : (
            <FlatList
              data={streams}
              renderItem={renderItem}
              keyExtractor={item => item.url}
              contentContainerStyle={styles.flatList}
            />
          )}
          {showInput ? (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter stream URL"
                placeholderTextColor="gray"
                value={newStreamUrl}
                onChangeText={setNewStreamUrl}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter stream name"
                placeholderTextColor="gray"
                value={newStreamName}
                onChangeText={setNewStreamName}
              />
              <View style={styles.buttonContainer}>
                <Button
                  title="Done"
                  onPress={handleAddStream}
                  disabled={loading} // Disable button while loading
                />
                <Button
                  title="Cancel"
                  onPress={() => setShowInput(false)}
                  disabled={loading} // Disable button while loading
                />
              </View>
            </View>
          ) : (
            <>
              <View style={styles.addButton}>
                <Button
                  title="Add Stream"
                  onPress={() => setShowInput(true)}
                  disabled={loading} // Disable button while loading
                />
              </View>
              <View>
                <Button
                  title="Refresh"
                  onPress={fetchStreams}
                  disabled={loading} // Disable button while loading
                />
              </View>
            </>
          )}
          {loading && ( // Show loading indicator while loading
            <ActivityIndicator
              size="large"
              color="blue"
              style={styles.loading}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '100%',
    color: 'darkblue',
  },
  streamItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    width: '100%',
    borderWidth: 1,
    borderColor: 'darkblue',
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  streamItemText: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  preview: {
    width: 100,
    height: 56, // Maintain aspect ratio of 16:9
    marginRight: 10,
  },
  streamName: {
    fontSize: 16,
    color: 'darkblue',
    flex: 1,
  },
  video: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'darkblue',
    textAlign: 'center',
  },
  flatList: {
    width: '100%',
  },
  addButton: {
    position: 'absolute',
    bottom: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 12,
  },
  noStreamsText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 10,
    color: 'gray',
    textAlign: 'center',
  },
  loading: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 10,
  },
});

export default Stream;
