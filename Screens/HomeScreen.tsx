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
  //const [flaskData, setFlaskData] = useState([{}]);
  const [imageData, setImageData] = useState('');
  const [takePhotoClicked, setTakePhotoClicked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await checkPermission();
      console.log('Fetching data from Flask');
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

      // Create a new FormData object
      const data = new FormData();
      data.append('file', {
        uri: 'file://' + photo.path,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });

      // Send the image to the Flask server
      try {
        const response = await fetch(
          'https://99a3-34-73-12-10.ngrok-free.app/upload',
          {
            method: 'POST',
            body: data,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        const result = await response.json();
        console.log(result);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
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
