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
  Alert,
} from 'react-native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import messaging from '@react-native-firebase/messaging';
import {getServerConfig} from '../config';

const sendTokenToServer = async token => {
  try {
    const csrf = await AsyncStorage.getItem('csrf');
    const userId = await AsyncStorage.getItem('userId');
    console.log('CSRF:', csrf);
    console.log('User ID:', userId);

    if (!csrf || !userId) {
      throw new Error('Missing CSRF token or user ID');
    }

    const headers = {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrf,
      id: userId,
    };

    //getting ip address and port
    const {ip, port} = await getServerConfig();
    console.log('Server IP:', ip);
    console.log('Server Port:', port);

    const url = `http://${ip}:${port}/api/sendToken`;
    console.log('Request URL:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({token}),
    });

    if (!response.ok) {
      throw new Error('Failed to send token to server');
    }

    const responseData = await response.json();
    console.log('Parsed response data:', responseData);
  } catch (error) {
    console.error('Error sending token to server:', error);
    Alert.alert('Error', 'Unable to send token to server.');
  }
};

const getToken = async () => {
  try {
    const token = await messaging().getToken();
    await AsyncStorage.setItem('token', token);
    await sendTokenToServer(token);
  } catch (error) {
    console.error('Error getting token:', error);
  }
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const device = useCameraDevice('front');
  const camera = useRef(null);
  const [imageData, setImageData] = useState([]);
  const [takePhotoClicked, setTakePhotoClicked] = useState(false);
  const [personName, setPersonName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await checkPermission();
    };

    fetchData();
    getToken();
  }, []);

  const checkPermission = async () => {
    const newCameraPermission = await Camera.requestCameraPermission();
    if (newCameraPermission !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Camera permission is required to take photos.',
      );
    }
  };

  const takePicture = async () => {
    if (camera.current) {
      try {
        const photo = await camera.current.takePhoto();
        setImageData([...imageData, photo.path]);
        setTakePhotoClicked(false);
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  };

  const handleFileUpload = async () => {
    try {
      setLoading(true);

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
        throw new Error('User ID or CSRF token not found');
      }
      const {ip, port} = await getServerConfig();

      const url = `http://${ip}:${port}/api/uploadapi`;
      const headers = {
        'Content-Type': 'multipart/form-data',
        'X-CSRFToken': csrf,
        id: userId,
      };

      const response = await axios.post(url, data, {headers});
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
    } finally {
      setLoading(false);
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
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button
          title="Upload Files"
          onPress={handleFileUpload}
          disabled={loading}
        />
      )}
      {takePhotoClicked ? (
        <View style={styles.cameraContainer}>
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
            <Text style={styles.clickPhotoText}>Click Photo</Text>
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
  cameraContainer: {flex: 1},
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
  clickPhotoText: {color: 'black'},
});

export default HomeScreen;
