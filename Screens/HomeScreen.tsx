import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  TextInput,
  Button,
} from 'react-native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {SERVER_IP, SERVER_PORT} from '../config';

const HomeScreen = () => {
  const navigation = useNavigation();
  const device = useCameraDevice('front');
  const camera = useRef(null);
  const [imageData, setImageData] = useState([]);
  const [takePhotoClicked, setTakePhotoClicked] = useState(false);
  const [personName, setPersonName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      await checkPermission();
      console.log('Fetching data from Flask');
    };

    fetchData();
  }, []);

  const checkPermission = async () => {
    const newCameraPermission = await Camera.requestCameraPermission();
    console.log(newCameraPermission);
  };

  const takePicture = async () => {
    if (camera.current) {
      const photo = await camera.current.takePhoto();
      setImageData([...imageData, photo.path]);
      setTakePhotoClicked(false);
      console.log(photo.path);
    }
  };

  const handleFileUpload = async () => {
    try {
      const data = new FormData();
      data.append('name', personName);
      imageData.forEach((path, index) => {
        data.append('pic', {
          uri: 'file://' + path,
          name: `image_${index}.jpg`,
          type: 'image/jpeg',
        });
      });

      const userId = await AsyncStorage.getItem('userId');
      const csrf = await AsyncStorage.getItem('csrf');

      if (!userId || !csrf) {
        console.error('User ID or CSRF token not found in AsyncStorage.');
        return;
      }

      const url = `http://${SERVER_IP}:${SERVER_PORT}/api/uploadapi`;
      const headers = {
        'Content-Type': 'multipart/form-data',
        'X-CSRFToken': csrf,
        id: userId,
      };

      const response = await axios.post(url, data, {headers});
      console.log(response.data);

      Toast.show({
        type: 'success',
        text1: 'Files uploaded successfully',
      });
      setImageData([]);
      setPersonName('');
    } catch (error) {
      console.error('Error uploading images:', error);
      Toast.show({
        type: 'error',
        text1: 'Error uploading images',
      });
    }
  };

  if (device == null) {
    return <ActivityIndicator />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Multiple File Uploads</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Person's Name"
        value={personName}
        onChangeText={setPersonName}
      />
      <Button title="Upload Files" onPress={handleFileUpload} />
      {takePhotoClicked ? (
        <View style={{flex: 1}}>
          <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            photo={true}
          />
          <TouchableOpacity style={styles.pictureButton} onPress={takePicture}>
            <Text style={styles.captureButton}>Capture</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.imageContainer}>
          {imageData.length > 0 &&
            imageData.map((img, index) => (
              <Image
                key={index}
                source={{uri: 'file://' + img}}
                style={styles.image}
              />
            ))}
          <TouchableOpacity
            style={styles.clickPhotoBtn}
            onPress={() => setTakePhotoClicked(true)}>
            <Text style={{color: 'black'}}>Click Photo</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, justifyContent: 'center'},
  title: {fontSize: 24, textAlign: 'center', marginBottom: 20, color: 'black'},
  input: {borderWidth: 1, padding: 10, marginBottom: 20, color: 'black'},
  pictureButton: {
    width: 60,
    height: 60,
    backgroundColor: 'red',
    borderRadius: 30,
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
  },
  captureButton: {color: 'white', bottom: -18, alignSelf: 'center'},
  imageContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  image: {width: 100, height: 100, margin: 5},
  clickPhotoBtn: {
    width: '90%',
    height: 50,
    borderWidth: 1,
    alignSelf: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
