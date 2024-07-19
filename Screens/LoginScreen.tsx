import axios from 'axios';
import React from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import Toast from 'react-native-toast-message';
import {Cookies} from '@react-native-cookies/cookies';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const handleLogin = async data => {
    const {email, password} = data;

    try {
      const response = await axios.post('http://44.201.164.10:5000/api/login', {
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
        console.log('User ID:', userId);

        // Save the unique ID to AsyncStorage or a state management solution
        await AsyncStorage.setItem('userId', userId);

        // Save the cookie
        const csrf = response.data.csrf;
        console.log('User cookie:', csrf);
        await AsyncStorage.setItem('csrf', csrf);

        console.log('Navigating to MainTabs');
        navigation.replace('MainTabs');
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
    }
  };

  return (
    <View style={styles.container}>
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

      <Button title="Login" onPress={handleSubmit(handleLogin)} />

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
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
  makeAccount: {
    color: 'grey',
    marginTop: 14,
    textAlign: 'center',
  },
});

export default LoginScreen;
