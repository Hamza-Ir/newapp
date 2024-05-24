import {StyleSheet} from 'react-native';
import React from 'react';
import {VLCPlayer} from 'react-native-vlc-media-player';

const Stream = () => {
  return (
    <VLCPlayer
      style={[styles.video]}
      videoAspectRatio="16:9"
      source={{
        uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      }}
    />
  );
};

const styles = StyleSheet.create({
  video: {
    width: '100%',
    height: 200,
  },
});

export default Stream;
