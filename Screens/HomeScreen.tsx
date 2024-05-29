import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Camera, useCameraDevice} from 'react-native-vision-camera';

const HomeScreen = ({navigation}) => {
  const device = useCameraDevice('front');
  const camera = useRef<Camera>(null);
  const [flaskData, setFlaskData] = useState([{}]);
  const [imageData, setImageData] = useState('');
  const [takePhotoClicked, setTakePhotoClicked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await checkPermission();
      console.log('Fetching data from Flask');
      try {
        const res = await fetch(
          'https://c9be-34-106-93-98.ngrok-free.app/members',
        );
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await res.json();
        setFlaskData(data);
        console.log('Data from Flask:', data);
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const checkPermission = async () => {
    const newCameraPermisson = await Camera.requestCameraPermission();
    console.log(newCameraPermisson);
  };

  if (device == null) {
    return <ActivityIndicator />;
  }

  const takePicture = async () => {
    if (camera.current != null) {
      const photo = await camera.current.takePhoto();
      setImageData(photo.path);
      setTakePhotoClicked(false);
      console.log(photo.path);
    }
  };

  return (
    <View style={{flex: 1}}>
      {takePhotoClicked ? (
        <View style={{flex: 1}}>
          <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            photo={true}
          />
          <TouchableOpacity
            style={styles.pictureButton}
            onPress={() => {
              takePicture();
            }}>
            <Text style={styles.captureButton}>Capture</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.imageContainer}>
          {imageData !== '' && (
            <Image source={{uri: 'file://' + imageData}} style={styles.image} />
          )}
          <TouchableOpacity
            style={styles.clickPhotoBtn}
            onPress={() => setTakePhotoClicked(true)}>
            <Text style={{color: 'black'}}>click photo</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  image: {width: '100%', height: 500},
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
