import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {supabase} from '../services/supabaseClient';

// Validation schema
const schema = yup.object().shape({
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
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleSignup = async data => {
    setLoading(true);
    const {email, password} = data;

    try {
      const {data: signupResposne, error} = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      setLoading(false);

      // To get user Data
      //console.log('SignUp Response Data:', signupResposne);

      if (error) {
        ToastAndroid.show('Signup failed: ' + error.message, ToastAndroid.LONG);
        console.log('Signup error:', error);
        return;
      }

      if (data) {
        ToastAndroid.show(
          'Signup successful! You can now log in.',
          ToastAndroid.LONG,
        );
        console.log('Navigating to LoginScreen');
        navigation.replace('Login');
      }
    } catch (err) {
      setLoading(false);
      ToastAndroid.show('Signup failed: ' + err.message, ToastAndroid.LONG);
      console.log('Catch error:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sign Up</Text>

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
        <Button title="Sign Up" onPress={handleSubmit(handleSignup)} />
      )}

      <Text style={styles.makeAccount}>
        Already have an account?{'  '}
        <Text
          onPress={() => navigation.navigate('LoginScreen')}
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

export default SignupScreen;
