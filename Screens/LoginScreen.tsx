import axios from 'axios';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';
import {getServerConfig} from '../config';

// Validation schema
const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(4, 'Password must be at least 4 characters')
    .required('Password is required'),
});

const LoginScreen = ({navigation}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [ip, setIp] = useState('');
  const [port, setPort] = useState('');
  const [loading, setLoading] = useState(false);

  // Load the current IP and port from AsyncStorage
  useEffect(() => {
    const loadServerConfig = async () => {
      const {ip: ipadress, port: portadress} = await getServerConfig();
      setIp(ipadress);
      setPort(portadress);
    };

    loadServerConfig();
  }, []);

  // Check server connectivity
  const checkServerConnectivity = async (ip, port) => {
    try {
      const response = await axios.get(`http://${ip}:${port}/api/test`);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  };

  // Save the IP and port to AsyncStorage
  const saveServerConfig = async () => {
    const isConnected = await checkServerConnectivity(ip, port);
    if (isConnected) {
      try {
        await AsyncStorage.setItem('SERVER_IP', ip);
        await AsyncStorage.setItem('SERVER_PORT', port);
        Toast.show({
          type: 'success',
          text1: 'Server configuration saved',
        });
      } catch (error) {
        console.error('Error saving server config:', error);
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Server Connectivity Failed',
        text2:
          'Unable to connect to the server with the provided IP address and port.',
      });
    }
  };

  const handleLogin = async data => {
    const {email, password} = data;

    setLoading(true); // Show the loading spinner

    try {
      const response = await axios.post(`http://${ip}:${port}/api/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        // Login successful
        Toast.show({
          type: 'success',
          text1: 'Login successful',
        });

        const userId = response.data.id;
        //console.log('User ID:', userId);

        // Save the unique ID to AsyncStorage or a state management solution
        await AsyncStorage.setItem('userId', userId);

        // Save the cookie
        const csrf = response.data.csrf;
        //console.log('User cookie:', csrf);
        await AsyncStorage.setItem('csrf', csrf);

        setTimeout(() => {
          RNRestart.Restart();
        }, 3000);
      } else {
        // Login failed with a custom message
        Toast.show({
          type: 'error',
          text1: 'Login failed',
          text2: response.data.message,
        });
        console.log('Login error:', response.data.message);
      }
    } catch (err) {
      // Handle any errors that occur during the request
      if (err.response && err.response.data && err.response.data.message) {
        Toast.show({
          type: 'error',
          text1: 'Login failed',
          text2: err.response.data.message,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Login failed',
          text2: err.message,
        });
      }
      console.log('Catch error:', err);
    } finally {
      setLoading(false); // Hide the loading spinner
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Current IP Address: {ip}</Text>
      <Text style={styles.label}>Current Port: {port}</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter IP Address"
        value={ip}
        onChangeText={setIp}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Port"
        value={port}
        onChangeText={setPort}
      />
      <View style={{paddingBottom: 50}}>
        <View style={styles.buttonWrapper}>
          <Button title="Save Configuration" onPress={saveServerConfig} />
        </View>
      </View>

      <Text style={styles.heading}>Login</Text>

      <Text style={styles.labels}>Email:</Text>

      <Controller
        control={control}
        name="email"
        render={({field: {onChange, onBlur, value}}) => (
          <View>
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email.message}</Text>
            )}
          </View>
        )}
      />

      <Text style={styles.labels}>Password:</Text>

      <Controller
        control={control}
        name="password"
        render={({field: {onChange, onBlur, value}}) => (
          <View>
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Password"
              secureTextEntry
              autoCapitalize="none"
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password.message}</Text>
            )}
          </View>
        )}
      />

      <View style={styles.buttonWrapper}>
        <Button
          title="Login"
          onPress={handleSubmit(handleLogin)}
          disabled={loading}
        />
        {loading && (
          <ActivityIndicator
            style={styles.spinner}
            size="small"
            color="#0000ff"
          />
        )}
      </View>

      <Text style={styles.makeAccount}>
        Don't have an account?{'  '}
        <Text
          onPress={() => {
            navigation.navigate('Signup');
          }}
          style={{color: 'blue'}}>
          Sign Up
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  heading: {
    fontSize: 34,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  labels: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    color: 'black',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  label: {
    fontSize: 12,
    marginBottom: 10,
    color: 'black',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
  makeAccount: {
    color: 'grey',
    marginTop: 14,
    textAlign: 'center',
  },
  buttonWrapper: {
    position: 'relative',
    alignItems: 'center',
    marginTop: 20,
  },
  spinner: {
    position: 'absolute',
    top: 10,
  },
});

export default LoginScreen;
