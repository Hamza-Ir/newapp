import {
  View,
  StyleSheet,
  Button,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {VLCPlayer} from 'react-native-vlc-media-player';

const Stream = () => {
  const [streams, setStreams] = useState([]);
  const [selectedStream, setSelectedStream] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [newStreamUrl, setNewStreamUrl] = useState('');
  const [newStreamName, setNewStreamName] = useState('');

  const handleAddStream = () => {
    if (streams.some(stream => stream.url === newStreamUrl)) {
      Alert.alert(
        'Stream already exists',
        'The stream URL you entered is already in the list.',
      );
    } else if (newStreamUrl.trim() === '' || newStreamName.trim() === '') {
      Alert.alert('Invalid Input', 'The stream URL and name cannot be empty.');
    } else {
      setStreams(prevStreams => [
        ...prevStreams,
        {url: newStreamUrl, name: newStreamName},
      ]);
      setNewStreamUrl('');
      setNewStreamName('');
      setShowInput(false);
    }
  };

  const handleDeleteStream = url => {
    setStreams(prevStreams => prevStreams.filter(stream => stream.url !== url));
    if (selectedStream === url) {
      setSelectedStream(null);
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
      <Button title="Delete" onPress={() => handleDeleteStream(item.url)} />
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
                <Button title="Done" onPress={handleAddStream} />
                <Button title="Cancel" onPress={() => setShowInput(false)} />
              </View>
            </View>
          ) : (
            <View style={styles.addButton}>
              <Button title="Add Stream" onPress={() => setShowInput(true)} />
            </View>
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
});

export default Stream;
