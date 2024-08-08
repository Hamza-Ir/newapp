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
import {getServerConfig} from '../config'; // Assuming this is the correct path

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const SignupScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [ip, setIp] = useState('');
  const [port, setPort] = useState('');

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Load the current IP and port from getServerConfig
  useEffect(() => {
    const loadServerConfig = async () => {
      const {ip: storedIp, port: storedPort} = await getServerConfig();
      setIp(storedIp);
      setPort(storedPort);
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

  // Save the IP and port to getServerConfig
  const saveServerConfig = async () => {
    const isConnected = await checkServerConnectivity(ip, port);
    if (isConnected) {
      try {
        await getServerConfig(ip, port); // Update the config with new IP and port
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

  const handleSignup = async data => {
    setLoading(true);
    const {name, email, password} = data;

    try {
      const response = await axios.post(`http://${ip}:${port}/api/register`, {
        name,
        email,
        password,
        device_urls: {},
      });

      if (response.status === 201) {
        Toast.show({
          type: 'success',
          text1: 'Signup successful!',
          text2: 'You can now log in.',
          position: 'bottom',
        });
        navigation.replace('Login');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Signup failed',
          text2: response.data.message,
          position: 'bottom',
        });
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Signup failed',
        text2: err.response?.data?.message || 'An error occurred.',
        position: 'bottom',
      });
      console.log('Catch error:', err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.serverInfoContainer}>
        <Text style={styles.label}>Current IP Address: {ip}</Text>
        <Text style={styles.label}>Current Port: {port}</Text>
      </View>

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
      <View style={{paddingBottom: 30}}>
        <View style={styles.buttonWrapper}>
          <Button title="Save Configuration" onPress={saveServerConfig} />
        </View>
      </View>

      <Text style={styles.heading}>Sign Up</Text>

      <Text style={styles.labels}>Name:</Text>

      <Controller
        control={control}
        name="name"
        render={({field: {onChange, onBlur, value}}) => (
          <View>
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Name"
              autoCapitalize="none"
            />
            {errors.name && (
              <Text style={styles.errorText}>{errors.name.message}</Text>
            )}
          </View>
        )}
      />

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

      <Text style={styles.labels}>Confirm Password:</Text>

      <Controller
        control={control}
        name="confirmPassword"
        render={({field: {onChange, onBlur, value}}) => (
          <View>
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Confirm Password"
              secureTextEntry
              autoCapitalize="none"
            />
            {errors.confirmPassword && (
              <Text style={styles.errorText}>
                {errors.confirmPassword.message}
              </Text>
            )}
          </View>
        )}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.buttonWrapper}>
          <Button title="Sign Up" onPress={handleSubmit(handleSignup)} />
        </View>
      )}

      <Text style={styles.makeAccount}>
        Already have an account?{'  '}
        <Text
          onPress={() => navigation.navigate('Login')}
          style={{color: 'blue'}}>
          Log In
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
    fontSize: 25,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  labels: {
    fontSize: 14,
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
  buttonWrapper: {
    position: 'relative',
    alignItems: 'center',
    marginTop: 20,
  },
  makeAccount: {
    color: 'grey',
    marginTop: 14,
    textAlign: 'center',
  },
});

export default SignupScreen;
