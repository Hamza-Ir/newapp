import AsyncStorage from '@react-native-async-storage/async-storage';

export const getServerConfig = async () => {
  try {
    const ip = (await AsyncStorage.getItem('SERVER_IP')) || '';
    const port = (await AsyncStorage.getItem('SERVER_PORT')) || '';
    return {ip, port};
  } catch (error) {
    console.error('Error fetching server config:', error);
    return {ip: '', port: ''};
  }
};
