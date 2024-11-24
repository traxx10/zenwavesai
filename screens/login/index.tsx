import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import ArrowBackIcon from '@/assets/icons/back.svg';
import { TopSpace } from '@/components/TopSpace';
import { style } from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Login = () => {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to handle the Continue button click
  const handleContinue = async () => {
    if (!phoneNumber || !password) {
      setError('Please enter both phone number and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Send the request to the FastAPI server
      const response = await fetch('http://127.0.0.1:8000/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: phoneNumber, password: password }),
      });

      const result = await response.json();
      console.log('FastAPI Response:', result); // Log the response from FastAPI server

      if (result.status === 'success') {
        console.log('Login successful');
        await AsyncStorage.setItem('userInput', phoneNumber); // Store the user's phone number
        await AsyncStorage.setItem('userId', result.user_id); // Store the user's ID
        setLoading(false);
        router.push('/feed' as any); // Navigate to the home page upon successful login
      } else {
        console.log('Invalid credentials');
        setError(result.detail || 'Invalid credentials. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setLoading(false);
      setError('Unable to log in. Please try again.');
    }
  };

  return (
    <SafeAreaView style={style.innerWrap}>
      <StatusBar style="light" translucent={true} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={style.innerWrap}
        >
          <View>
            <TopSpace top={Platform.OS === 'ios' ? 11 : 30} />
            <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()}>
              <ArrowBackIcon />
            </TouchableOpacity>
            <TopSpace top={28} />
            <Text style={style.welcomeBackBtn}>Welcome back</Text>
            <TopSpace top={36} />
            <Text style={style.fieldTitle}>Phone number</Text>
            <TopSpace top={10} />
            <TextInput
              style={style.inputField}
              keyboardType="number-pad"
              placeholderTextColor={'#6A7F84'}
              placeholder="Your phone number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
            <TopSpace top={20} />
            <Text style={style.fieldTitle}>Password</Text>
            <TextInput
              style={style.inputField}
              secureTextEntry
              placeholderTextColor={'#6A7F84'}
              placeholder="Your password"
              value={password}
              onChangeText={setPassword}
            />
            {error ? (
              <Text style={{ color: 'red', textAlign: 'center', marginTop: 5 }}>
                {error}
              </Text>
            ) : null}
          </View>

          <View>
            {loading && <ActivityIndicator size="large" color={'#000000'} />}
            <TouchableOpacity
              style={{
                backgroundColor: '#000000', // Black background
                padding: 15,
                alignItems: 'center',
                borderRadius: 15,
              }}
              onPress={!loading ? handleContinue : () => {}} // Disable click when loading
              activeOpacity={0.8}
            >
              <Text style={{ color: '#FFFFFF' }}>Continue</Text>
            </TouchableOpacity>
            <TopSpace top={30} />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Login;
