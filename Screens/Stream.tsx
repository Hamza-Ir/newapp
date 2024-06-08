import {View, StyleSheet, Button, Text} from 'react-native';
import React from 'react';
import {VLCPlayer} from 'react-native-vlc-media-player';
import {useRoute, useNavigation} from '@react-navigation/native';

const Stream = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {streamUrl} = route.params || {};

  return (
    <View style={styles.container}>
      {streamUrl ? (
        <>
          <VLCPlayer
            style={styles.video}
            videoAspectRatio="16:9"
            source={{uri: streamUrl}}
          />
          <Button
            title="Clear Stream"
            onPress={() => navigation.setParams({streamUrl: null})}
          />
        </>
      ) : (
        <Text style={styles.text}>No streams added</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: 200,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'darkblue',
  },
});

export default Stream;
